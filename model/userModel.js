const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
    Pwd:{
        required: true,
        type: String
    },
    Email:{
        required: true,
        type: String,
        unique: true
    },
    MobileNumber:{
        required:true,
        type:Number,
        unique: true
    },
    FirstName:{
        required:true,
        type:String
    },
    LastName:{
        required:true,
        type:String
    },
    Role:{
        required:true,
        type:String
    },
    Department:{
        required:true,
        type:String
    }, SnoId: {
        required:true,
        type:Number,
        unique: true
    }
})



module.exports = mongoose.model('User', userSchema)