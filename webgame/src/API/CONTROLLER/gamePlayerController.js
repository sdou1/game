const messageContent = require('../constant')
const { game_players } = require('../DBMODAL')
const gameRound = require('./gameRoundController')
const memoryDB = require('../MEMORYDB')
const Console = console
module.exports = {
    /**
     * add player to round before start the round
     * @param {*} req 
     * @param {*} res 
     */
    addPlayerToRound(req, res) {
        try {
            var player = req.body.game_round_player
            game_players.create(player).then(tmp => {
                if (memoryDB.addPlayer(req.body.game_round_player.game_round_id, tmp.id)) {
                    var rs = {}
                    rs.game_round_player = tmp
                    res.send(rs)
                }
                else
                    res.status(messageContent.ResponeStatus.CommonError).send(messageContent.FailMessage.addPlayerToMemoryFail)
            }, error => {
                res.status(messageContent.ResponeStatus.CommonError).send(messageContent.FailMessage.addPlayerToRound + ' ' + error)
            })
        } catch (error) {
            res.status(messageContent.ResponeStatus.CommonError).send(messageContent.FailMessage.addPlayerToRound)
        }
    },
    /**
     * when player play the game, should update the score into the server
     * @param {*} req 
     * @param {*} res 
     */
    updatePlayerScore(req, res) {
        function updateAllPlayersRoundScoreToDB(gameroundid) {
            var playerInfo = memoryDB.getRoundPlayerScore(gameroundid)
            for (var player of playerInfo.players) {
                var score = memoryDB.getPlayerScore(player.player_id)
                game_players.update({ 'score': score }, {
                    where: {
                        id: player.player_id
                    }
                }).then(() => {
                    Console.log(`update score(${score}) for player(${player.player_id}) successfully`)
                })
            }
        }
        try {
            var gameroundid = req.body.player_score.game_round_id
            var playerid = req.body.player_score.player_id
            var score = req.body.player_score.score
            var isFinishied = req.body.player_score.isFinished
            if (isFinishied) {
                gameRound.updateRoundFinishedTime(gameroundid, updateAllPlayersRoundScoreToDB)
            }
            memoryDB.updatePlayerScore(playerid, score, isFinishied)
            Console.log('the game round is over')
            res.end()
        } catch (error) {
            res.status(messageContent.ResponeStatus.CommonError).send(messageContent.FailMessage.updateScoreFail + ': ' + error)
        }
    }    
}