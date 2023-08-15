const { createUser, loginUser, handleRefreshToken, logout, forgotPasswordToken } = require('../controllers/userController')
const authMiddleWare = require('../middleWare/authMiddleWare')

const router = require('express').Router()

// create user
router.post('/create',createUser)

// login user
router.post('/login',loginUser)

// handle refresh token
router.get('/refresh',handleRefreshToken)

// handle logout user we use authMiddleWare to make sure the user is login
router.get('/logout',authMiddleWare,logout)

//forgot password token
router.post('/forgot-password-token',forgotPasswordToken)


module.exports = router