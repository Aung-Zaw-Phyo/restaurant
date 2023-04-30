const asyncHandler = require('express-async-handler')
const Food = require('./../models/food_model')
const uuid = require("uuid");
const Order = require('./../models/order_model')
const Table = require('./../models/table_model')

const get = asyncHandler(async(req, res, next) => {
    const orders = await Order.find({status: true}).populate([{path: 'table_id', select: 'code'}, {path: 'chef', select: 'name'}])
    res.status(200).json({
        message: 'Orders.', 
        orders: orders, 
    });
})

const create = asyncHandler(async(req, res, next) => {
    let data = req.body
    data.uploader = req.user._id
    data.order_id = `OrderId: ${uuid.v4()}`;
    const items = data.items
    for (let i = 0; i < items.length; i++) {
        let item = items[i]
        let food =  await Food.findById(item.food_id)
        let count = food.quantity - item.quantity
        if(count === 0) {
            await Food.findByIdAndUpdate(item.food_id, {quantity: count, is_active: false})
        }else {
            await Food.findByIdAndUpdate(item.food_id, {quantity: count})
        }
    }
    let updateTable = await Table.findByIdAndUpdate(data.table_id, {status: 'active'})
    let result = await Order(data).save()
    let resultOrder = await Order.findById(result._id).populate([{path: 'table_id', select: 'code'}, {path: 'chef', select: 'name'}])
    let foods = await Food.find({is_active: true}).sort({createdAt: -1})
    let tables = await Table.find();
    res.status(201).json({
        message: 'Order created successfully.', 
        orders: resultOrder, 
        foods: foods,
        tables: tables,
        updateOrder: resultOrder
    });
})

const update = asyncHandler(async(req, res, next) => {
    const order_id = req.params.id
    const data = req.body.items
    const order = await Order.findById(order_id)
    if(!order) {
        res.status(403).json({message: 'Invalid Id'})
    }

    const readyItems = data.map(async(data_item) => {

        if(data_item._id){
            if(data_item.add_quantity > 0) {
                let item = order.items.find(item => {
                    return item._id.toString() === data_item._id
                })
                let food =  await Food.findById(data_item.food_id)
                let reduceCount =  data_item.add_quantity - item.add_quantity;
                let count = food.quantity - reduceCount ;
                if(count === 0) {
                    await Food.findByIdAndUpdate(data_item.food_id, {quantity: count, is_active: false})
                }else {
                    await Food.findByIdAndUpdate(data_item.food_id, {quantity: count})
                }
                
                item.add_quantity = data_item.add_quantity
                return item
            }else {
                return data_item;
            }
        }else {
            let food =  await Food.findById(data_item.food_id)
            let count = food.quantity - data_item.quantity
            if(count === 0) {
                await Food.findByIdAndUpdate(data_item.food_id, {quantity: count, is_active: false})
            }else {
                await Food.findByIdAndUpdate(data_item.food_id, {quantity: count})
            }
            return data_item;
        }

    })
    await Table.findByIdAndUpdate(order.table_id, {status: 'active'})
    let result = await Order.findByIdAndUpdate(order_id, {updater: req.user._id, items: data})
    let foods = await Food.find({is_active: true}).sort({createdAt: -1})
    let tables = await Table.find();
    let orders = await Order.findById(order_id)
    res.status(200).json({
        message: 'Order updated successfully.', 
        foods: foods,
        tables: tables,
        orders: orders,
        updateOrder: orders
    })
}) 

const take = asyncHandler(async(req, res, next) => {
    const order_id = req.params.id
    const user_id = req.user.id
    const updatedOrder = await Order.findByIdAndUpdate(order_id, {chef: user_id})
    const orders = await Order.find({status: true}).populate([{path: 'table_id', select: 'code'}, {path: 'chef', select: 'name'}])
    const takedOrder = await Order.findById(order_id).populate([{path: 'table_id', select: 'code'}, {path: 'chef', select: 'name'}])
    res.status(200).json({
        message: 'Preparing the order',
        orders: orders,
        takedOrder: takedOrder
    })
})

const getByTableId = asyncHandler(async(req, res, next) => {
    const table_id = req.params.id
    const order = await Order.findOne({table_id: table_id, status: true}).populate({path: 'table_id', select: 'code status'})
    res.status(200).json({messaage: 'get order', order: order, updateOrder: order})
})

const getByChefId = asyncHandler(async(req, res, next) => {
    const chef_id = req.params.id;
    const orders = await Order.find({chef: chef_id, status: true}).populate([{path: 'table_id', select: 'code status'}, {path: 'chef', select: 'name'}])
    res.status(200).json({message: 'Get Orders', orders: orders})
})

const getById = asyncHandler(async(req, res, next) => {
    const id = req.params.id
    const order = await Order.findById(id)
    if(!order){
        res.status(403).json({message: 'Invalid Order Id'})
    }

    res.status(200).json({message: 'Get Order', order: order})
})


const chef_finish = asyncHandler(async(req, res, next) => {
    const id = req.params.id
    const isExistOrder = await Order.findById(id)
    if(!isExistOrder){
        res.status(403).json({message: 'Invalid Order ID'})
    }
    isExistOrder.items.forEach(async(item, idx) => {
        if(item.add_quantity > 0) {
            let add_dir = `items.${idx}.add_quantity`
            let quan_dir = `items.${idx}.quantity`
            let count = item.quantity + item.add_quantity
            await Order.updateOne({_id: id}, { '$set': {[add_dir] : 0, [quan_dir] : count} })
        }
    });
    await Table.findByIdAndUpdate(isExistOrder.table_id, {status: 'finish'})
    const orders = await Order.find({status: true}).populate([{path: 'table_id', select: 'code status'}, {path: 'chef', select: 'name'}])
    res.status(200).json({message: 'Finish', orders: orders})
})

const done = asyncHandler(async(req, res, next) => {
    const id = req.params.id
    const order = await Order.findById(id)
    if(!order) {
        res.status(403).json({message: 'Invalid Order ID'})
    }
    await Table.findByIdAndUpdate(order.table_id, {status: 'inactive'})
    await Order.findByIdAndUpdate(id, {status: false})
    const tables = await Table.find()
    res.status(200).json({message: 'allready done.', tables: tables})
})

module.exports = {create, get, take, getByTableId, update, getByChefId, getById, chef_finish, done}
