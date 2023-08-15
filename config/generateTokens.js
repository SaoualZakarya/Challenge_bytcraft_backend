const jwt = require('jsonwebtoken')

const generateAccessToken = async (id) => {
    const token =  await jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'1d'})
    return token
}

const  generateRefreshToken = async (id)=> {
    const token = await jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '3d'})
    return token
}

module.exports = {generateAccessToken,generateRefreshToken}