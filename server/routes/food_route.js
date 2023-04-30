const express = require('express')
const router = express.Router()
const {food, foodBySearch, create, edit, dele} = require('./../controllers/food_controller')
const {validateMongoId} = require('./../utils/validator')
const validateTokenHandler = require('./../middleware/validateTokenHandler')
  
router.use(validateTokenHandler)

router.route('/').get(food)

router.route('/search/:search').get(foodBySearch)

router.route('/create').post(create)

router.route('/edit/:id').put(validateMongoId, edit)

router.route('/delete/:id').delete(validateMongoId, dele)

module.exports = router


