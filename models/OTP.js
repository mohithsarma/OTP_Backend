const mongoose= require("mongoose")
const mailSender = require('../utils/mailSender')

const OTPSchema = new mongoose.Schema({
    number: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
	},
})

// Define a function to send emails
async function sendVerificationEmail(number, otp) {
	// Send the OTP using our custom mailSender Function
	try {
		const mailResponse = await mailSender(
			number,
			"Verification number",
			`<h1>Please confirm your OTP </h1>
             <p> here is your OTP code:-> ${otp} </p>
            `
		);
		console.log("OTP sent successfully: ", mailResponse);
	} catch (error) {
		console.log("Error occurred while sending OTP to number: ", error);
		throw error;
	}
}

OTPSchema.pre("save", async function (next) {
	console.log("New document saved to database");

	// Only send an OTP to number when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.number, this.otp);
	}
	next();
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;