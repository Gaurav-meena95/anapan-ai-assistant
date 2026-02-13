const express = require('express')
require('dotenv').config()
const app = express()
app.use(express.json())
const cors = require('cors')
const connectDB = require('./src/Config/db')
app.use(cors())



connectDB();
app.get('/',(req,res)=>{
    res.status(200).json('Hello World!')
})






const PORT = process.env.PORT || 3000
app.listen(PORT ,()=>{
    console.log(`server is running on port ${PORT}`)
})