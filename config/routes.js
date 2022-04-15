const express = require('express')
const router = express.Router() 
const { authenticateUser } = require('../app/middlewares/authentication')
const usersController = require('../app/controllers/usersController')

router.get('/users/list', usersController.list)
router.post('/users/register', usersController.register)
router.post('/users/login', usersController.login)
router.put('/users/edit/:id',authenticateUser, usersController.update)
router.get('/users/account', authenticateUser, usersController.account)
router.post('/users/activation', usersController.nodemailer)


module.exports = router