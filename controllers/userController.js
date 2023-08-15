const User = require('../modules/userModule')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId')
const {generateRefreshToken,generateAccessToken} = require('../config/generateTokens')
const jwt = require('jsonwebtoken')
const sendEmail = require('../controllers/emailController')
// create user
const createUser = asyncHandler (async (req,res)=>{
    const email = req.body.email 
    const findUser = await User.findOne({email})
    if(!findUser){
        // create user
        const newUser = await User.create(req.body)
        res.json(newUser) 
    }else{
        throw new Error('User already exists')
    }
})

// login user 
const loginUser = asyncHandler(async (req,res)=>{
    const {email,password} = req.body
    const user = await User.findOne({email}).populate('taskId')
    if(!user) throw new Error('user not found')
    if(user && await user.isPasswordMatched(password) ){
        const refreshToken = await generateRefreshToken(user._id.toString())
        const addRefreshToken = await User.findByIdAndUpdate(user._id.toString(),{refreshToken},{new:true})
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            // three days
            maxAge: 72 * 60 * 60 * 1000
        })
        res.json({
            _id:user?._id,
            email:user?.email,    
            name:user?.name,
            mobile:user?.mobile,
            taskId: user?.taskId,
            accessToken:await generateAccessToken(user._id.toString())
        })
    }else{
        throw new Error('Invalid credentials')
    }
})

//handle refresh token
const handleRefreshToken = asyncHandler(async(req,res)=>{
    const cookie = req.cookies
    if(!cookie?.refreshToken) throw new Error('There ain\'t refresh token in cookie ')
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({refreshToken})
    if(!user) throw new Error('Not refresh token in db or not matched')
    jwt.verify(refreshToken,process.env.JWT_SECRET,async (err,decoded)=>{
        if(err || decoded.id !== user._id.toString() ) throw new Error('There is somthing wrong with refresh token ')
        const accessToken = await generateAccessToken(user._id.toString())
        res.json({accessToken})
    })
})

// handle logout 
const logout = asyncHandler(async(req,res)=>{
    const cookie = req.cookies
    if(!cookie?.refreshToken) throw new Error('There ain\'t refresh token in cookie ')
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({refreshToken})
    // if we don't find user we clear the cookie
    if(!user){ 
        res.clearCookie('refreshToken',{
        httpOnly:true,
        secure:true,
        })
        return res.sendStatus(204)    // forbiden
    }
    const deleteRefreshTokenUser = await  User.findOneAndUpdate({refreshToken},{
        refreshToken:''
    },{new:true})
    res.clearCookie('refreshToken',{
        httpOnly:true,
        secure:true,
    })
    return res.sendStatus(204) // forbiden
})

// generate forgot password token 
const forgotPasswordToken = asyncHandler(async(req,res)=>{
    const email = req.body.email
    const user = await User.findOne({email})
    if(!user ) throw new Error("user not found ")
    try{
        const token = await user.createPassowrdResetToken()
        // we use this to save the -passwordResetExpires- and -passwordResetToken-
        await user.save()

        const resetUrl = `Please follow this link to reset your password. <br> This link is valid 10 minutes from now <br>
        <a href='http://localhost:4000/api/user/reset-password/${token}'> Click here </a> <br> 
        Don't forget you have just one time to change the password by day`

        const data = {
            to:user.email,
            text:'Hey User',
            from : '<ecommerceShop1900gmail.com>',
            subject : ' Forgot password link ',
            htm:resetUrl
        }

        sendEmail(data)

    } catch(err){
        throw new Error(err)
    }
})



module.exports = {createUser,loginUser,handleRefreshToken,logout,forgotPasswordToken}