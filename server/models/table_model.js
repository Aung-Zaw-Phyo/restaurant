const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tableSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Employee'
    },
    status: {
        type: String,
        required: true,
        default: 'inactive' // inactive , active , finish
    }

}, {timestamps: true})

module.exports = mongoose.model('Table', tableSchema)