const express = require('express')
const gamePlayerController = require('../CONTROLLER/gamePlayerController')
const gamePlayerPolicy = require('../CONTROLLERPOLICY/gamePlayerPolicy')
const router = express.Router()
router.put('/addplayer', gamePlayerPolicy.addPlayerToRound, gamePlayerController.addPlayerToRound)
router.put('/updatescore', gamePlayerPolicy.updatePlayerScore, gamePlayerController.updatePlayerScore)
module.exports = router