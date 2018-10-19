const messageContent = require('../constant')
const { game_players } = require('../DBMODAL')
const gameRound = require('./gameRoundController')
const memoryDB = require('../MEMORYDB')
const { LogMessage } = require('../common')
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
            var tmp = await game_players.create(player)
            if (memoryDB.addPlayer(req.body.game_round_player.game_round_id, tmp.id)) {
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
        function updateAllPlayersRoundScoreToDB(gameroundid) {
            var playerInfo = memoryDB.getRoundPlayerScore(gameroundid)
            for (var player of playerInfo.players) {
                var score = memoryDB.getPlayerScore(player.player_id)
                game_players.update({ 'score': score }, {
                    where: {
                        id: player.player_id
                    }
                })
            }
        }
        var req = ctx.request
        try {
            var gameroundid = req.body.player_score.game_round_id
            var playerid = req.body.player_score.player_id
            var score = req.body.player_score.score
            var isFinishied = req.body.player_score.isFinished
            if (isFinishied) {
                gameRound.updateRoundFinishedTime(gameroundid, updateAllPlayersRoundScoreToDB)
            }
            memoryDB.updatePlayerScore(playerid, score, isFinishied)
            LogMessage('log', 'the game round is over')
            ctx.status = 200
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.updateScoreFail + ': ' + error, { expose: true })
        }
    }
}