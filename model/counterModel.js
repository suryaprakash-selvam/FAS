const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema(
    {
        id:String,
        Seq:Number
    }
)

module.exports = mongoose.model('Counter', counterSchema)