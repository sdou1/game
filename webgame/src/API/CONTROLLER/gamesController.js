const { games } = require('../DBMODAL')
const messageContent = require('../constant')
const { LogMessage } = require('../common')
module.exports = {
    async addGame(ctx) {
        var req = ctx.request
        try {
            var game = {
                name: req.body.game.name,
                code: req.body.game.code,
                desc: req.body.game.desc
            }
            var tmp = await games.create(game)
            var value = {}
            value.game = tmp
            ctx.body = value
            ctx.status = 200
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, `create game ${req.body.game.name} fail, error: ${error}`, { expose: true })
        }
    },

    async deleteGame(ctx) {
        var req = ctx
        try {
            var rows = await games.destroy({
                where: {
                    //id: req.body.id
                    id: req.params[0]
                }
            })
            LogMessage('log', rows)
            ctx.status = 200
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, `delete game ${req.params[0]} fail, error: ${error}`, { expose: true })
        }
    },


    async getAllGames(ctx) {
        try {
            var rs = await games.findAll({
                attributes: ['id', 'name', 'code', 'desc']
            })

            var gamelist = {}
            gamelist.games = rs
            ctx.status = 200
            ctx.body = gamelist
        }
        catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, 'can not get all games', { repose: true })
            LogMessage('error', 'can not get all games: ' + error)
        }
    },

    async updateGame(ctx) {
        var req = ctx.request
        var gameid = req.body.game.id
        try {
            await games.update(req.body.game.attributes, {
                returning: true,
                where: {
                    id: gameid
                }
            })
            ctx.status = 200
            LogMessage('log',`udpate game ${gameid}`)
        }
        catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, `can not udpate game ${gameid}`, { repose: true })
            LogMessage('error',`can not udpate game ${gameid}, error: ${error}`)
        }
    }
}