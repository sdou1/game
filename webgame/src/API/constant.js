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
    ResponeStatus: {
        CommonError: 600, //common error status
        /**
         * the round already running
         */
        get AlreadyRuning() { return this.CommonError + 1 }, 
        /**
         * the round already over
         */
        get AlreadyOver() {return this.CommonError + 2  },
        /**
         * 
         */
        get AlreadyOverWithPosition() { return this.CommonError + 3 },
        get RoundNotRun() {return this.CommonError + 4 }
    }
}

