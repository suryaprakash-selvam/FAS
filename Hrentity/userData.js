const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
    userDataId: Number,
    userId: Number,
    basic: {
        type: String,
         required: true
    },
    gratuity: {
        type: String,
         required: true
    },
    bonus: {
        type: String,
         required: true
    },
    pf: {
        type: String,
         required: true
    },
    totalMonthlyAmount: {
        type: String,
         required: true
    },
    totalLeaveCredited: {
        type: Number,
         required: true
    },
    leaveBalance: {
        type: Number,
         required: true
    },
    department: {
        type: String,
         required: true
    },
});

// Create the userData model
module.exports = mongoose.model('UserData', userDataSchema);
