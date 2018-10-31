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
        startRoundFailToMemory: 'start round fail when add to memory',
        updateRoundStateFail: 'update round state fail.'
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
        get AlreadyOver() { return this.CommonError + 2 },
        /**
         * 
         */
        get AlreadyOverWithPosition() { return this.CommonError + 3 },
        get RoundNotRun() { return this.CommonError + 4 }
    },

    // created	   0 created	新建
    //		open	     1 open	开始签到
    //		ready	     2 ready	结束签到，准备开始
    //		starting	 3 starting	开始前倒计时中
    //		started	   4 started	游戏已开始
    //		completed	 5 completed	游戏已结束
    //		disabled	 6 disabled	游戏已关闭

    GameRoundStates: { created: 0, open: 1, ready: 2, starting: 3, started: 4, completed: 5, disabled: 6 }
}

