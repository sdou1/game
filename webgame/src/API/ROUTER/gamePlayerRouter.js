const koaRouter = require('koa-router')
const gamePlayerController = require('../CONTROLLER/gamePlayerController')
const gamePlayerPolicy = require('../CONTROLLERPOLICY/gamePlayerPolicy')
const router = new koaRouter()
router.put('/addplayer', gamePlayerPolicy.addPlayerToRound, gamePlayerController.addPlayerToRound)
router.put('/updatescore', gamePlayerPolicy.updatePlayerScore, gamePlayerController.updatePlayerScore)
module.exports = router