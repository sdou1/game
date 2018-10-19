const { game_awards } = require('../DBMODAL')
const messageContent = require('../constant')
module.exports = {
    async getAllAwards(ctx) {
        try {
            var game_round_id = ctx.params[0]
            var data = await game_awards.findAll({
                attributes: ['id', 'game_round_id', 'name', 'position', 'prize_count', 'prize_name'],
                where: {
                    'game_round_id': game_round_id
                }
            })
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
            ctx.body = await game_awards.create(award)
            ctx.status = 200
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.addGameAwardFail + 'Fail: ' + error, { expose: true })
        }
    },

    async deleteAward(ctx) {
        try {
            var award_id = ctx.params[0]
            await game_awards.destroy({
                where: {
                    id: award_id
                }
            })
            ctx.status = 200
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.deleteAwardFail + 'Fail: ' + error, { expose: true })
        }
    },

    async updateAward(ctx) {
        try {
            var award_id = ctx.params[0]
            var award = ctx.request.body.game_award
            ctx.body = await game_awards.update(award, {
                where: {
                    id: award_id
                }
            })
            ctx.status = 200
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.updateAwardFail + ' Fail:' + error, { expose: true })
        }
    },

    async getAward(ctx) {
        try {
            var award_id = ctx.params[0]
            var award = await game_awards.findOne({
                attributes: ['id', 'game_round_id', 'name', 'position', 'prize_count', 'prize_name'],
                where: {
                    id: award_id
                }
            })
            var rs = {}
            rs.game_award = award
            ctx.body = rs
            ctx.status = 200
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.getAwardFail + 'Fail: ' + error, { expose: true })
        }
    }
}