const koaRouter = require('koa-router')
const gamePlayerController = require('../CONTROLLER/gamePlayerController')
const router = new koaRouter()
router.put('/addplayer', gamePlayerController.addPlayerToRound)
router.put('/updatescore', gamePlayerController.updatePlayerScore)
router.put('/getplayerscore', gamePlayerController.getPlayerScore)
module.exports = router