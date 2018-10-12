const messageContent = require('../constant')
const memoryDb = require('../MEMORYDB')
module.exports = {
        /**
     * check if can add player to round
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    addPlayerToRound(req, res, next) {
        try {
            var gameroundid = req.body.game_round_player.game_round_id
            if (!memoryDb.isRoundExist(gameroundid)) {
                throw messageContent.FailMessage.addPlayerToRound
            }
            if (memoryDb.isGameRoundRuning(gameroundid)) {
                res.status(messageContent.ResponeStatus.AlreadyRuning).end()
            } else if (memoryDb.isGameRoundOver(gameroundid)) {
                res.status(messageContent.ResponeStatus.AlreadyOver).end()
            } else {
                next()
            }
        } catch (error) {
            res.status(500).send(messageContent.FailMessage.addPlayerToRound)
        }
    },

    updatePlayerScore(req,res,next) {
        try {
            var gameroundid = req.body.player_score.game_round_id
            var playerid = req.body.player_score.player_id
            if (!memoryDb.hasPlayer(gameroundid, playerid)) {
                throw messageContent.FailMessage.roundWithoutPlayer
            }

            if (!memoryDb.isGameRoundRuning(gameroundid)) {
                res.status(messageContent.ResponeStatus.RoundNotRun).send(messageContent.FailMessage.roundIsNotRunning)
            } else if (memoryDb.isGameRoundOver(gameroundid)) {
                res.status(messageContent.ResponeStatus.AlreadyOverWithPosition).send({
                    player_score:{
                        player_id: playerid,
                        score: memoryDb.getPlayerScore(playerid),
                        position: memoryDb.getRoundPosition(playerid)
                    }
                })
            } else {
                next()
            }
        } catch (error) {
            res.status(500).send(messageContent.FailMessage.updateScoreFail)
        }
    }
}