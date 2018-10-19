const { sequelize } = require('./DBMODAL') // db
const router = require('./ROUTER')
const koaCustomStatus = require('koa-custom-statuses')
const messageContent = require('./constant')
const commFunc = require('./common')
module.exports = {
    /**
     * return true: initialize API successfully
     * @param {Koa instance} app 
     */
    async initialize(app) {
        function customResponeStatus() {
            var customStatus = {}
            var responeCodes = Object.values(messageContent.ResponeStatus)
            responeCodes.forEach(element => {
                customStatus[element] = 'custom status'
            })
            return customStatus
        }
        try {
            app.use(router.routes())
            koaCustomStatus(app, customResponeStatus())
            await sequelize.authenticate()
            await sequelize.sync()
            return true
        } catch (error) {
            commFunc.LogMessage('error', error)
        }
        return false
    }
}