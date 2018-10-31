const GameRound = require('./gameround')
const player = require('./player')
const redisClient = require('./redisClient')
const GAMEROUNDS_STRING = 'GAMEROUNDS'
class memorydb {
    constructor() {
    }

    static createNewRound(gameroundid) {
        var p = new Promise((resolve) => {
            memorydb.GAMEROUNDS.get(GAMEROUNDS_STRING, (error, rounds) => {
                if (error) // already exist
                    resolve(false)
                else {
                    if (!rounds) rounds = new Map()
                    var bExist = rounds.get(gameroundid)
                    if (bExist) resolve(false)
                    else {
                        rounds.set(gameroundid, new GameRound(gameroundid))
                        memorydb.GAMEROUNDS.set(GAMEROUNDS_STRING, rounds, () => {
                            resolve(true)
                        })
                    }
                }
            })
        })
        return p
    }

    static addPlayer(gameroundid, playerid, name) {
        var p = new Promise((resolve) => {
            memorydb.PLAYERS.get(gameroundid, (error, players) => {
                if (error)
                    resolve(false)
                else {
                    var p = new player(gameroundid, playerid, name)
                    if (!players) players = new Map()
                    players.set(playerid, p)
                    memorydb.PLAYERS.set(gameroundid, players, (error) => {
                        if (error) resolve(false)
                        else {
                            resolve(true)
                        }
                    })
                }
            })
        })
        return p
    }
    /**
     * * start the round 
     * @param {*} gameroundid 
     */
    static startRound(gameroundid) {
        var p = new Promise((resolve) => {
            memorydb.GAMEROUNDS.get(GAMEROUNDS_STRING, (error, rounds) => {
                if (error || !rounds) resolve(false)
                else {
                    var round = rounds.get(gameroundid)

                    if (round) {
                        round.roundruning = true
                        memorydb.GAMEROUNDS.update(GAMEROUNDS_STRING, rounds)
                    }
                    resolve(round)
                }
            })
        })
        return p
    }
    /**
     * set the round state
     * @param {*} gameroundid 
     * @param {*} state 
     */
    static updateRoundState(gameroundid, state) {
        var p = new Promise((resolve) => {
            memorydb.GAMEROUNDS.get(GAMEROUNDS_STRING, (error, rounds) => {
                if (error || !rounds) resolve(false)
                else {
                    var round = rounds.get(gameroundid)
                    if (round) {
                        round.state = state
                        memorydb.GAMEROUNDS.update(GAMEROUNDS_STRING, rounds)
                    }
                    resolve(round)
                }
            })
        })
        return p
    }

    static getRoundState(gameroundid) {
        var p = new Promise((resolve) => {
            memorydb.GAMEROUNDS.get(GAMEROUNDS_STRING, (error, rounds) => {
                if (error || !rounds) resolve(false)
                else {
                    var round = rounds.get(gameroundid)
                    if (round) {
                        resolve(round.state)
                    }
                    else
                        resolve(-1)
                }
            })
        })
        return p
    }
    /**
     * * udpate the player score 
     * @param {*} gameroundid  the id of the round which the playe join 
     * @param {*} playerid  the player id from client
     * @param {*} score      the player's core from client
     */
    static updatePlayerScore(gameroundid, playerid, score) {

        var p = new Promise((resolve) => {
            memorydb.PLAYERS.get(gameroundid, (error, players) => {
                if (error || !players) resolve(false)
                else {
                    var player = players.get(playerid)
                    if (!player) resolve(false)
                    else {
                        player.player_score = score
                        memorydb.PLAYERS.update(gameroundid, players, () => {
                            resolve(true)
                        })
                    }
                }
            })
        })

        return p
    }
    /**
     * get score of the player in the round
     * @param {*} gameroundid 
     * @param {*} playerid 
     */
    static getPlayerScore(gameroundid, playerid) {

        var p = new Promise((resolve) => {
            memorydb.PLAYERS.get(gameroundid, (error, players) => {
                if (error || !players) resolve(0)
                else {
                    var player = players.get(playerid)
                    if (!player) resolve(0)
                    else {
                        resolve(player.player_score)
                    }
                }
            })
        })
        return p
    }
    /**
     * get score of all player
     * @param {*} gameroundid 
     */
    static getRoundPlayerScore(gameroundid) {
        var p = new Promise((resolve) => {
            memorydb.PLAYERS.get(gameroundid, (error, players) => {
                if (error || !players) resolve({})
                else {
                    var ar = new Array()
                    players.forEach(player => {
                        ar.push({ player_id: player.player_id, score: player.player_score })
                    })
                    resolve({ 'players': ar })
                }
            })
        })
        return p
    }
    /**
     * get the index in the round
     * @param {*} playerid 
     */
    static getRoundPosition(gameroundid, playerid) {
        var p = new Promise((resolve) => {
            memorydb.PLAYERS.get(gameroundid, (error, players) => {
                if (error || !players) resolve({})
                else {
                    var position = 1
                    var score = players.get(playerid).player_score
                    players.forEach(x => {
                        if (x.player_score > score)
                            position++
                    })
                    resolve(position)
                }
            })
        })
        return p
    }

