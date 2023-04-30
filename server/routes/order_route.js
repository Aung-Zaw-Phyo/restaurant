const router = require('express').Router()
const { create, get, getById, take, getByTableId, update, getByChefId, chef_finish, done } = require('../controllers/order_controller')
const validateTokenHandler = require('./../middleware/validateTokenHandler')
const {validateMongoId} = require('./../utils/validator')
  
router.use(validateTokenHandler)
router.route('/create').post(create)
router.route('/').get(get)
router.route('/:id').get(validateMongoId, getById)
router.route('/take/:id').post(validateMongoId, take)

router.route('/get_by_table_id/:id').get(validateMongoId, getByTableId)
router.route('/update/:id').put(validateMongoId, update)

router.route('/get_by_chef_id/:id').get(validateMongoId, getByChefId)
router.route('/chef_finish/:id').post(validateMongoId, chef_finish)

router.route('/done/:id').post(validateMongoId, done)

module.exports = router