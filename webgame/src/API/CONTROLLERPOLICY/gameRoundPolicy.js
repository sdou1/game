const messageContent = require('../constant')
const memoryDb = require('../MEMORYDB')
module.exports = {
    /**
     * check if can delete the round
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    deleteRound(req,res,next){
        try {
            var gameroundid = parseInt(req.params[0])
            if (memoryDb.isGameRoundRuning(gameroundid)) {
                res.send(messageContent.FailMessage.roundAlreadyRuning)
            } else {
                next()
            }
        } catch (error) {
            res.status(messageContent.ResponeStatus.CommonError).send(messageContent.FailMessage.deleteRoundFail)
        }
    },

    startRound(req, res, next) {
        try {
            var gameroundid = parseInt(req.params[0])
            if (memoryDb.isEmpty(gameroundid)) {
                throw messageContent.FailMessage.startRoundFail
            }

            if (memoryDb.isGameRoundRuning(gameroundid)) {
                res.status(messageContent.ResponeStatus.CommonError).send(messageContent.FailMessage.roundAlreadyRuning)
            } else if (memoryDb.isGameRoundOver(gameroundid)) {
                res.status(messageContent.ResponeStatus.CommonError).send(messageContent.FailMessage.roundAlreadyOver)
            } else {
                next()
            }
        } catch (error) {
            res.status(messageContent.ResponeStatus.CommonError).send(messageContent.FailMessage.startRoundFail)
        }
    }
}