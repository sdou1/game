'use strict'
class player {
    constructor(game_round_id, player_id, player_name) {
        this.game_round_id = game_round_id
        this.player_id = player_id
        this.player_name = player_name
        this.player_score = 0
    }

    resetPlayer() {
        this.score = 0
    }

    set score(value) {
        this.player_score = value
    }

    get score() {
        return this.player_score
    }

    get gameRoundId() {
        return this.game_round_id
    }

    get name() {
        return this.player_name
    }

    get id() {
        return this.player_id
    }
}

module.exports = player