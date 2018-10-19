const koa2 = require('koa2')
//const fs = require('fs')
const bodyParser = require('koa-bodyparser')
const morgan = require('koa-morgan')
const api = require('./API')
const config = require('./serverConfig')
const {LogMessage} = require('./API/common')
var app = new koa2()

app.use(bodyParser())

function pad(num) {
    return (num > 9 ? '' : '0') + num
}
 
function generator(time, index) {
    if(! time)
        return 'file.log'
 
    var month  = time.getFullYear() + '' + pad(time.getMonth() + 1)
    var day    = pad(time.getDate())
    var hour   = pad(time.getHours())
    var minute = pad(time.getMinutes())
 
    return month + '/' + month +
        day + '-' + hour + minute + '-' + index + '-file.log'
}
 
var rfs    = require('rotating-file-stream')
var stream = rfs(generator, {
    size:     '10M',
    interval: '5m'
})

function logFormat(m, req, res){
    return `req: ${req.method}, ${req.url}, ${req.body}, res:${res.statusCode}, ${res.body}`
}

//var accessLogStream = fs.createWriteStream(__dirname + '/access.log', { flogs: 'a' })
app.use(new morgan('combined', { 'stream': stream }))

api.initialize(app).then(()=>{
    app.listen(config.Port)
    LogMessage('log','start server at port: ' + config.Port)
},(error)=>{
    LogMessage('error',error)
})

