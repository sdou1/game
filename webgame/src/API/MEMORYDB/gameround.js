'use strict'
class GameRound {
    constructor(gameroundid) {
        this.gameroundid = gameroundid
        this.players = new Map() // key: player id, value: the number of 
        this.roundover = false
        this.roundruning = false  //the game is stared
    }

    addPlayer(p) {
        let _this = this
        if (!_this.players.has(p.id))
            _this.players.set(p.id, p)
    }

    startRound() {
        let _this = this
        _this.roundruning = true
    }

    resetRound() {
        let _this = this
        _this.roundruning = false
    }

    roundOver() {
        let _this = this
        _this.roundover = true
    }

    removePlayer(playerid) {
        let _this = this
        _this.players.delete(playerid)
    }

    get getAllPlayersInfo() {
        let _this = this
        var p = new Array()
        _this.players.forEach((value, key) => {
            p.push({ player_id: key, score: value.score })
        })
        return p
    }

    get isRoundOver() {
        return this.roundover
    }

    get isRoundRuning() {
        return this.roundruning
    }

    get isEmpty() {
        return this.players.size === 0
    }

    isPlayerExist(playerid) {
        let _this = this
        return _this.players.has(playerid)
    }
}

module.exports = GameRound