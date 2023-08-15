const User = require('../modules/userModule')
const asyncHandler = require("express-async-handler")
const jwt = require('jsonwebtoken')

// we use authMiddleWare to make sure the user login 
const authMiddleWare = asyncHandler(async(req,res,next)=>{
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1]
        try{
            if(token){
                const decoded = jwt.verify(token,process.env.JWT_SECRET)
                req.user = await User.findById(decoded?.id)
                next()
            }
        }catch(err){
            throw new Error('Not authorized token expired , login expired ')
        }
    }else{
        throw new Error('There is no token attached to the header ')
    }
})


module.exports = authMiddleWare 
