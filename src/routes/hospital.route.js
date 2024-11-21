import { Router } from "express";
import { changeCurrentPassword, closeHospital, createHospital, deleteHospital, getHospitalDetails, OpenHospital, refreshAccessToken, updateHospital } from "../controllers/hospital.controller.js";
import { verifyJWT } from "../middleweres/auth.middleweres.js";

const router = Router()

router.route("/create").post(createHospital)
router.route("/open").post(OpenHospital)
router.route("/refresh-token").post(refreshAccessToken)

// secure Route
router.route("/update/:hospitalId").patch(verifyJWT, updateHospital);
router.route("/close").post(verifyJWT, closeHospital);
router.route("/get-Hospital/:hospitalId").get(verifyJWT, getHospitalDetails);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/delete/:hospitalId").delete(verifyJWT, deleteHospital);


export default router