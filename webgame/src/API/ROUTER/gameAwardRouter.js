const express = require('express')
const gameAwardController = require('../CONTROLLER/gameAwardController')
const router = express.Router()
router.get('/allawards/*', gameAwardController.getAllAwards)
router.put('/addaward', gameAwardController.addAward)
router.put('/updateaward/*', gameAwardController.updateAward)
router.delete('/*', gameAwardController.deleteAward)
router.get('/*', gameAwardController.getAward)
module.exports = router