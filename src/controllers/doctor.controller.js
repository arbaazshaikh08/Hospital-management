import { Doctor } from "../model/Doctor.model.js"
import  {asyncHandlar } from "../utils/asyncHandlar.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponce } from "../utils/ApiResponce.js"
import { Hospital } from "../model/Hospital.Model.js"
import mongoose from "mongoose"


// Create Doctor 
const createDoctor = asyncHandlar(async(req, res) => {
    try {
        const {name , salary, qualification,exparienceInyear, workingInHospital  } = req.body
    
        if ([ name, salary, qualification ].some((field) => typeof field === 'string' && field?.trim () === "") ) {
            throw new ApiError(400,"All field  are required" )
        }
    
        if (workingInHospital && !mongoose.Types.ObjectId.isValid(workingInHospital)) {
          throw new ApiError(400, "Invalid Hospital reference");
      }
      
        // create doctor
        const doctor = await Doctor.create(
            {name, 
            salary, 
            qualification, 
            exparienceInyear,
            workingInHospital 
        })
     
        return res
        .status(200)
        .json( new ApiResponce(200, doctor, "Doctor created successfully"))
    } catch (error) {
        return res
        .status(error.statusCode || 500)
        .json({message: error.message || "Something went wrong"});
    }
})

// Get Doctor Deatails
const getdoctorDetails = asyncHandlar(async(req, res) => {
  const {doctorId }= req.params
  try {
    
    const doctor = await Doctor.findById(doctorId)
    
    if (!doctor) {
        throw new ApiError(404, "Doctor not Found")
    }

    return res
    .status(200)
    .json(
        new ApiResponce(200, doctor, "Restaurent finded Successfully")
    )
  } catch (error) {
    return res
    .status(error.statusCode || 500 )
    .json( error || "Something Went Wrong")
  }
})
    
// get All doctor
const getAllDoctor = asyncHandlar(async(req, res) => {

const  doctor = await Doctor.find({});

    // Check if the restaurants array is empty
    if (!doctor || doctor.length === 0) {
        throw new ApiError(404, "No Doctor Found");
    }

    return res
    .status(200)
    .json( new ApiResponce(200, 
      {
        totalCount: doctor.length,
        doctor
      }, "doctor fetched successfully"))
});

//Update Doctor
const updateDoctor = asyncHandlar(async (req, res) => {
  const { doctorId } = req.params;
   try {
    
    const { name, salary, qualification, experienceInYear,  workingInHospital } = req.body;
  
    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { name, salary, qualification, experienceInYear, workingInHospital },
      
      { new: true }
    );
  
    if (!doctor) {
      throw new ApiError(404, "Doctor not found" );
    }
  
    return res.
    status(200).
    json(new ApiResponce( 200, doctor,"Doctor updated successfully"))
      
    } catch (error) {
        return res
        .status(error.statusCode || 500)
        .json({message: error.message || "Something went wrong"});
    }
});

// Delete a Doctor
const deleteDoctor = asyncHandlar(async (req, res) => {
    const { doctorId } = req.params;
  
    try {
      const doctor = await Doctor.findByIdAndDelete(doctorId);
  
      if (!doctor) {
        throw new ApiError(404, "Doctor not found" );
      }
  
      return res
      .status(200)
      .json(new ApiResponce(200,"Doctor deleted successfully"))
      
    } catch (error) {
        return res
        .status(error.statusCode || 500)
        .json({message: error.message || "Something went wrong"});
    }
}); 
  
  
export {
    createDoctor,
    getdoctorDetails,
    getAllDoctor,
    updateDoctor,
    deleteDoctor
}