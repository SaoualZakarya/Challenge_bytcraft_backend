const mongoose  = require("mongoose")

const validateMongodbId = async (id) =>{
    const isValid = mongoose.Types.ObjectId.isValid(id)
    if(!isValid) throw new Error('the mongodb Id is not valid')
}


module.exports = validateMongodbId