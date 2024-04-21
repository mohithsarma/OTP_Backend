const bcrypt = require('bcrypt')
const user = require("../models/user")
const jwt= require('jsonwebtoken')
const OTP = require('../models/OTP')
const otpGenerator = require("otp-generator");
require('dotenv').config()
//signup handle
exports.signup = async(req, res)=> {
    try {
        //get input data
        const {number, otp}= req.body

        // Check if All Details are there or not
		if (!number	) {
			return res.status(403).send({
				success: false,
				message: "enter the phone number",
			});
		}

        //check if use already exists?
        const existingUser = await user.findOne({number})
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        // Find the most recent OTP for the number
		const response = await OTP.find({ number }).sort({ createdAt: -1 }).limit(1);
		console.log(response);
		if (response.length === 0) {
			// OTP not found for the number
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		} else if (otp !== response[0].otp) {
			// Invalid OTP
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		}


        const User = await user.create({
            number
        })

        return res.status(200).json({
            success: true,
            User,
            message: "user created successfully "
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message : "User registration failed"
        })
    }
}

// login handle 
exports.login = async(req, res)=> {

    try {
        //data fetch
        const {number, otp} = req.body
        //validation on OTP and number
        if(!number || !otp){
            return res.status(400).json({
                success:false,
                message: "please fill both number and OTP correctly"
            })
        }

        //check for registered User
        let User= await  user.findOne({number})
        //if user not registered or not found in database
        if(!User){
            return res.status(401).json({
                success: false,
                message: "You have to Signup First"
            })
        }

        const payload ={
            number: User.number,
            id: User._id,
        }
        // verify OTP and generate a JWt token
        const response = await OTP.find({ number }).sort({ createdAt: -1 }).limit(1);
        console.log(response[0].otp)
        if(otp == response[0].otp){
            //if OTP matched
             //now lets create a JWT token
             let token = jwt.sign(payload, 
                        process.env.JWT_SECRET,
                        {expiresIn: "2h"}
                        )
            User = User.toObject()
            User.token = token
            
            User.password = undefined
            const options = {
                expires: new Date( Date.now()+ 3*24*60*60*1000),
                httpOnly: true  

            }
            res.cookie(
                "token",
                token,
                options
            ).status(200).json({
                success: true,
                token,
                User,
                message: "Logged in Successfully"

            })

        }else{
            //OTP do not match
            return res.status(403).json({
                success: false,
                message: "OTP incorrect"
            })
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Login failure⚠️ :" + error
        })
    }

}

// send otp handle
exports.sendotp = async (req, res) => {
    try {
      const { number } = req.body;
  
      const checkUserPresent = await user.findOne({ number });
  
      var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      }); // Generate 6-digit numeric OTP
  
      const result = await OTP.findOne({ otp: otp }); // Check for duplicate OTP
      console.log("Result is Generate OTP Func");
      console.log("OTP", otp);
      console.log("Result", result);
  
      while (result) {
        otp = otpGenerator.generate(6, { upperCaseAlphabets: false });
      }
  
      const otpPayload = { number, otp }; // Create OTP payload with phone number
      const otpBody = await OTP.create(otpPayload); // Save OTP in database
      console.log("OTP Body", otpBody);
  
      res.status(200).json({
        success: true,
        message: `OTP Sent Successfully`,
        otp, // Include OTP in response 
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  };
  