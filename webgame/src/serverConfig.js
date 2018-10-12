const path = require('path')
module.exports = {
    Port: process.env.PORT || 8089,
    RootPath: process.env.ROOTPATH || path.normalize(__dirname + './game')
}