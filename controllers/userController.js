const User = require('../modules/userModule')
const asyncHandler = require('express-async-handler')
const {generateRefreshToken,generateAccessToken} = require('../config/generateTokens')
const jwt = require('jsonwebtoken')
const sendEmail = require('../controllers/emailController')
const crypto = require('crypto')
const validateMongodbId = require('../utils/validateMongodbId')
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
        res.json(token)

    } catch(err){
        throw new Error(err)
    }
})

// reset password
const resetPassword = asyncHandler(async(req,res)=>{
    // new password
    const {password} = req.body
    const {token} = req.params
    // we need to hash the token to compare it with the hashed one in the database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({
        passwordResetToken:hashedToken,
        // to make sure that the token work just 10 min
        passwordResetExpires:{$gt:Date.now()},
        // to make sure change will be one time by day
        passwordChangedAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    })
    if (!user) throw new Error('Token expired , or your dapassed the limited chanse offred for you to change the password , Please try tomorow')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    user.passwordChangedAt = Date.now()
     // Format date to a user-friendly string
     const formattedPasswordChangedAt = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    }).format(user.passwordChangedAt);

    await user.save()
    res.json(user)
})

// update user 
const updateUser = asyncHandler(async(req,res)=>{
    const id = req.user._id.toString()
    validateMongodbId(id)
    try{
        const updateTheUser = await User.findByIdAndUpdate(id,{
            name:req.body?.name,
            email:req.body?.email,
            mobile:req.body?.mobile,
            }
            ,{new:true})
            res.json(updateTheUser)
    }catch(err){
        throw new Error(err)
    }
    
})

// update password 
const updatePassword = asyncHandler(async(req,res)=>{
    const {_id} = req.user
    validateMongodbId(_id)
    const {password} = req.body
    const user = await  User.findById(_id)
    if (password){
        user.password = password
        const updatedUser = await user.save()
        res.json(updatedUser)
    }else{
        res.json(user)
    }
})

module.exports = {createUser,loginUser,handleRefreshToken,logout,forgotPasswordToken,resetPassword,updateUser,updatePassword}