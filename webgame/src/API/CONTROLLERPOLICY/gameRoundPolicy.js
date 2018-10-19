const messageContent = require('../constant')
const memoryDb = require('../MEMORYDB')
module.exports = {
    /**
     * check if can delete the round
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async deleteRound(ctx, next) {
        try {
            var gameroundid = parseInt(ctx.params[0])
            if (memoryDb.isGameRoundRuning(gameroundid)) {
                ctx.throw(messageContent.ResponeStatus.AlreadyRuning, messageContent.FailMessage.roundAlreadyRuning, { expose: true })
            } else {
                await next()
            }
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.deleteRoundFail, { expose: true })
        }
    },

    async startRound(ctx, next) {
        try {
            var gameroundid = parseInt(ctx.params[0])
            if (memoryDb.isEmpty(gameroundid)) {
                throw messageContent.FailMessage.startRoundFail
            }

            if (memoryDb.isGameRoundRuning(gameroundid)) {
                throw messageContent.FailMessage.roundAlreadyRuning
            } else if (memoryDb.isGameRoundOver(gameroundid)) {
                throw messageContent.FailMessage.roundAlreadyOver
            } else {
                await next()
            }
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.startRoundFail, { expose: true })
        }
    }
}