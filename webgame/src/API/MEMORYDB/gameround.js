'use strict'
class GameRound {
    constructor(gameroundid) {
        this.game_round_id = gameroundid
        this.state = 0
        this.roundruning = false
        this.roundOver = false
    }
}

module.exports = GameRound