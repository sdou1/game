const cors = require('cors') // corss-domain access
const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser')
const express = require('express')
const api = require('./API')
const config = require('./serverConfig')
var exp = express()

exp.use(bodyparser.json())
exp.use(cors({
    credentials: true,                //access information from different domain 
    origin: 'http://localhost:8080'   //the ui domain
})) // http zone
exp.use(cookieparser()) //cookie-parser to set and parser the cookie information
exp.use(express.static(config.RootPath)) //html, image and icon folder
var Console = console
api.initialize(exp).then(() => {
    api.syncdb().then(() => {
        exp.listen(config.Port)
        Console.log('start server at ' + config.Port)
    })
}, (error) => {
    Console.log('db connect fail: ' + error)
})
