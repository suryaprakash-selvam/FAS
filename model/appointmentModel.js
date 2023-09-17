const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        AppointmentNo:{
            required:true,
            type:String,
            unique: true
        },
        UserId:{
            required:true,
            type:String
        },
        UserName:{
            required:true,
            type:String
        },
        userEmailId:{
            required:true,
            type:String
        },
        Department:{
            required:true,
            type:String
        },
        FacutlyId:{
            required:true,
            type:String
        },
        FacutlyEmail:{
            required:true,
            type:String
        },
        ApDate:{
            required:true,
            type:String
        },
        Slot:{
            required:true,
            type:Number
        },
        Reason:{
            required:true,
            type:String
        },
        Status:{
            required:true,
            type:String
        }
    })

module.exports = mongoose.model('Appointment', appointmentSchema)