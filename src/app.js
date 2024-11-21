import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// imported router
import PatientRouter from './routes/patient.route.js'
import HospitalRouter from './routes/hospital.route.js'
import DoctorRouter from './routes/doctor.route.js'

app.use("/api/v1/Patient", PatientRouter)
app.use("/api/v1/Hospital", HospitalRouter)
app.use("/api/v1/Doctor", DoctorRouter)





export {app}