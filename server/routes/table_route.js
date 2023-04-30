const express = require('express')
const router = express.Router()
const {table, tableBySearch, create, edit, dele} = require('./../controllers/table_controller')
const {validateMongoId} = require('./../utils/validator')
const validateTokenHandler = require('./../middleware/validateTokenHandler')
  
router.use(validateTokenHandler)

router.route('/').get(table)

router.route('/search/:search').get(tableBySearch)

router.route('/create').post(create)

router.route('/edit/:id').put(validateMongoId, edit)

router.route('/delete/:id').delete(validateMongoId, dele)

module.exports = router