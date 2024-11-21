import mongoose from "mongoose";

const patientSchma = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    diagonalwidth: {
        type: String,
        required: true
    },

    Address: {
        type: String,
        required: true
    },

    age:{ 
        type: Number,
        required: true
    },

    bloodgroup:{
        type: String,
        required: true
    },

    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },

    mobileNumber: { 
        type: String, 
        required: true,
         unique: true 
    },
    
    admittedIn: {
        type: mongoose.Schema.Types.ObjectId , 
        ref: "Hospital"
    },
    
    medicalRecords:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicalRecord"
    }],

    MedicalBills: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "MedicalBill"
    }],
    
},{ timestamps: true})


export const Patient = mongoose.model("Patient", patientSchma)