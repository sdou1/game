const Sequelize = require('sequelize')
const fs = require('fs')
const path = require('path')
const config = require('../dbConfig')

var db = {}

const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    config.db.options
)

fs
    .readdirSync(__dirname)
    .filter((file) =>
        file !== 'index.js'
    )
    .forEach((modelfile) => {
        var model = sequelize.import(path.join(__dirname, modelfile))
        db[model.name] = model
    })

db.sequelize = sequelize
db.Sequelize = Sequelize
module.exports = db