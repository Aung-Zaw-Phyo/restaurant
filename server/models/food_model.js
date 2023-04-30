const mongoose = require('mongoose')
const Schema = mongoose.Schema

const foodSchema = new Schema({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Employee'
    },
    name: {
        type: String,
        required: true,
        uniqued: true
    },
    image: {
        type: String,
        required: false,
        default: null
    },
    price: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true
    } 
}, {timestamps: true})



module.exports = mongoose.model('Food', foodSchema)
