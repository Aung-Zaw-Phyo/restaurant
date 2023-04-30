const {isValidObjectId} = require('mongoose')
const asyncHandler = require('express-async-handler')

exports.validateMongoId = asyncHandler(async(req, res, next) => {
    if(!isValidObjectId(req.params.id)){
        res.status(403)
        throw new Error('Invalid Id.')
    }
    next()
})