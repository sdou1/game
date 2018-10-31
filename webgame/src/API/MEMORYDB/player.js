'use strict'
class player {
    constructor(game_round_id, player_id, player_name) {
        this.game_round_id = game_round_id
        this.player_id = player_id
        this.player_name = player_name
        this.player_score = 0
    }
}

module.exports = player