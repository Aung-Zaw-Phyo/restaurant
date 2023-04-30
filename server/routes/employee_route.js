const express = require('express')
const router = express.Router()
const {create, login, edit, dele, employees, employeesByRole, employeesBySearch, employeesById} = require('./../controllers/employee_controller')
const {validateMongoId} = require('./../utils/validator')
const validateTokenHandler = require('./../middleware/validateTokenHandler')
  
router.route('/login').post(login)


router.route('/create').post(validateTokenHandler, create)


router.route('/:id').put(validateTokenHandler, validateMongoId, employeesById)

router.route('/edit/:id').put(validateTokenHandler, validateMongoId, edit)

router.route('/delete/:id').delete(validateTokenHandler, validateMongoId, dele)

router.route('/').get(validateTokenHandler, employees)

router.route('/role').get(validateTokenHandler, employeesByRole)

router.route('/search/:search').get(validateTokenHandler, employeesBySearch)

module.exports = router
