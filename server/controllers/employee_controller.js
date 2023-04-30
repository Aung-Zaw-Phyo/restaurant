const asyncHandler = require('express-async-handler')
const uuid = require('uuid')
const {fs} = require('fs')
const Employee = require('./../models/employee_model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const generator = require('generate-password')
const helper = require('./../utils/helper')
const {saveFile} = require('./../utils/uploader')

const create = asyncHandler(async (req, res, next) => {
        const { name, phone, profile, address, role, password } = req.body
        if (!name || !phone || !req.files ||!req.files.profile || !address || !role || !password ) {
            res.status(400)
            throw new Error('All fields are needed to fill.')
        }
        const ext = req.files.profile.name.split('.')[1]
        const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif'];
        if (!array_of_allowed_files.includes(ext)) {
            res.status(400)
            throw new Error('Your upload file is invalid.');
        }
        const filename = `${phone}.${ext}`

        const available = await Employee.findOne({phone})
        if(available) {
            res.status(400)
            throw new Error('This phone number is already taken.')
        }
        // const genePass = generator.generate({
        //     length: 6,
        //     numbers: true
        // })
        let employee = await Employee(
            { name, phone, profile: `/uploads/profiles/${filename}`, address, role, password }
        ).save();
        console.log('hit')

        if (employee) {
            await req.files.profile.mv(`./uploads/profiles/${filename}`)
            let obj = employee.toObject()
            delete obj['password']
            delete obj['__v']
            res.status(201).json({message: 'employee', employee: obj})
        } else {
            res.status(500)
            throw new Error('Server error occured.')
        }
})

const login = asyncHandler(async(req, res, next) => {
    const phone = req.body.phone
    const password = req.body.password
    if(!phone || !password) {
        res.status(400)
        throw new Error('All fields are needed to fill.')
    }
    const employee = await Employee.findOne({phone})
    if(employee) {
        const comparePassword = bcrypt.compareSync(password, employee.password)
        if(comparePassword) {
            console.log('hiiiiiiii')
            let obj = employee.toObject()
            delete obj['password']
            delete obj['__v']
            let token = jwt.sign(
                {user: obj}, 
                process.env.SECRET_KEY,
                { expiresIn: '1h' }    
            )
            obj['token'] = token
            res.status(200).json({message: 'Login successfully.', user: obj})
        }else {
            res.status(400)
            throw new Error('Your credentials is incorrect.')
        }
    }else{
        res.status(403)
        throw new Error('User not found.')
    }
})

const edit = asyncHandler(async (req, res, next) => {
    
    const { name, phone, profile, address, role, password } = req.body
    if (!name || !phone || !address || !role) {
        res.status(400)
        throw new Error('All fields are needed to fill.')
    }
    const employee = await Employee.findById(req.params.id)
    if(!employee) {
        res.status(404)
        throw new Error('Not Found.')
    }
    const isExistUsers =await Employee.find({ _id: { $nin: req.params.id }, phone: req.body.phone })
    if(isExistUsers.length > 0) {
        res.status(400)
        throw new Error('This phone number is already taken.')
    }

    let filename = null;
    if(req.files && req.files.profile && req.files.profile.name !== ''){
        const ext = req.files.profile.name.split('.')[1]
        const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif'];
        if (!array_of_allowed_files.includes(ext)) {
            res.status(400)
            throw new Error('Your upload file is invalid.');
        }
        filename = `${phone}.${ext}`
    }

    let result ;

    if(password) {
        const hashPass = await bcrypt.hash(password, 10)
        result = await Employee.findByIdAndUpdate(req.params.id, {
            name,
            phone,
            profile: filename ? `/uploads/profiles/${filename}` : employee.profile,
            address,
            role,
            password: hashPass
        })
    }else {
        result = await Employee.findByIdAndUpdate(req.params.id, {
            name,
            phone,
            profile: filename ? `/uploads/profiles/${filename}` : employee.profile,
            address,
            role,
        })
    }
    
    if(result) {
        filename ? await req.files.profile.mv(`./uploads/profiles/${filename}`) : null ;
        const updateEmployee = await Employee.findById(req.params.id)
        const obj = updateEmployee.toObject()
        delete obj['password']
        delete obj['__v']
        res.status(200).json({message: 'Updated successfully', employee: obj})
    }else {
        res.status(500)
        throw new Error('Server error occured.')
    }
})

const dele = asyncHandler(async (req, res, next) => {
    const employee = await Employee.findById(req.params.id)
    if(!employee) {
        res.status(403)
        throw new Error('Not Found.')
    }
    employee.deleteOne()
    const obj = employee.toObject()
    delete obj['password']
    delete obj['__v']
    res.status(200).json({message: 'Employee deleted successfully.', employee: obj})
})

const employees = asyncHandler(async (req, res, next) => {

    const employees = await Employee.find().limit(process.env.COUNT).skip(helper.skipCount(req.query)).select("-pass -__v").sort({createdAt: -1});
    if (employees) {
        res.status(200).json({message: 'employees', employees: employees})
    } else {
        res.status(500)
        throw new Error('Server error occured.')
    }
})

const employeesById = asyncHandler(async (req, res, next) => {
    const employee = await Employee.findById(req.params.id);
    if (employee) {
        res.status(200).json({message: 'employee', employee: employee})
    } else {
        res.status(403)
        throw new Error('Employee not found.')
    }
})

const employeesByRole = asyncHandler(async (req, res, next) => {
    const employees = await Employee.find({role: req.query.role});
    console.log(req.query.role)
    if (employees) {
        res.status(200).json(employees)
    } else {
        res.status(500)
        throw new Error('Server error occured.')
    }
})

const employeesBySearch = asyncHandler(async (req, res, next) => {
    console.log(req.params.search)
    const employees = await Employee.find({
        "$or" : [
            {name: {$regex: req.params.search}},
            {phone: {$regex: req.params.search}}
        ]
    });
    if (employees) {
        res.status(200).json(employees)
    } else {
        res.status(500)
        throw new Error('Server error occured.')
    }
})


module.exports = { create, login, employeesById, edit, dele, employees, employeesByRole, employeesBySearch }
