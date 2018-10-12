const { games } = require('../DBMODAL')
const messageContent = require('../constant')
const Console = console
module.exports = {
    async addGame(req, res) {
        try {
            var game = {
                name: req.body.game.name,
                code: req.body.game.code,
                desc: req.body.game.desc
            }
            games.create(game).then((tmp) => {
                var value = {}
                value.game = tmp
                res.send(value)
            }, error => {
                res.status(messageContent.ResponeStatus.CommonError).send(`create game ${req.body.name} fail, error: ${error}`)
            })
        } catch (error) {
            res.status(messageContent.ResponeStatus.CommonError).send(`create game ${req.body.name} fail, error: ${error}`)
        }
    },
    async deleteGame(req, res) {
        try {
            games.destroy({
                where: {
                    //id: req.body.id
                    id: req.params[0]
                }
            }).then((rows) => {
                res.end()
                Console.log('delete rows: ' + rows)
            }, error => {
                res.status(messageContent.ResponeStatus.CommonError).send(`delete game ${req.body.id} fail, error: ${error}`)
            })
        } catch (error) {
            res.status(messageContent.ResponeStatus.CommonError).send(`delete game ${req.body.id} fail, error: ${error}`)
        }
    },


    async getAllGames(req, res) {
        try {
            games.findAll({
                attributes: ['id', 'name', 'code', 'desc']
            }).then(rs => {
                var gamelist = {}
                gamelist.games = rs
                res.send(gamelist)
            }, error => {
                res.status(messageContent.ResponeStatus.CommonError).send(`can not get all games, error: ${error}`)
            })
        }
        catch (error) {
            res.status(messageContent.ResponeStatus.CommonError).send('can not get all games')
            Console.log('can not get all games: ' + error)
        }
    },

    async updateGame(req, res) {
        try {
            var gameid = req.body.game.id
            games.update(req.body.game.attributes, {
                returning: true,
                where: {
                    id: gameid
                }
            }).then(() => {
                res.end()
                Console.log(`udpate game ${gameid}`)
            }, (error) => {
                res.status(messageContent.ResponeStatus.CommonError).send(`can not udpate game ${gameid}, error: ${error}`)
            })
        }
        catch (error) {
            res.status(messageContent.ResponeStatus.CommonError).send(`can not udpate game ${gameid}`)
            Console.log(`can not udpate game ${gameid}, error: ${error}`)
        }
    }

}