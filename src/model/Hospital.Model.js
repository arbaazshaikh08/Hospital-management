
import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const hospitalSchma = new mongoose.Schema({

    name :{
      type :String,
      required : true,
      unique: true
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true, // license number is unique
    },
    password: {
      type: String,
      required: true,
    },
    AddressLine1:{
      type :String,
      required : true
    },
    AddressLine2:{
      type :String,
    },
    city:{
      type :String,
      required : true
    },
    refreshToken: {
      type: String,
    },
    pincode:{
      type :String,
      required : true
    },
    specilizedIn:
      {
        type:[String],
        
      },
    },
    {timestamp:true})

    hospitalSchma.pre("save", async function (next) {
      if (!this.isModified("password")) 
        return next()

        this.password = await bcrypt.hash(this.password, 10)
        next();
      
    })

    hospitalSchma.methods.isPasswordCorrect = async function (password) {
      return await bcrypt.compare(password, this.password)
    }

hospitalSchma.methods.generateAccessToken = function(){
  return jwt.sign(
    {
      _id: this._id,
      licenseNumber: this.licenseNumber,
      name: this.name,
        
    },
    process.env.ACCESS_TOKEN_SECRET,

    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
 )
}
hospitalSchma.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}
    
export const  Hospital = mongoose.model(" Hospital", hospitalSchma)