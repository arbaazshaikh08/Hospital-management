import mongoose from "mongoose"

const DoctorSchema = new mongoose.Schema({
    name : {
      type:String,
      required : true
    },
    salary : {
      type:String,
      required : true
    },
    qualification : {
      type:String,
      required : true
    },
    exparienceInyear : {
      type:String,
      default : 0
    },
    workingInHospital : [{ 
       type: mongoose.Types.ObjectId ,
      ref: "Hospital",
      required: true
    },
    ],
    },{timestamp:true})
    export const Doctor = mongoose.model("Doctor",DoctorSchema )