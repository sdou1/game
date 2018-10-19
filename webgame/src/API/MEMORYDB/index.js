const GameRound = require('./gameround')
const player = require('./player')
class memorydb {
    constructor() {
    }

    static createNewRound(gameroundid) {

        if (memorydb.GAMEROUNDS.has(gameroundid) && memorydb.GAMEROUNDS.get(gameroundid).isgameover)
            return false

        memorydb.GAMEROUNDS.set(gameroundid, new GameRound(gameroundid))
    }

    static addPlayer(gameroundid, playerid, name) {
        var round = memorydb.GAMEROUNDS.get(gameroundid)
        if (!round)
            return false
        var p = new player(gameroundid, playerid, name)
        memorydb.PLAYERS.set(playerid, p)
        round.addPlayer(p)
        return true
    }
    /**
     * * start the round 
     * @param {*} gameroundid 
     */
    static startRound(gameroundid) {
        var round = memorydb.GAMEROUNDS.get(gameroundid)
        if (round) {
            round.startRound()
            return true
        }
        return false
    }
    /**
     * * udpate the player score 
     * @param {*} gameroundid  the id of the round which the playe join 
     * @param {*} playerid  the player id from client
     * @param {*} score      the player's core from client
     * @param {*} isfinished if the player is finished the game from client
     */
    static updatePlayerScore(playerid, score, isfinished) {
        var p = memorydb.PLAYERS.get(playerid)
        if (!p) return false
        var round = memorydb.GAMEROUNDS.get(p.gameRoundId)
        if (round) {
            p.score = score
            if (isfinished) {
                round.roundOver()
            }
            return true
        }
        return false
    }
    /**
     * get score of the player in the round
     * @param {*} playerid 
     */
    static getPlayerScore(playerid) {
        var p = memorydb.PLAYERS.get(playerid)
        if (!p)
            return 0
        return p.score
    }
    /**
     * get score of all player
     * @param {*} gameroundid 
     */
    static getRoundPlayerScore(gameroundid) {
        var info = {}
        var round = memorydb.GAMEROUNDS.get(gameroundid)
        if (!round)
            return info
        info.players = round.getAllPlayersInfo.sort((x, y) => {
            return x.score < y.score
        })
        return info
    }
    /**
     * get the index in the round
     * @param {*} playerid 
     */
    static getRoundPosition(playerid) {
        var p = memorydb.PLAYERS.get(playerid)
        if (!p)
            return -1
        var round = memorydb.GAMEROUNDS.get(p.gameRoundId)
        var pScores = round.getAllPlayersInfo
        var position = 1
        pScores.forEach(x => {
            if (x.score > p.score)
                position++
        })
        return position
    }
    /**
     * initialize the round
     * @param {*} gameroundid 
     */
    static resetRound(gameroundid) {
        var round = memorydb.GAMEROUNDS.get(gameroundid)
        if (!round)
            return round.resetRound()
    }

    /**
     * 
     * @param {*} gameroundid 
     * set the game is done, remove out of memorydb
     */
    static gameRoundDone(gameroundid) {
        memorydb.GAMEROUNDS.delete(gameroundid)
    }
    /**
     * check if the round exist in memory db
     * @param {*} gameroundid 
     */
    static isRoundExist(gameroundid) {
        return memorydb.GAMEROUNDS.has(gameroundid)
    }
    /**
     * check if the round is running if running, no player can be added
     * @param {*} gameroundid 
     */
    static isGameRoundRuning(gameroundid) {
        var round = memorydb.GAMEROUNDS.get(gameroundid)
        if (round) {
            return round.isRoundRuning
        }
        return false
    }
    /**
     * check if the round is finished(one player finished the game), if the round finished, cannot udpate the player score and also can not add player to the round
     * @param {*} gameroundid 
     */
    static isGameRoundOver(gameroundid) {
        var round = memorydb.GAMEROUNDS.get(gameroundid)
        if (round) {
            return round.isRoundOver
        }
        return true
    }

    static isEmpty(gameroundid) {
        var round = memorydb.GAMEROUNDS.get(gameroundid)
        if (round) {
            return round.isEmpty
        }
        return true
    }

    static hasPlayer(gameroundid, playerid) {
        var round = memorydb.GAMEROUNDS.get(gameroundid)
        if (round) {
            return round.isPlayerExist(playerid)
        }
        return false
    }
}

memorydb.GAMEROUNDS = new Map()   //key: game id, value: game
memorydb.PLAYERS = new Map()

module.exports = memorydb