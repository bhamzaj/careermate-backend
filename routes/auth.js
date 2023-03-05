const { response } = require('express')
const express = require('express')
const router = express.Router()
const userController = require('../controllers/controller.users')
const inputValidator = require('../util/inputValidator')
const {validateUserToken} = require('../util/authValidator')
const { respond } = require('../util/responder')

router.post('/register', inputValidator.validate.register, inputValidator.validateResult, async (req, res) => {
  try {
    const user = await userController.register(req.body)
    return respond(res, user)
  } catch (err) {
    return respond(res, err.message, false)
  }
})

router.post('/login', inputValidator.validate.login, inputValidator.validateResult, async (req, res) => {
  try {
    const user = await userController.login(req.body)
    return respond(res, user)
  } catch (err) {
    return respond(res, err.message, false)
  }
})

router.get('/verify-account', async (req, res) => {
  try {
    const response = await userController.verifyAccount(req.query.token)
    return respond(res, response)
  } catch (err) {
    return respond(res, err.message, false)
  }
})

router.post('/request-password-reset', inputValidator.validate.passwordResetEmail, inputValidator.validateResult, async (req, res) => {
  try {
    const response = await userController.requestResetPassword(req.body)
    return respond(res, response)
  } catch (err) {
    return respond(res, err.message, false)
  }
})

router.post('/reset-password', inputValidator.validate.resetPassword, inputValidator.validateResult, async (req, res) => {
  try{
    const response = await userController.resetPassword(req.body)
    return respond(res, response)
  }
  catch(err){
    return respond(res, err.message, false)
  }

}) 

router.put('/change-password', validateUserToken, inputValidator.validate.changePassword, inputValidator.validateResult, async (req, res) => {
  try{
    const response = await userController.changePassword(req)
    return respond(res, response)
  }catch (err){
    return respond(res, err.message, false)
  }
})
module.exports = router
