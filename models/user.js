const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    number: {
        type: String,
        required : true,
        trim: true
    },


})

module.exports = mongoose.model('user', userSchema)