
import { ApiError } from "../utils/ApiError.js";
import { asyncHandlar } from "../utils/asyncHandlar.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { Hospital } from "../model/Hospital.Model.js";
import jwt from "jsonwebtoken"

// Create Hospital
const generateAccessAndRefereshTokens = async(hospitalId) => {
    try {
        const hospital = await Hospital.findById(hospitalId)
        const accessToken = hospital.generateAccessToken()
        const refreshToken = hospital.generateRefreshToken()

        hospital.refreshToken = refreshToken
        await hospital.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something Went Wrong While Generating Refresh and Access token")
    }
}

const createHospital = asyncHandlar(async(req, res) => {
    try {
        const { name, AddressLine1, AddressLine2, city, pincode, specilizedIn, licenseNumber, password } = req.body
    
    // validations
    if ([ name, AddressLine1, city, pincode, licenseNumber, password ].some((field) => field?.trim () === "") ) {
        throw new ApiError(400,"All Feild are Required" )
    }
    
    const existedHospital = await Hospital.findOne({
        $or: [{ name }, { licenseNumber }]
    });
    
    if (existedHospital) {
        throw new ApiError( 409, "Hospital with name and licenseNumber alerady exist")
    }
    
    
    const hospital = await Hospital.create(
        {
            name,
            licenseNumber,
            password,
            AddressLine1,
            AddressLine2,
            city,
            pincode,
           specilizedIn
        }) 
    
        const createdhospital = await Hospital.findById(hospital._id).select("-password -refreshToken")
    
        if (!createdhospital) {
            throw new ApiError(500, "Somthing Went Wrong While create Hospital")
        }
    
        return res
        .status(200)
        .json( new ApiResponce(200, createdhospital, "Hospital created successfully"))
    } catch (error) {
        return res
        .status(error.statusCode || 500)
        .json({message: error.message || "Something went wrong"});
    }
    
})

const OpenHospital = asyncHandlar(async(req, res) => {
    const { licenseNumber, name, password} = req.body

    if (!name && !licenseNumber) {
        throw new ApiError(400,
            "Name and LicenceNumber is requires"
        )
    }

    const hospital = await Hospital.findOne({
        $or: [{name}, {licenseNumber}]
    })
    if (!hospital) {
        throw new ApiError(404, "Hospital does not exist")
    }

    const ispasswordValid = await hospital.isPasswordCorrect(password)

    if (!ispasswordValid) {
        throw new ApiError(401, "Invalid hospital cradentials")
    }

    const {accessToken, refreshToken } = await generateAccessAndRefereshTokens(hospital._id)

    const openedHospital = await Hospital.findById(hospital._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshToken", refreshToken,options)
    .json( 
        new ApiResponce( 
            200,
         {
            hospital: openedHospital,accessToken, refreshToken
        },
        "Hospital Open Successfully"
    ))
})

const closeHospital = asyncHandlar(async(req, res) => {
    try {
        await Hospital.findByIdAndUpdate(
            req.hospital._id,
            {
                $unset: {
                    refreshToken: 1
                }
            }, 
            {
                new: true
            }
        )
        const options = {
            httpOnly: true,
            secure: true
        } 
        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json( new ApiResponce(200, {}, "Hospital Closed"))
    } catch (error) {
        return res
        .status(error.statusCode || 500)
        .json({message: error.message || "Something went wrong"});
    }
})

const refreshAccessToken =asyncHandlar(async(req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken    

        if (!incomingRefreshToken) {
            throw new ApiError(404, "Unouthorized request")
        }

        const decodedToken = jwt.verify(
            incomingRefreshToken, 
            process.env.REFRESH_TOKEN_SECRET
        )
        const hospital = await Hospital.findById(decodedToken?._id)

        if (!hospital) {
            throw new ApiError(401, "invalid refreshToken ")
        }
        if (incomingRefreshToken !== hospital?.refreshToken) {
            throw new ApiError(401, "refresh token is expired")
        }

        const options = {
            httpOnly: true,
            secure: true
        } 
        const {accessToken, newrefreshToken } = await generateAccessAndRefereshTokens(hospital._id)

        return res
        .status(200)
        .cookie("accessToken",accessToken, options )
        .cookie("refreshToken", newrefreshToken, options)
        .json( new ApiResponce(
            200,
            {accessToken, refreshToken: newrefreshToken },
            "AccessToken Refreshed"
        ))
    
    } catch (error) {
        return res
        .status(error.statusCode || 500)
        .json({message: error.message || "Something went wrong"});
    }
})

// Get Hospital ById
const getHospitalDetails  = asyncHandlar(async(req, res) => {
    const { hospitalId } = req.params;

    const hospital =await Hospital.findById(hospitalId)
    if (!hospital) {
        throw new ApiError(404, "Hospital not found")
    }
    return res
    .status(200)
    .json(new ApiResponce(200, hospital, "Hospital details fetched successfully"))
}) 

// change Password
const changeCurrentPassword = asyncHandlar(async(req, res) => {
    try {
        const {oldPassword, newPassword} = req.body
    
        const hospital = await Hospital.findById(req.hospital?._id)

        const isPasswordCorrect = await hospital.isPasswordCorrect(oldPassword)
    
        if (!isPasswordCorrect) {
            throw new ApiError(400, "Invalid Old Password")
        }
    
        hospital.password = newPassword
        await hospital.save({validateBeforeSave: false})
    
        return res
        .status(200)
        .json( new ApiResponce(200, {}, "Password changed successfully"))
    } catch (error) {
        return res
        .status(error.statusCode || 500)
        .json({message: error.message || "Something went wrong"});
    }
})
// Update Hospital
const updateHospital = asyncHandlar(async(req, res) => {
    try {
        const { hospitalId } = req.params;
        const{

            name,
            AddressLine1,  
            AddressLine2, 
            city, 
            pincode,   
            specilizedIn } = req.body;


        if ([name, AddressLine1, AddressLine2, city, pincode, specilizedIn].some((field) => typeof field === 'string' && field.trim() === "")) {
        throw new ApiError(400, "All feild Are required")
         }
        const hospital = await Hospital.findById(hospitalId)
        if (!hospital) {
            throw new ApiError(404, 'Hospital not found')
        }
        // Update hospital details
        hospital.name = name || hospital.name;
        hospital.AddressLine1 = AddressLine1 || hospital.AddressLine1;
        hospital.AddressLine2 = AddressLine2 || hospital.AddressLine2;
        hospital.city = city || hospital.city;
        hospital.pincode = pincode || hospital.pincode;
        hospital.specilizedIn = specilizedIn || hospital.specilizedIn;

        await hospital.save()
        return res
        .status(200)
        .json( new ApiResponce(200, hospital, "hospital Updated"))
    } catch (error) {
        return res
        .status(error.statusCode || 500)
        .json({message: error.message || "Something went wrong"});
    }
})

//  Delete a Hospital
const deleteHospital = asyncHandlar(async(req, res) => {
    const { hospitalId } = req.params;

    try {
        const hospital = await Hospital.findByIdAndDelete(hospitalId);
        if (!hospital) {
            throw new ApiError(404, "Hospital not found")
            }
            return res 
            .status(200)
            .json( new ApiResponce(200, hospital, "Hospital deleted successfully"))
            
    } catch (error) {
        return res
        .status(error.statusCode || 500)
        .json({message: error.message || "Something went wrong"});
    }
})

export {
    createHospital,
    OpenHospital,
    closeHospital,
    refreshAccessToken,
    updateHospital,
    changeCurrentPassword,
    getHospitalDetails,
    deleteHospital
}