    /**
     * 
     * @param {*} gameroundid 
     * set the game is done, remove out of memorydb
     */
    static gameRoundDone(gameroundid) {
        var p = new Promise((resolve) => {
            memorydb.GAMEROUNDS.get(GAMEROUNDS_STRING, (error, rounds) => {
                if (error || !rounds)
                    resolve(false)
                else {
                    var round = rounds.get(gameroundid)
                    if (!round) resolve(true)
                    else {
                        rounds.delete(gameroundid)
                        memorydb.GAMEROUNDS.set(GAMEROUNDS_STRING, rounds)
                        memorydb.PLAYERS.remove(gameroundid)
                        resolve(true)
                    }
                }
            })
        })
        return p
    }
    /**
     * check if the round exist in memory db
     * @param {*} gameroundid 
     */
    static isRoundExist(gameroundid) {
        var p = new Promise((resolve) => {
            memorydb.GAMEROUNDS.get(GAMEROUNDS_STRING, (error, rounds) => {
                if (error || !rounds) resolve(false)
                else {
                    if (rounds.get(gameroundid))
                        resolve(true)
                    else
                        resolve(false)
                }
            })
        })
        return p
    }
    /**
     * check if the round is running if running, no player can be added
     * @param {*} gameroundid 
     */
    static isGameRoundRuning(gameroundid) {
        var p = new Promise((resolve) => {
            memorydb.GAMEROUNDS.get(GAMEROUNDS_STRING, (error, rounds) => {
                if (error || !rounds) resolve(false)
                else {
                    var round = rounds.get(gameroundid)
                    if (!round) resolve(false)
                    else
                        resolve(round.roundruning)
                }
            })
        })
        return p
    }
    /**
     * check if the round is finished(one player finished the game), if the round finished, cannot udpate the player score and also can not add player to the round
     * @param {*} gameroundid 
     */
    static isGameRoundOver(gameroundid) {
        var p = new Promise((resolve) => {
            memorydb.GAMEROUNDS.get(GAMEROUNDS_STRING, (error, rounds) => {
                if (error || !rounds) resolve(true)
                else {
                    var round = rounds.get(gameroundid)
                    if (!round) resolve(true)
                    else
                        resolve(round.roundOver)
                }
            })
        })
        return p
    }

    static isEmpty(gameroundid) {
        var p = new Promise((resolve) => {
            memorydb.PLAYERS.get(gameroundid, (error, players) => {
                if (error || !players) resolve(false)
                else {
                    resolve(players.size === 0)
                }
            })
        })
        return p
    }

    static hasPlayer(gameroundid, playerid) {
        var p = new Promise((resolve) => {
            memorydb.PLAYERS.get(gameroundid, (error, players) => {
                if (error || !players) resolve(false)
                else {
                    resolve(players.get(playerid))
                }
            })
        })
        return p
    }
}

memorydb.GAMEROUNDS = new redisClient()   //key: 'GAMEROUNDS_STRING', value: Map(roundid, round)
memorydb.PLAYERS = new redisClient()   //key: game_round_id, value: Map(player_id: player) all players in the game round

module.exports = memorydb