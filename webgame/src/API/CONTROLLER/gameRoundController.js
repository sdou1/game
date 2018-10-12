const messageContent = require('../constant')
const { Sequelize, game_rounds, games, game_players, game_awards } = require('../DBMODAL')
const memoryDB = require('../MEMORYDB')
const Console = console
module.exports = {
    /**
     * get all the round information
     * @param {*} req 
     * @param {*} res 
     */
    getAllRounds(req, res) {
        try {
            var roundsInfo = new Array()
            games.findAll({
                'attributes': ['id', 'name']
            }).then(allgames => {
                game_rounds.findAll({
                    'attributes': ['id', 'name', 'game_id', 'start_at', 'end_at']
                }).then(allrounds => {
                    allrounds.forEach((round) => {
                        allgames.forEach(game => {
                            if (!round.name && game.id === round.game_id)
                                round.setDataValue('name', game.name)
                        })
                        roundsInfo.push(round)
                    })
                    var tmpInfo = {}
                    tmpInfo.game_rounds = roundsInfo
                    res.send(tmpInfo)
                    Console.log('get all rounds successfully')
                })
            })
        }
        catch (error) {
            res.status(500).send('can not get all rounds')
            Console.log('can not get all rounds: ' + error)
        }
    },
    /**
     * create one round of a game, and add the round to the mememory db
     * @param {*} req 
     * @param {*} res 
     */
    async createRound(req, res) {
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
                res.send(game_round)
            }
        } catch (error) {
            res.status(messageContent.ResponeStatus.CommonError).send(`create round ${req.body.desc} fail: ` + error)
        }
    },
    /**
     * delete round will delete the player of the round and the award of the player
     * @param {} req 
     * @param {*} res 
     */
    deleteRound(req, res) {
        try {
            var game_round_id = parseInt(req.params[0])
            game_awards.destroy({
                where: {
                    'game_round_id': game_round_id
                }
            }).then(() => {
                game_players.destroy({
                    where: {
                        'game_round_id': game_round_id
                    }
                })
            }).then(() => {
                game_rounds.destroy({
                    where: {
                        id: game_round_id
                    }
                }).then(() => {
                    res.end()
                })
            })
        } catch (error) {
            res.status(messageContent.ResponeStatus.CommonError).send(`delete round ${req.params[0]} fail: ` + error)
        }
    },
    /**
     * start round that the player can start playing the game
     * @param {*} req 
     * @param {*} res 
     */
    startRound(req, res) {
        try {
            var game_round_id = parseInt(req.params[0])
            if (!memoryDB.startRound(game_round_id)) {
                res.status(messageContent.ResponeStatus.CommonError).send(messageContent.FailMessage.startRoundFailToMemory)
            }
            game_rounds.update({ start_at: Sequelize.fn('NOW') }, {
                returning: true,
                where: {
                    id: game_round_id
                }
            }).then(() => {
                res.end()
            }, (error) => {
                memoryDB.resetRound(game_round_id)
                res.status(messageContent.ResponeStatus.CommonError).send(messageContent.FailMessage.startRoundFail + ': ' + error)
            })
        } catch (error) {
            res.status(messageContent.ResponeStatus.CommonError).send(messageContent.FailMessage.startRoundFail + ': ' + error)
        }
    },
    /**
     * get all the players score
     * @param {*} req 
     * @param {*} res 
     */
    getRoundAllPlayersScore(req, res) {
        try {
            var gameroundid = parseInt(req.params[0])
            var playerInfo = {}
            var game_round_players = {}
            if (memoryDB.isRoundExist(gameroundid)) {
                playerInfo = memoryDB.getRoundPlayerScore(gameroundid)
                playerInfo.game_round_id = gameroundid
                playerInfo.isFinished = memoryDB.isGameRoundOver(gameroundid)
                game_round_players.game_round_score = playerInfo
                res.send(game_round_players)
            }
            else {
                game_players.findAll({
                    where: {
                        game_round_id: gameroundid
                    },
                    order:[['score', 'DESC']] 
                }).then((rs) => {
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
                    res.send(game_round_players)
                }, (error) => {
                    res.status(messageContent.ResponeStatus.CommonError).send(messageContent.FailMessage.roundAllPlayerInfo + ': ' + error)
                })
            }
        } catch (error) {
            res.status(messageContent.ResponeStatus.CommonError).send(messageContent.FailMessage.roundAllPlayerInfo + ': ' + error)
        }
    },

    updateRoundFinishedTime(gameroundid, updatePlayerScoreToDB) {
        try {
            game_rounds.update({ end_at: Sequelize.fn('NOW') }, {
                returning: true,
                where: {
                    id: gameroundid
                }
            }).then(() => {
                updatePlayerScoreToDB(gameroundid)
            })
        } catch (error) {
            Console.log('updateRoundFinishedTime: '+ error)
        }
    }
}