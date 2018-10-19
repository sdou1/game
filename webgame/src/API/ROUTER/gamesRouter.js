
const koaRouter = require('koa-router')
const gamecontroller = require('../CONTROLLER/gamesController')
const router = new koaRouter()
router.get('/getallgames', gamecontroller.getAllGames)
router.delete('/*', gamecontroller.deleteGame)
router.put('/add', gamecontroller.addGame)
router.put('/update', gamecontroller.updateGame)
module.exports = router