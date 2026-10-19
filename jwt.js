const jwt = require('jsonwebtoken');

exports.generateToken = (userId,role)=>{
    return jwt.sign({id:userId,role:role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN || '15m'})
}
exports.verifyToken = (token)=>{
    return jwt.verify(token,process.env.JWT_SECRET)
}
exports.generateRefreshToken = (userId)=>{
    return jwt.sign({id:userId},process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'})
}
exports.verifyRefreshToken = (token)=>{
    return jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)
}