const memoryDb = require('./MEMORYDB')
const { Sequelize, game_rounds, game_players, game_awards } = require('./DBMODAL')

class MySqlOperation {
    constructor() {

    }
    /**
     * return the round / false
     * @param {*} gameroundname 
     * @param {*} awarddescription 
     * @param {*} description 
     */
    CreateRound(gameroundname, awarddescription, description) {
        var p = new Promise((resolve => {
            var round = {
                name: gameroundname,
                award_desc: awarddescription,
                desc: description
            }
            game_rounds.create(round).then((rs) => {
                resolve(rs)
            }, () => {
                resolve(false)
            })
        }))
        return p
    }
    /**
     * save the round start_at time in the db
     * @param {*} gameroundid 
     */
    StartRound(gameroundid) {
        var p = new Promise((resolve) => {
            game_rounds.update({ start_at: Sequelize.fn('NOW') }, {
                returning: true,
                where: {
                    id: gameroundid
                }
            }).then((rs) => {
                resolve(rs)
            }, () => {
                resolve(false)
            })
        })
        return p
    }
    /**
     * get tall the players score from the table
     * @param {} gameroundid 
     */
    GetRoundAllPlayersScore(gameroundid) {
        var p = new Promise((resolve) => {
            game_players.findAll({
                where: {
                    game_round_id: gameroundid
                },
                order: [['score', 'DESC']]
            }).then((data) => {
                resolve(data)
            }, () => {
                resolve(false)
            })
        })
        return p
    }
    /**
     * save the end_at time in the db
     * @param {*} gameroundid 
     */
    UpdateRoundFinishedTime(gameroundid) {
        var p = new Promise((resolve) => {
            game_rounds.update({ end_at: Sequelize.fn('NOW') }, {
                returning: true,
                where: {
                    id: gameroundid
                }
            }).then((rs) => {
                resolve(rs)
            }, () => {
                resolve(false)
            })
        })
        return p
    }
    /**
     * save the player score to the db
     * @param {*} gameroundid 
     */
    async InsertAllPlayersRoundScoreToDB(gameroundid) {
        try {
            var playerInfo = await memoryDb.getRoundPlayerScore(gameroundid)
            for (var player of playerInfo.players) {
                await game_players.update({ 'score': player.score }, {
                    where: {
                        id: player.player_id
                    }
                })
            }
            return true
        }
        catch (error) {
            return error
        }
    }
    /**
     * get all rounds from table
     * @param {*} offset  
     * @param {*} limit 
     */
    GetRounds(offset, limit) {
        var options = {
            'attributes': ['id', 'name', 'game_id', 'start_at', 'end_at'],
            'offset': offset,
            'limit': limit
        }
        var p = new Promise((resolve) => {
            game_rounds.findAll(options).then((rounds) => {
                resolve(rounds)
            }, () => {
                resolve(false)
            })
        })
        return p
    }
    /**
     * delete the round from the table
     * @param {*} gameroundid 
     */
    DeleteRound(gameroundid) {
        var p = new Promise((resolve) => {
            game_rounds.destroy({
                where: {
                    id: gameroundid
                }
            }).then(() => {
                resolve(true)
            }, () => {
                resolve(false)
            })
        })
        return p
    }
    /**
     * delete all awards of the round
     * @param {*} gameroundid 
     */
    DeleteAwardsOfRound(gameroundid) {
        var p = new Promise((resolve) => {
            game_awards.destroy({
                where: {
                    'game_round_id': gameroundid
                }
            }).then((rs) => {
                resolve(rs)
            }, () => {
                resolve(false)
            })
        })
        return p
    }
    /**
     * delete the players in the round
     * @param {*} gameroundid 
     */
    DeletePlayersOfRound(gameroundid) {
        var p = new Promise((resolve) => {
            game_players.destroy({
                where: {
                    'game_round_id': gameroundid
                }
            }).then((rs) => {
                resolve(rs)
            }, () => {
                resolve(false)
            })
        })
        return p
    }
    /**
     * update the state in the round
     * @param {*} gameroundid 
     * @param {*} state 
     */
    UpdateRoundState(gameroundid, state) {
        var p = new Promise((resolve) => {
            game_rounds.update({ 'state': state }, {
                where: {
                    id: gameroundid
                }
            }).then(() => {
                resolve(true)
            }, () => {
                resolve(false)
            })
        })
        return p
    }
    /**
     * get the round state from db
     * @param {*} gameroundid 
     */
    GetRoundState(gameroundid) {
        var p = new Promise((resolve) => {
            game_rounds.findOne({
                where: {
                    id: gameroundid
                }
            }).then((round) => {
                resolve(round.state)
            }, () => {
                resolve(0)
            })
        })
        return p
    }
    /**
     * add the player to db 
     * return player information include the id of the player
     * @param player = {
     *           "game_round_id": 117,
     *           "nickname": "pppsdou912fdsaffsdfqqqqq382"
     *       }
     */
    AddPlayerToRound(player) {
        var p = new Promise((resolve) => {
            game_players.create(player).then((rs) => {
                resolve(rs)
            }, () => {
                resolve(false)
            })
        })
        return p
    }
    /**
     * method to get the awards for the round
     * return award array /false/null
     * @param {*} gameroundid 
     */
    GetAllAwardsOfRound(gameroundid) {
        var p = new Promise((resolve) => {
            game_awards.findAll({
                attributes: ['id', 'game_round_id', 'name', 'position', 'prize_count', 'prize_name'],
                where: {
                    'game_round_id': gameroundid
                }
            }).then((rs) => {
                resolve(rs)
            }, () => {
                resolve(false)
            })
        })
        return p
    }
    /**
     * method to add award
     * @param {
	 *	"game_round_id": 77,
	 *	"name": "一等奖"
	 *	} award 
     */
    AddAward(award) {
        var p = new Promise((resolve) => {
            game_awards.create(award).then((data) => {
                resolve(data)
            }, () => {
                resolve(false)
            })
        })
        return p
    }
    /**
     * method the award by award id
     * return award
     * @param {*} awardid 
     */
    GetAwardById(awardid) {
        var p = new Promise((resolve) => {
            game_awards.findOne({
                attributes: ['id', 'game_round_id', 'name', 'position', 'prize_count', 'prize_name'],
                where: {
                    id: awardid
                }
            }).then((rs) => {
                resolve(rs)
            }, () => resolve(false))
        })
        return p
    }
    /**
     * method to delete the award by id
     * @param {*} awardid 
     */
    DeleteAwardById(awardid) {
        var p = new Promise((resolve) => {
            game_awards.destroy({
                where: {
                    id: awardid
                }
            }).then((rs) => {
                resolve(rs)
            }, () => resolve(false))
        })
        return p
    }

