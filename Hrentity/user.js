const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        required:true,
        type:Number,
        unique: true
    },
    userName: {
        required: true,
        type: String
    },
    userRole: String,
    mobileNumber: String,
    emailId: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    department: String,
});



module.exports = mongoose.model('user', userSchema)