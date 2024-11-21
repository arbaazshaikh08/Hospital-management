import { Router } from "express";
import { verifyJWT } from "../middleweres/auth.middleweres.js";
import { createDoctor, deleteDoctor, getAllDoctor, getdoctorDetails, updateDoctor } from "../controllers/doctor.controller.js";


const router = Router()

router.route("/create").post(verifyJWT, createDoctor)
router.route("/doctor-Deatail/:doctorId").get(verifyJWT, getdoctorDetails)
router.route("/getAll").get(verifyJWT, getAllDoctor )
router.route("/update/:doctorId").post(verifyJWT, updateDoctor )
router.route("/delete/:doctorId").delete(verifyJWT, deleteDoctor )


export default router