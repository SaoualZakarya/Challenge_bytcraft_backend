const { createUser, loginUser, handleRefreshToken, logout, forgotPasswordToken,resetPassword,updateUser, updatePassword } = require('../controllers/userController')
const authMiddleWare = require('../middleWare/authMiddleWare')

const router = require('express').Router()

// create user
router.post('/create',createUser)

// login user
router.post('/login',loginUser)

// handle refresh token
router.get('/refresh',handleRefreshToken)

// handle logout user we use authMiddleWare to make sure the user is login
router.get('/logout',logout)

// update user when user already login
router.put('/update',authMiddleWare,updateUser)

// update user password when user already login
router.put('/update-password',authMiddleWare,updatePassword)

//forgot password token 
router.post('/forgot-password-token',forgotPasswordToken)
//reset password when forgot it with email
router.put('/reset-password/:token',resetPassword)

module.exports = router