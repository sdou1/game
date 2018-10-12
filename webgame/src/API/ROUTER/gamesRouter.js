const express = require('express')
const router = express.Router()
const gamecontroller = require('../CONTROLLER/gamesController')
router.get('/getallgames', gamecontroller.getAllGames)
router.delete('/*', gamecontroller.deleteGame)
router.put('/add', gamecontroller.addGame)
router.put('/update', gamecontroller.updateGame)
module.exports = router