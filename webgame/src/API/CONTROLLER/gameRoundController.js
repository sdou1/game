const messageContent = require('../constant')
const { LogMessage } = require('../common')
const dbOperation = require('../dboperation')
module.exports = {

    /**
     * get the rounds with options
     * @param {*} ctx 
     */
    async getRounds(ctx) {
        try {
            var opts = ctx.request.body ? ctx.request.body.option : null
            var allrounds = await dbOperation.MySqlOperation.GetRounds(opts ? opts.offset : null, opts ? opts.limit : null)
            if (allrounds) {
                ctx.body = allrounds
                ctx.status = 200
            }
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, 'can not get rounds', { expose: true })
            LogMessage('error', 'can not get rounds: ' + error)
        }
    },
    /**
     * create one round of a game, and add the round to the mememory db
     * @param {*} req 
     * @param {*} res 
     */
    async createRound(ctx) {
        var game_round = ctx.request.body.game_round
        try {
            var tmp = await dbOperation.MySqlOperation.CreateRound(game_round.name, game_round.award_desc, game_round.desc)
            if (tmp) {
                if (await dbOperation.MemoryDbOperation.CreateRound(tmp.id)) {
                    var round = {}
                    round.game_round = tmp
                    ctx.body = round
                    ctx.status = 200
                }
            }
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, `create round ${game_round.desc} fail: ` + error, { expose: true })
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
            await dbOperation.MemoryDbOperation.DeleteRound(game_round_id)
            await dbOperation.MySqlOperation.DeleteAwardsOfRound(game_round_id)
            await dbOperation.MySqlOperation.DeletePlayersOfRound(game_round_id)
            await dbOperation.MySqlOperation.DeleteRound(game_round_id)
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
            dbOperation.MemoryDbOperation.StartRound(game_round_id)
            dbOperation.MySqlOperation.StartRound(game_round_id)
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
            var rs = await dbOperation.MySqlOperation.GetRoundAllPlayersScore(gameroundid)
            var playerInfo = {}
            playerInfo.players = new Array()
            rs.forEach((x) => {
                var player = {
                    player_id: x.id,
                    score: x.score
                }
                playerInfo.players.push(player)
            })
            playerInfo.game_round_id = gameroundid
            var game_round_players = {}
            game_round_players.game_round_score = playerInfo
            ctx.body = game_round_players
            ctx.status = 200

        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.roundAllPlayerInfo + ': ' + error, { expose: true })
        }
    },

    async updateRoundFinishedTime(gameroundid) {
        try {
            await dbOperation.MySqlOperation.UpdateRoundFinishedTime(gameroundid)
            await dbOperation.MySqlOperation.InsertAllPlayersRoundScoreToDB(gameroundid)
        } catch (error) {
            LogMessage('error', 'updateRoundFinishedTime: ' + error)
        }
    },
    /**
     * update the round state
     * @param {*} ctx 
     */
    async updateRoundState(ctx) {
        var req = ctx.request
        try {
            var gameroundid = req.body.game_round.game_round_id
            var state = req.body.game_round.state
            await dbOperation.MySqlOperation.UpdateRoundState(gameroundid, state)
            await dbOperation.MemoryDbOperation.UpdateState(gameroundid, state)
            ctx.status = 200
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.updateRoundStateFail + ': ' + error, { expose: true })
        }
    },
    /**
     * get the state of the round
     * @param {*} ctx 
     */
    async getRoundState(ctx) {
        var gameroundid = parseInt(ctx.params[0])
        try {
            var state = await dbOperation.MemoryDbOperation.GetRoundState(gameroundid)//memoryDB.getRoundState(gameroundid)
            if (state < 0) {
                state = await dbOperation.MySqlOperation.GetRoundState(gameroundid)
            }
            ctx.body = { game_round: { 'state': state } }
            ctx.status = 200
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.updateRoundStateFail + ': ' + error, { expose: true })
        }
    },

    /**
     * 
     * @param {*} ctx 
     */
    async setRoundDone(ctx) {
        var gameroundid = parseInt(ctx.params[0])
        try {
            await dbOperation.MySqlOperation.UpdateRoundFinishedTime(gameroundid)
            await dbOperation.MySqlOperation.InsertAllPlayersRoundScoreToDB(gameroundid)
            await dbOperation.MemoryDbOperation.SetRoundDone(gameroundid)
            ctx.status = 200
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.updateRoundStateFail + ': ' + error, { expose: true })
        }
    }
}