    UpdateAward(award, award_id) {
        var p = new Promise((resolve) => {
            game_awards.update(award, {
                where: {
                    id: award_id
                }
            }).then((rs) => {
                resolve(rs)
            }, () => resolve(false))
        })
        return p
    }
}

class MemoryDbOperation {
    constructor() {

    }
    /**
     * save the round in the memory db
     * return: true/false
     * @param {*} gameroundid 
     */
    CreateRound(gameroundid) {
        var p = new Promise((resolve) => {
            memoryDb.createNewRound(gameroundid).then((rs) => {
                resolve(rs)
            })
        })
        return p
    }
    /**
     * keep the runing value in the memory
     * return true/false
     * @param {*} gameroundid 
     */
    StartRound(gameroundid) {
        var p = new Promise((resolve) => {
            memoryDb.startRound(gameroundid).then((rs) => {
                resolve(rs)
            })
        })
        return p
    }
    /**
     * method to get all players score from the memory
     * return players info /false
     * @param {*} gameroundid 
     */
    async GetRoundAllPlayersScore(gameroundid) {
        if (!await memoryDb.isRoundExist(gameroundid))
            return false
        else {
            return await memoryDb.getRoundPlayerScore(gameroundid)
        }
    }
    /**
     * method to remove the round from the memory
     * return: true/false
     * @param {*} gameroundid 
     */
    async DeleteRound(gameroundid) {
        return await memoryDb.gameRoundDone(gameroundid)
    }
    /**
     * method the state of the round 
     * return true/false
     * @param {*} gameroundid 
     * @param {*} state 
     */
    async UpdateState(gameroundid, state) {
        return await memoryDb.updateRoundState(gameroundid, state)
    }
    /**
     * method to get the round state
     * return state(-1 means there is no round in the memory)
     * @param {*} gameroundid 
     */
    GetRoundState(gameroundid) {
        var p = new Promise((resolve) => {
            memoryDb.getRoundState(gameroundid).then((data) => {
                resolve(data)
            })
        })
        return p
    }
    /**
     * method to set the round done and remove the round from memory db
     * return true/false
     * @param {*} gameroundid 
     */
    SetRoundDone(gameroundid) {
        var p = new Promise((resolve) => {
            memoryDb.gameRoundDone(gameroundid).then((rs) => resolve(rs))
        })
        return p
    }
    /**
     * add the player to the round in memory
     * return true/false
     * @param {*} gameroundid 
     * @param {*} playerid 
     * @param {*} name 
     */
    AddPlayerToRound(gameroundid, playerid, name) {
        var p = new Promise((resolve) => {
            memoryDb.addPlayer(gameroundid, playerid, name).then((rs) => {
                resolve(rs)
            })
        })
        return p
    }
    /**
     * method to update player score
     * return true/false
     * @param {*} gameroundid 
     * @param {*} playerid 
     * @param {*} score 
     */
    UpdatePlayerScore(gameroundid, playerid, score) {
        var p = new Promise((resolve) => {
            memoryDb.updatePlayerScore(gameroundid, playerid, score).then((rs) => {
                resolve(rs)
            })
        })
        return p
    }

    GetPlayerScore(gameroundid, playerid) {
        var p = new Promise((resolve) => {
            memoryDb.getPlayerScore(gameroundid, playerid).then((rs) => {
                resolve(rs)
            })
        })
        return p
    }
}

module.exports.MySqlOperation = new MySqlOperation()
module.exports.MemoryDbOperation = new MemoryDbOperation()
