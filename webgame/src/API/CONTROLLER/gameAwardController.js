const { game_awards } = require('../DBMODAL')
const messageContent = require('../constant')
module.exports = {
    getAllAwards(req, res) {
        var game_round_id = req.params[0]
        game_awards.findAll({
            attributes: ['id', 'game_round_id', 'name', 'position', 'prize_count', 'prize_name'],
            where: {
                'game_round_id': game_round_id
            }
        }).then(data => {
            var awards = {}
            awards.game_awards = data
            res.send(awards)
        }, error => {
            res.status(messageContent.ResponeStatus.CommonError).send(messageContent.FailMessage.getAllGameAwardFail + 'Fail: ' + error)
        })
    },

    addAward(req, res) {
        var award = req.body.game_award

        game_awards.create(award).then((rs) => {
            res.send(rs)
        }, error => {
            res.status(messageContent.ResponeStatus.CommonError).send(messageContent.FailMessage.addGameAwardFail + 'Fail: ' + error)
        })
    },

    deleteAward(req, res) {
        var award_id = req.params[0]
        game_awards.destroy({
            where: {
                id: award_id
            }
        }).then(() => {
            res.end()
        }, error => {
            res.status(messageContent.ResponeStatus.CommonError).send(messageContent.FailMessage.deleteAwardFail + 'Fail: ' + error)
        })
    },

    async updateAward(req, res) {
        var award_id = req.params[0]
        var award = req.body.game_award
        game_awards.update(award, {
            where: {
                id: award_id
            }
        }).then((rs) => {
            res.send(rs)
        }, (error) => {
            res.status(messageContent.ResponeStatus.CommonError).send(messageContent.FailMessage.updateAwardFail+' Fail:'+ error)
        })
    },

    getAward(req, res) {
        var award_id = req.params[0]
        game_awards.findOne({
            attributes: ['id', 'game_round_id', 'name', 'position', 'prize_count', 'prize_name'],
            where: {
                id: award_id
            }
        }).then((award) => {
            var rs = {}
            rs.game_award = award
            res.send(rs)
        }, error => {
            res.status(messageContent.ResponeStatus.CommonError).send(messageContent.FailMessage.getAwardFail + 'Fail: ' + error)
        })
    }
}