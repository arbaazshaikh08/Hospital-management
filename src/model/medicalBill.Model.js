import mongoose from "mongoose";


const medicalBillSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Types.ObjectId, 
    ref: 'Patient',
     required: true 
    },

  treatmentDetails: [
    {
      description: String,
      cost: Number
    }
  ],

  totalAmount: { 
    type: Number, 
    required: true
 },

  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid'],
    default: 'Unpaid'
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const MedicalBill = mongoose.model("MedicalBill", medicalBillSchema);
