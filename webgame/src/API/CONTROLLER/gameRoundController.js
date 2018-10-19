const messageContent = require('../constant')
const { Sequelize, game_rounds, games, game_players, game_awards } = require('../DBMODAL')
const memoryDB = require('../MEMORYDB')
const { LogMessage } = require('../common')
module.exports = {
    /**
     * get all the round information
     * @param {*} req 
     * @param {*} res 
     */
    async getAllRounds(ctx) {
        try {
            var roundsInfo = new Array()
            var allgames = await games.findAll({
                'attributes': ['id', 'name']
            })
            var allrounds = await game_rounds.findAll({
                'attributes': ['id', 'name', 'game_id', 'start_at', 'end_at']
            })
            allrounds.forEach((round) => {
                allgames.forEach(game => {
                    if (!round.name && game.id === round.game_id)
                        round.setDataValue('name', game.name)
                })
                roundsInfo.push(round)
            })
            var tmpInfo = {}
            tmpInfo.game_rounds = roundsInfo
            ctx.body = tmpInfo
            ctx.status = 200
            LogMessage('log', 'get all rounds successfully')
        }
        catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, 'can not get all rounds', { expose: true })
            LogMessage('error', 'can not get all rounds: ' + error)
        }
    },
    /**
     * create one round of a game, and add the round to the mememory db
     * @param {*} req 
     * @param {*} res 
     */
    async createRound(ctx) {
        var req = ctx.request
        try {
            var round = {
                game_id: req.body.game_round.game_id,
                name: req.body.game_round.name,
                award_desc: req.body.game_round.award_desc,
                desc: req.body.game_round.desc
            }
            var tmp = await game_rounds.create(round)
            if (tmp) {
                memoryDB.createNewRound(tmp.id)
                var game_round = {}
                game_round.game_round = tmp
                ctx.body = game_round
                ctx.status = 200
            }
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, `create round ${req.body.desc} fail: ` + error, { expose: true })
        }
    },
    /**
     * delete round will delete the player of the round and the award of the player
     * @param {} req 
     * @param {*} res 
     */
    async deleteRound(ctx) {
        try {
            var game_round_id = parseInt(ctx.params[0])
            await game_awards.destroy({
                where: {
                    'game_round_id': game_round_id
                }
            })
            await game_players.destroy({
                where: {
                    'game_round_id': game_round_id
                }
            })

            await game_rounds.destroy({
                where: {
                    id: game_round_id
                }
            })
            ctx.status = 200

        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, `delete round ${ctx.params[0]} fail: ` + error, { expose: true })
        }
    },
    /**
     * start round that the player can start playing the game
     * @param {*} req 
     * @param {*} res 
     */
    async startRound(ctx) {
        try {
            var game_round_id = parseInt(ctx.params[0])
            if (!memoryDB.startRound(game_round_id)) {
                throw 'can not start the round in memory db'
            }
            await game_rounds.update({ start_at: Sequelize.fn('NOW') }, {
                returning: true,
                where: {
                    id: game_round_id
                }
            })
            ctx.status = 200
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.startRoundFail + ': ' + error, { expose: true })
        }
    },
    /**
     * get all the players score
     * @param {*} req 
     * @param {*} res 
     */
    async getRoundAllPlayersScore(ctx) {
        try {
            var gameroundid = parseInt(ctx.params[0])
            var playerInfo = {}
            var game_round_players = {}
            if (memoryDB.isRoundExist(gameroundid)) {
                playerInfo = memoryDB.getRoundPlayerScore(gameroundid)
                playerInfo.game_round_id = gameroundid
                playerInfo.isFinished = memoryDB.isGameRoundOver(gameroundid)
                game_round_players.game_round_score = playerInfo
                ctx.body = game_round_players
                ctx.status = 200
            }
            else {
                var rs = await game_players.findAll({
                    where: {
                        game_round_id: gameroundid
                    },
                    order: [['score', 'DESC']]
                })
                playerInfo.players = new Array()
                rs.forEach((x) => {
                    var player = {
                        player_id: x.id,
                        score: x.score
                    }
                    playerInfo.players.push(player)
                })
                playerInfo.isFinished = true
                playerInfo.game_round_id = gameroundid
                game_round_players.game_round_score = playerInfo
                ctx.body = game_round_players
                ctx.status = 200
            }
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.roundAllPlayerInfo + ': ' + error, { expose: true })
        }
    },

    updateRoundFinishedTime(gameroundid, updatePlayerScoreToDB) {
        try {
            game_rounds.update({ end_at: Sequelize.fn('NOW') }, {
                returning: true,
                where: {
                    id: gameroundid
                }
            })
            updatePlayerScoreToDB(gameroundid)
        } catch (error) {
            LogMessage('error', 'updateRoundFinishedTime: ' + error)
        }
    }
}