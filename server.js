const express = require('express')

//calling Database function
require('./config/database').connect()

const app = express()

require('dotenv').config()
const PORT = process.env.PORT || 4000


app.use(express.json())


//route importing and mounting
const user = require('./routes/user')

app.use('/api/v1', user)


app.listen(PORT, ()=>{
    console.log("Server Started") 
})