const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const employeeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        uniqued: true
    },
    profile: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: Number,   //  1 => admin, 2 => data entry, 3 => chef, 4 => waiter
        required: true
    },
    password: {
        type: String, 
        required: true
    }
}, {timestamps: true})

employeeSchema.pre("save", async function(next){
    const employee = this
    if(employee.isModified("password")){
        employee.password = await bcrypt.hash(employee.password, 10)
    }
    next()
})

employeeSchema.virtual("role_name").get(function () {
    if(this.role === 1) {
        return 'Admin'
    }else if(this.role === 2) {
        return 'Data Entry'
    }else if(this.role === 3) {
        return 'Chef'
    }else if(this.role === 4) {
        return 'Waiter'
    }else {
        return '-'
    }
});
employeeSchema.set('toObject', { virtuals: true });
employeeSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Employee', employeeSchema)
