import mongoose from "mongoose";

const medicalRecourdSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    condition: {
        type: String,
        required: true,
        trim: true
    },
    dateDiagnosed: {
        type: Date,
    required: true,
    },
    treatment: {
        type: String,
        trim: true,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: String,
        default: Date.now,
    }

}, {timestamp:true})


export const MedicalRecord = mongoose.model("MedicalRecord", medicalRecourdSchema)