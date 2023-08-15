const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const dbConnect = require('./config/connectMongoDb')
const {errorHandler,notFound} = require('./middleWare/errorHandling')
const authRouter = require('./routes/authRoute')
const taskRouter = require('./routes/taskRoute')
const app = express()

// to connect the database
dbConnect()

app.use(cookieParser())

app.use(morgan('dev'))

// Middleware for parsing request bodies
app.use(express.json())
app.use(express.urlencoded({extended:false}))

// auth router
app.use('/api/user',authRouter)

// task route
app.use('/api/task',taskRouter)


// middleWare to handle error and not found url
app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})

