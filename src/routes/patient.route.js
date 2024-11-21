import { Router } from "express";
import { verifyJWT } from "../middleweres/auth.middleweres.js";
import { addMedicalRecord, createPatient, deleteMedicalRecord, getAllMedicalRecords, getPatientDetails, updatePatient, patientMedicalBill, getMedicalBill, updateMedicalBill,  deleteMedicalBill, getAllpatient, deletePatient} from "../controllers/patient.controller.js";


const router = Router() 

// Patient Routes

router.route("/create-patient").post(createPatient)
router.route("/get-patient/:patientId").get(verifyJWT, getPatientDetails)
router.route("/upate-patient/:patientId").post(verifyJWT, updatePatient)
router.route("/All-patient").get(verifyJWT, getAllpatient)
router.route("/delete-patient/:patientId").delete(verifyJWT, deletePatient )


// Medical Records
router.route("/medical-records/:patientId").post(verifyJWT, addMedicalRecord)
router.route("All-medical-record/:recordId").get(verifyJWT, getAllMedicalRecords)
router.route("/update-medical-record/:recordId").get(verifyJWT, )
router.route("/delete-medical-record/:recordId").delete(verifyJWT, deleteMedicalRecord)


// MedicalBill Records
router.route("/medical-bill/:patientId").post(verifyJWT, patientMedicalBill )
router.route("/All-medical-bill/:billId").get(verifyJWT, getMedicalBill)
router.route("/update-medical-bill/:billId").patch(verifyJWT, updateMedicalBill)
router.route("/delete-medical-bill/:billId").delete(verifyJWT, deleteMedicalBill)

export default router