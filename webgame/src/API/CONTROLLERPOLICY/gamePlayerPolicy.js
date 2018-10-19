const messageContent = require('../constant')
const memoryDb = require('../MEMORYDB')
module.exports = {
    /**
 * check if can add player to round
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
    async addPlayerToRound(ctx, next) {
        try {
            var gameroundid = ctx.request.body.game_round_player.game_round_id
            if (!memoryDb.isRoundExist(gameroundid)) {
                throw messageContent.FailMessage.addPlayerToRound
            }
            if (memoryDb.isGameRoundRuning(gameroundid)) {
                ctx.throw(messageContent.ResponeStatus.AlreadyRuning)
            } else if (memoryDb.isGameRoundOver(gameroundid)) {
                ctx.throw(messageContent.ResponeStatus.AlreadyOver)
            } else {
                await next()
            }
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.addPlayerToRound + error, { expose: true })
        }
    },

    async updatePlayerScore(ctx, next) {
        try {
            var gameroundid = ctx.request.body.player_score.game_round_id
            var playerid = ctx.request.body.player_score.player_id
            if (!memoryDb.hasPlayer(gameroundid, playerid)) {
                throw messageContent.FailMessage.roundWithoutPlayer
            }

            if (!memoryDb.isGameRoundRuning(gameroundid)) {
                ctx.throw(messageContent.ResponeStatus.RoundNotRun, messageContent.FailMessage.roundIsNotRunning, { expose: true })
            } else if (memoryDb.isGameRoundOver(gameroundid)) {
                ctx.status = messageContent.ResponeStatus.AlreadyOverWithPosition
                ctx.body = {
                    player_score: {
                        player_id: playerid,
                        score: memoryDb.getPlayerScore(playerid),
                        position: memoryDb.getRoundPosition(playerid)
                    }
                }
            } else {
                await next()
            }
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.updateScoreFail + error, { expose: true })
        }
    }
}