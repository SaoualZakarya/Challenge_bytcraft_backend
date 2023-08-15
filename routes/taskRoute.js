const { createTask, completeTask, getAllTasks, getSingleTask, deleteTask ,updateTask} = require('../controllers/taskController')
const authMiddleWare = require('../middleWare/authMiddleWare')
const router = require('express').Router()

// create task 
router.post('/create',authMiddleWare,createTask)

// get all tasks
router.get('/all',authMiddleWare,getAllTasks)

// get single task
router.get('/single/:id',authMiddleWare,getSingleTask)

// complete task
router.put('/complete/:id',authMiddleWare,completeTask)

// delete task
router.delete('/:id',authMiddleWare,deleteTask)

// update task
router.put('/update/:id',authMiddleWare,updateTask)

module.exports = router