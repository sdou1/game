module.exports = {
    FailMessage: {
        addPlayerToRound: 'add player fail.',
        roundAlreadyRuning: 'the round is already running.',
        roundAlreadyOver: 'the round is already over.',
        startRoundFail: 'can not start the round.',
        deleteRoundFail: 'can not delete the round',
        roundIsNotRunning: 'the round is not running.',
        roundWithoutPlayer: 'the player is not in the round.',
        updateScoreFail: 'update the score of the player failed.',
        roundAllPlayerInfo: 'can not get all players info.',
        getAllGameAwardFail: 'get all game awards fail.',
        addGameAwardFail: 'add award fail for game round.',
        deleteAwardFail: 'delete award fail.',
        getAwardFail: 'get award(${award_id}) fail.',
        updateAwardFail: 'update award fail.',
        addPlayerToMemoryFail: 'add player to memory fail.',
        startRoundFailToMemory: 'start round fail when add to memory'
    },
    getErrorMessge(){
        return 'my error message'
    },

    ResponeStatus:{
        CommonError: 500, //common error status
        AlreadyRuning: 501, //the round already running
        AlreadyOver: 502, //the round already over
        AlreadyOverWithPosition: 503,
        RoundNotRun: 504
    }
}

