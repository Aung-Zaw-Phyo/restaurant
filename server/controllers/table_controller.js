const Table = require('./../models/table_model')
const asyncHandler = require('express-async-handler')
const helper = require('./../utils/helper')

const table = asyncHandler(async(req, res, next) => {
    const tables = await Table.find().populate({path: 'employee_id', select: 'name'}).limit(process.env.COUNT).skip(helper.skipCount(req.query)).sort({createdAt: 1});
    if(tables) {
        res.status(200).json({message: 'Tables', tables: tables})
    }else {
        res.status(500)
        throw new Error('Server error occured.')
    }
})

const tableBySearch = asyncHandler (async(req, res, next) => {
    const tables = await Table.find({
        "$or" : [
            {code: {$regex: req.params.search}}
        ]
    });
    if (tables) {
        res.status(200).json(tables)
    } else {
        res.status(500)
        throw new Error('Server error occured.')
    } 
})

const create = asyncHandler(async(req, res, next) => {
    const latest_table = await Table.findOne().limit(1).sort({'createdAt': -1})
    const latest_table_code = latest_table ? parseInt(latest_table.code.split('-')[1]) : 0
    const new_table_code = latest_table_code+1
    const table = await Table({employee_id: req.user._id, code: `CT-${new_table_code}`}).save()
    if(table) {
        const result = await Table.findById(table._id).populate({path: 'employee_id', select: 'name'})
        res.status(201).json({message: 'Table created successfully.', table: result})
    }else {
        res.status(500)
        throw new Error('Server error occured.')
    }
})

const edit = asyncHandler(async(req, res, next) => {
    const table = await Table.findById(req.params.id)
    if(!table) {
        res.status(403)
        throw new Error('Table not found.')
    }
    const table_code = req.body.code
    if(!table_code) {
        res.status(400)
        throw new Error('Table code is required.')
    }
    const tables = await Table.find()
    const existed_table_arr = tables.filter(table => {
        return (table.code === table_code && table._id.toString() !== req.params.id)
    })
    if(!existed_table_arr.length){
        const result = await Table.findByIdAndUpdate(req.params.id, {employee_id: req.user._id, code: table_code})
        if(result){
            const table = await Table.findById(req.params.id)
            res.status(200).json(table)
        }else {
            res.status(500)
            throw new Error('Server error occured.')
        }
    }else {
        res.status(400)
        throw new Error('This table code is already taken.')
    }
})

const dele = asyncHandler(async(req, res, next) => {
    const table = await Table.findById(req.params.id)
    if(!table) {
        res.status(403)
        throw new Error('Table not found.')
    }
    table.deleteOne()
    res.status(200).json({message: 'Table deleted successfully', table: table})
})

module.exports = {table, tableBySearch, create, edit, dele}

