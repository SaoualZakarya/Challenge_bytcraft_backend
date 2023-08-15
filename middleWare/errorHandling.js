
// handle not found url 
const notFound = async(req, res, next)=>{
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.status = 404;
    next(error);
}
// handle the throw error to make it readable for us
const errorHandler = (err,req, res, next) =>{
    const statusCode = res.statusCode == 200 ? 500 : res.statusCode 
    // message contain the error and the stack contain information about the error
    res.status(statusCode).json({message:err?.message,stack:err?.stack})
}


module.exports = {errorHandler,notFound}