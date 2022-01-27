const express = require('express')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const path = require('path')
const sequelize = require('./database')
const ErrorMiddleware = require('./middleware/error.middleware')
const router = require('./router/$router')
const cors = require('cors')
const bcrypt = require('bcrypt')
require('dotenv').config()
require('./model/assotiation')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.ORIGIN, credentials: true }))
app.use(express.static(path.join(__dirname, 'static')))
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload({}))
app.use('/api', router)
app.use(ErrorMiddleware)

function start() {
    app.listen(PORT, () => {
        console.log(`Server has been started on port ${PORT}`)
        sequelize.sync({
            logging: false
        })
    })
}

start()

