
import { Hospital } from "../model/Hospital.Model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandlar } from "../utils/asyncHandlar.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandlar(async(req, _, next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if (!token) {
            throw new ApiError(401, "Unothorized Request")
        }
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const hospital = await Hospital.findById(decodedToken?._id).select("-password -refreshToken")
        
        if (!hospital) {
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.hospital = hospital ;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid accessToken")
    }
})
    