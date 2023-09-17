const mongoose= require('mongoose');

const ticketManagementSchema = new mongoose.Schema({
    ticketId: Number,
    userId: {
        required: true,
        type: String,
    },
    ticketStatus: {
        required: true,
        type: String,
    },
    description: String,
    title: String,
    comment: String,
    department: String,
});

module.exports = mongoose.model('ticketManagement', ticketManagementSchema)