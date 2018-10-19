const koaRouter = require('koa-router')
const gameAwardController = require('../CONTROLLER/gameAwardController')
const router = new koaRouter()

router.get('/allawards/*', gameAwardController.getAllAwards)
router.put('/addaward', gameAwardController.addAward)
router.put('/updateaward/*', gameAwardController.updateAward)
router.delete('/*', gameAwardController.deleteAward)
router.get('/*', gameAwardController.getAward)
module.exports = router