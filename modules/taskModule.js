const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    completed: {
        type: Boolean,
        default: false
    }
    ,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

//Export the model
module.exports = mongoose.model('Task', taskSchema);