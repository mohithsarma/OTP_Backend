const express = require('express')
const router = express.Router()

//Handlers from controllers
const {login, signup, sendotp} = require("../controllers/auth")
const {auth} = require('../middlewares/authMiddle')

router.post('/login', login)
router.post('/signup', signup)
router.post('/sendotp', sendotp)


//testing protected route
router.get("/test",auth, (req,res)=>{
    res.json({
        success: true,
        message: "You are a valid USER "
    })
})


module.exports = router