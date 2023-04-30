const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const validateTokenHandler = asyncHandler (async (req, res, next) => {
    const authorized = req.headers.Authorization || req.headers.authorization
    if(authorized && authorized.startsWith('Bearer')) {
        const token = authorized.split(" ")[1]
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if(err){
                console.log('hit===========')
                res.status(401)
                throw new Error('User is not authorized or token is expired.')
            }

            req.user =decoded.user
            next()
        })
    }else {
        res.status(401)
        throw new Error('User is not authorized or token is missing.')
    }
})

module.exports = validateTokenHandler