const messageContent = require('../constant')
const { LogMessage } = require('../common')
const dbOperation = require('../dboperation')
module.exports = {
    /**
     * add player to round before start the round
     * @param {*} req 
     * @param {*} res 
     */
    async addPlayerToRound(ctx) {
        var req = ctx.request
        try {
            var player = req.body.game_round_player
            var tmp = await dbOperation.MySqlOperation.AddPlayerToRound(player)//game_players.create(player)
            if (tmp) {
                await dbOperation.MemoryDbOperation.AddPlayerToRound(player.game_round_id, tmp.id)
                var rs = {}
                rs.game_round_player = tmp
                ctx.body = rs
                ctx.status = 200
            }
            else
                ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.addPlayerToMemoryFail, { expose: true })
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.addPlayerToRound, { expose: true })
        }
    },
    /**
     * when player play the game, should update the score into the server
     * @param {*} req 
     * @param {*} res 
     */
    async updatePlayerScore(ctx) {
        var req = ctx.request
        try {
            var gameroundid = req.body.player_score.game_round_id
            var playerid = req.body.player_score.player_id
            var score = req.body.player_score.score
            if (await dbOperation.MemoryDbOperation.UpdatePlayerScore(gameroundid, playerid, score)) {
                LogMessage('log', 'the game round is over')
                ctx.status = 200
            }
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.updateScoreFail + ': ' + error, { expose: true })
        }
    },

    async getPlayerScore(ctx) {
        var player = ctx.request.body.game_round_player
        try {
            var score = await dbOperation.MemoryDbOperation.GetPlayerScore(player.game_round_id, player.player_id)
            if (score) {
                ctx.body={}
                ctx.body.game_round_player = {
                    game_round_id: player.game_round_id,
                    player_id: player.player_id,
                    'score': score
                }
            }
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, error, { expose: true })
        }
    }
}