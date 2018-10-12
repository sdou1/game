const { sequelize } = require('./DBMODAL') // db
const router = require('./ROUTER')
module.exports = {
    initialize(exp) {
        router(exp)
        return sequelize.authenticate()
    },
    syncdb() {
        return sequelize.sync()
    }
}