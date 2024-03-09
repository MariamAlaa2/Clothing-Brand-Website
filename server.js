require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const brandRoutes = require('./routes/brandRoutes')

// express app
const app =express()

//midlleware
app.use(express.json())
app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next()
})

app.get('/',(req,res)=>{
   res.json('home')
})
//routes
app.use('/brand',brandRoutes)

//connect to database 
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('connect to db')
    app.listen(process.env.PORT,()=>{
        console.log('listening for requests')
    })
})
.catch((err)=>{
    console.log(err)
})