const mongoose = require('mongoose');

const leaveManagementSchema = new mongoose.Schema({
    leaveId: Number,
    userId: {
        required: true,
        type: Number,
    },
    appliedDate: String,
    leaveRequestFromDate: String,
    leaveRequestToDate: String,
    noOfDays: Number,
    leaveStatus: {
        required: true,
        type: String,
    },
    reason: String,
    department: String,
});

// Create the userData model
module.exports  = mongoose.model('leaveManagement', leaveManagementSchema);
