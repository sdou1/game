const gamesRouter = require('./gamesRouter')
const gameRoundRouter = require('./gameRoundRouter')
const gameAwardRouter = require('./gameAwardRouter')
const gamePlayerRouter = require('./gamePlayerRouter')
module.exports = (exp) => {
    exp.use('/API/games', gamesRouter)             // the games router, process get or post for path '/games/*' ,
    exp.use('/API/game_round', gameRoundRouter)
    exp.use('/API/game_award', gameAwardRouter)
    exp.use('/API/game_player', gamePlayerRouter)
}