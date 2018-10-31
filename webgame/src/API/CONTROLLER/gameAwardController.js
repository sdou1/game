const dbOperatin = require('../dboperation')
const messageContent = require('../constant')
module.exports = {
    async getAllAwards(ctx) {
        try {
            var game_round_id = ctx.params[0]
            var data = await dbOperatin.MySqlOperation.GetAllAwardsOfRound(game_round_id)
            var awards = {}
            awards.game_awards = data
            ctx.body = awards
            ctx.status = 200
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.getAllGameAwardFail, { expose: true })
        }
    },

    async addAward(ctx) {
        try {
            var award = ctx.request.body.game_award
            ctx.body = await dbOperatin.MySqlOperation.AddAward(award)
            ctx.status = 200
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.addGameAwardFail + 'Fail: ' + error, { expose: true })
        }
    },

    async deleteAward(ctx) {
        try {
            var award_id = ctx.params[0]
            await dbOperatin.MySqlOperation.DeleteAwardById(award_id)
            ctx.status = 200
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.deleteAwardFail + 'Fail: ' + error, { expose: true })
        }
    },

    async updateAward(ctx) {
        try {
            var award_id = ctx.params[0]
            var award = ctx.request.body.game_award
            ctx.body = await dbOperatin.MySqlOperation.UpdateAward(award, award_id)
            ctx.status = 200
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.updateAwardFail + ' Fail:' + error, { expose: true })
        }
    },

    async getAward(ctx) {
        try {
            var award_id = ctx.params[0]
            var award = await dbOperatin.MySqlOperation.GetAwardById(award_id)
            var rs = {}
            rs.game_award = award
            ctx.body = rs
            ctx.status = 200
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.getAwardFail + 'Fail: ' + error, { expose: true })
        }
    }
}