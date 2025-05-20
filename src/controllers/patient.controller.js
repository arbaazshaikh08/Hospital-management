import { Patient } from "../model/patient.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { asyncHandlar } from "../utils/asyncHandlar.js"; 
import mongoose from "mongoose";
import { MedicalBill } from "../model/medicalBill.Model.js";
import { MedicalRecord } from "../model/medical-record.model.js";

//Create Patient
const createPatient = asyncHandlar(async (req, res) => {
  try {
    const {
      name,
      diagonalwidth,
      Address,
      age,
      bloodgroup,
      gender,
      mobileNumber,
      password,
      admittedIn,
    } = req.body;

    if (
      [
        name,
        diagonalwidth,
        Address,
        age,
        bloodgroup,
        gender,
        mobileNumber,
        password,
        admittedIn,
      ].some((field) => typeof field === "string" && field.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }
    if (admittedIn && !mongoose.Types.ObjectId.isValid(admittedIn)) {
    }

    const newpatient = new Patient({
      name,
      diagonalwidth,
      Address,
      age,
      bloodgroup,
      gender,
      mobileNumber,
      password,
    });

    // Save the patient to the database
    await newpatient.save();

    return res
      .status(200)
      .json(new ApiResponce(200, newpatient, "Patient created Successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong" });
  }
});

// Get patient details by ID
const getPatientDetails = asyncHandlar(async (req, res) => {
  const { patientId } = req.params;

  try {
    const patient =
      await Patient.findById(patientId).populate("medicalRecords");

    if (!patient) {
      throw new ApiError(404, "Patient not found.");
    }

    return res
      .status(200)
      .json(
        new ApiResponce(200, patient, "Patient details fetched successfully.")
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong" });
  }
});

// Get All Patient
const getAllpatient = asyncHandlar(async (req, res) => {
  const patient = await Patient.find({});

  if (!patient || patient.length === 0) {
    throw new ApiError(404, "Patient not found");
  }
  return res.status(200).json(
    new ApiResponce(
      200,
      {
        totalCount: patient.length,
        patient,
      },
      "Patient fetched successfully"
    )
  );
});

// Update Patient Details
const updatePatient = asyncHandlar(async (req, res) => {
  const { patientId } = req.params;
  try {
    const { name, mobileNumber, Address, blodgroup, gender } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new ApiError(404, "patient not found");
    }
    patient.name = name || patient.name;
    patient.mobileNumber = mobileNumber || patient.mobileNumber;
    patient.Address = Address || patient.Address;
    patient.blodgroup = blodgroup || patient.blodgroup;
    patient.gender = gender || patient.gender;

    await patient.save();
    return res
      .status(200)
      .json(
        new ApiResponce(200, patient, "Patient details updated successfully.")
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong" });
  }
});

// Delete Patient
const deletePatient = asyncHandlar(async (req, res) => {
  const { patientId } = req.params;

  try {
    const patient = await Patient.findByIdAndDelete(patientId);

    if (!patient) {
      throw new ApiError(404, "Patient not found");
    }

    return res
      .status(200)
      .json(new ApiResponce(200, "Patient deleted successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong" });
  }
});

// Add medical Record
const addMedicalRecord = asyncHandlar(async (req, res) => {
  const { patientId } = req.params;
  try {
    const { condition, dateDiagnosed, treatment } = req.body;

    if (!condition || !dateDiagnosed) {
      throw new ApiError(400, "Condition and Date Diagnosed are required.");
    }
    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new ApiError(404, "Patient not found.");
    }

    // Create new medical record
    const newRecord = await MedicalRecord.create({
      patientId,
      condition,
      dateDiagnosed,
      treatment,
    });

    // Add the medical record to the patient's medicalRecords array
    patient.medicalRecords.push(newRecord._id);

    await patient.save();
    return res
      .status(200)
      .json(
        new ApiResponce(200, newRecord, "Medical record added successfully.")
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong" });
  }
});

// Get Medical Record
const getAllMedicalRecords = asyncHandlar(async (req, res) => {
  const { recordId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(recordId)) {
      throw new ApiError(404, "PatientID not found.");
    }
    const medicalRecord = await MedicalRecord.findById(recordId).populate(
      "patientId",
      "name"
    );

    if (!medicalRecord) {
      throw new ApiError(404, "medicalRecord not found.");
    }

    return res
      .status(200)
      .json(
        new ApiResponce(
          200,
          medicalRecord,
          "Medical records fetched successfully."
        )
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong" });
  }
});

//Delete Medical record
const deleteMedicalRecord = asyncHandlar(async (req, res) => {
  const { recordId } = req.params;

  try {
    const medicalRecord = await MedicalRecord.findByIdAndDelete(recordId);

    if (!medicalRecord) {
      throw new ApiError(404, "medical record is not found");
    }

    return res
      .status(200)
      .json(new ApiResponce(200, "Medical record deleted successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong" });
  }
});

// Add Medical Bill //

const patientMedicalBill = asyncHandlar(async (req, res) => {
  const { patientId } = req.params;

  try {
    const {
      treatmentDetails,
      totalAmount,
      paymentStatus = "Unpaid",
    } = req.body;

    if (!treatmentDetails || treatmentDetails.length === 0) {
      throw new ApiError(400, "Treatment details are required.");
    }
    const patient = await Patient.findById(patientId);

    if (!patient) {
      throw new ApiError(404, "Patient not found");
    }

    const newBill = await MedicalBill.create({
      patientId,
      treatmentDetails,
      totalAmount,
      paymentStatus,
    });

    patient.MedicalBills.push(newBill._id);

    await patient.save();

    return res
      .status(200)
      .json(new ApiResponce(200, newBill, "Medical bill added successfully."));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong." });
  }
});

// get MedicalBill
const getMedicalBill = asyncHandlar(async (req, res) => {
  const { billId } = req.params;

  try {
    // Find medical Bill
    const bill = await MedicalBill.findById(billId).populate(
      "patientId",
      "name"
    );

    if (!bill) {
      throw new ApiError(404, "Medical bill not found.");
    }
    return res
      .status(200)
      .json(new ApiResponce(200, bill, "Medical bill retrieved successfully."));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong." });
  }
});

//Update Medical Record
const updateMedicalBill = asyncHandlar(async (req, res) => {
  // const {billId} = req.params
  try {
    const { billAmount, dateIssued, billDetails } = req.body;
    if ((!billAmount, dateIssued, billDetails)) {
    }

    const user = await MedicalBill.findByIdAndUpdate(
      req.medicalBill?._id,
      {
        $set: {
          billAmount: billAmount,
          email: email,
        },
      },
      { new: true }
    );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong" });
  }
});

// Delete MEdical Bill
const deleteMedicalBill = asyncHandlar(async (req, res) => {
  try {
    const { billId } = req.params;
    if (!billId || !mongoose.Types.ObjectId.isValid(billId)) {
      throw new ApiError(404, "Bill id not found");
    }

    const medicalBill = await MedicalBill.findByIdAndDelete(billId);

    if (!medicalBill) {
      throw new ApiError(404, "medical record is not found");
    }

    return res
      .status(200)
      .json(new ApiResponce(200, "Medical Bill deleted successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong" });
  }
});

export {
  createPatient,
  getPatientDetails,
  getAllpatient,
  updatePatient,
  deletePatient,
  addMedicalRecord,
  getAllMedicalRecords,
  deleteMedicalRecord,
  patientMedicalBill,
  getMedicalBill,
  updateMedicalBill,
  deleteMedicalBill,
};
