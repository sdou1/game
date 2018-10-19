const koaRouter = require('koa-router')
const gamesRouter = require('./gamesRouter')
const gameRoundRouter = require('./gameRoundRouter')
const gameAwardRouter = require('./gameAwardRouter')
const gamePlayerRouter = require('./gamePlayerRouter')
var router = new koaRouter()

router.use('/API/games', gamesRouter.routes())             // the games router, process get or post for path '/games/*' ,
router.use('/API/game_round', gameRoundRouter.routes())
router.use('/API/game_award', gameAwardRouter.routes())
router.use('/API/game_player', gamePlayerRouter.routes())

module.exports = router