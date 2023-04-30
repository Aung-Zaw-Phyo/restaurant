const Food = require('./../models/food_model')
const asyncHandler = require('express-async-handler')
const helper = require('./../utils/helper')
const uuid = require('uuid')

const food = asyncHandler(async(req, res, next) => {
    const foods = await Food.find({is_active: true}).populate({path: 'employee_id', select: 'name'})
        .limit(process.env.COUNT).skip(helper.skipCount(req.query)).sort({createdAt: -1});
    if (foods) {
        res.status(200).json({message: 'foods', foods})
    } else {
        res.status(500)
        throw new Error('Server error occured.')
    }
})

const foodBySearch = asyncHandler(async(req, res, next) => {
    const foods = await Food.find({
        "$or" : [
            {name: {$regex: req.params.search}}
        ]
    });
    if (foods) {
        res.status(200).json(foods)
    } else {
        res.status(500)
        throw new Error('Server error occured.')
    }
})

const create = asyncHandler(async(req, res, next) => {
    const {name, image, price, quantity} = req.body
    if(!name || !price || !quantity) {
        res.status(400)
        throw new Error('Name, price and quantity fields are required.')
    }
    const available = await Food.findOne({name});
    if(available) {
        res.status(400)
        throw new Error('This food is already taken.')
    }

    let filename = null;
    if(req.files && req.files.image){
        const ext = req.files.image.name.split('.')[1]
        const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif'];
        if (!array_of_allowed_files.includes(ext)) {
            res.status(400)
            throw new Error('Your upload file is invalid.');
        }
        filename = `${uuid.v4()}.${ext}`
    }

    const food = await Food({
        employee_id: req.user._id, 
        name, 
        image: filename ? `/uploads/foods/${filename}` : null, 
        price, 
        quantity
    }).save()
    if(food) {
        filename ? await req.files.image.mv(`./uploads/foods/${filename}`) : null ;
        res.status(201).json({message: 'Food created successfully', food: food})
    }else {
        res.status(500)
        throw new Error('Server error occured.')
    }
})

const edit = asyncHandler(async(req, res, next) => {
    const food = await Food.findById(req.params.id)
    if(!food) {
        res.status(403)
        throw new Error('Food not found.')
    }
    const {name, image, price, quantity} = req.body
    if(!name || !price || !quantity) {
        res.status(400)
        throw new Error('Name, price and quantity fields are required.')
    }
    const isExistFoods =await Food.find({ _id: { $nin: req.params.id }, name: name })
    if(isExistFoods.length > 0) {
        res.status(400)
        throw new Error('This menu is already taken.')
    }
    let filename = null;
    if(req.files && req.files.image){
        const ext = req.files.image.name.split('.')[1]
        const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif'];
        if (!array_of_allowed_files.includes(ext)) {
            res.status(400)
            throw new Error('Your upload file is invalid.');
        }
        filename = `${uuid.v4()}.${ext}`
    }
    const result = await Food.findByIdAndUpdate(req.params.id, {
        employee_id: req.user._id,
        name,
        image: filename ? `/uploads/foods/${filename}` : food.image,
        price,
        quantity
    })
    if(result) {
        filename ? await req.files.image.mv(`./uploads/foods/${filename}`) : null ;
        console.log('hit')
        const updateFood = await Food.findById(req.params.id)
        res.status(200).json({message: 'Food updated successfully.', food: updateFood})
    }else {
        res.status(500)
        throw new Error('Server error occured.')
    }
})

const dele = asyncHandler(async(req, res, next) => {
    const food = await Food.findById(req.params.id)
    if(!food) {
        res.status(403)
        throw new Error('Food not found.')
    }
    food.deleteOne()
    res.status(200).json({message: 'Food deleted successfully.', food})
})

module.exports = {food, foodBySearch, create, edit, dele}



