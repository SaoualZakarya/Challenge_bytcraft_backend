const asyncHandler = require('express-async-handler')
const Task = require('../modules/taskModule')
const User = require('../modules/userModule')
const validateMongodbId = require('../utils/validateMongodbId')

// create task 
const createTask = asyncHandler(async(req,res)=>{
    const id = req.user._id.toString()
    try{
        const createTask = await Task.create(req.body)
        const updateUser = await User.findByIdAndUpdate(id,{
            $push:{taskId:createTask._id}
        },{new:true})
        res.json(createTask)
    }catch(err){
        throw new Error('we can\'t create task')
    }
})

// get all tasks
const getAllTasks = asyncHandler(async(req,res)=>{
    const id = req.user._id.toString()
    try{
        const user = await User.findById(id).populate('taskId')
        const allTasks = user.taskId
        res.json(allTasks)
    }catch(err){
        throw new Error('There are no tasks')
    }
})

// get single task
const getSingleTask = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try{
        const task =await Task.findById(id)
        res.json(task)
    }catch(err){
        throw new Error('There is no task')
    }
})

// complete task 
const completeTask = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongodbId(id)
    try{
        const completeTheTask = await Task.findByIdAndUpdate(id,{
            $set:{completed:true}   
        },{new:true})
        res.json(completeTheTask)
    }catch(err){
        throw new Error('we can\'t complete your task')
    }
})

// delete task

const deleteTask = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongodbId(id)
    try{
        const deleteTheTask = await Task.findByIdAndDelete(id)
        res.json(deleteTheTask)
    }catch(err){
        throw new Error('we can\'t delete task')
    }
})

// update task
const updateTask = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongodbId(id)
    try{
        const updateTheTask = await Task.findByIdAndUpdate(id,req.body,{new:true})
        res.json(updateTheTask)
    }catch(err){
        throw new Error('we can\'t update task')
    }
})

module.exports = {createTask,completeTask,getAllTasks,getSingleTask,deleteTask,updateTask}