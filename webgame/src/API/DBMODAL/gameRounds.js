const {GameRoundStates} = require('../constant')
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('game_rounds', {
        campaign_id: DataTypes.BIGINT(11),  // 
        game_id: DataTypes.BIGINT(11),
        name: DataTypes.STRING,
        creator_id: DataTypes.BIGINT(11),
        state: { type: DataTypes.BIGINT(11), defaultValue: GameRoundStates.created },
        start_at: DataTypes.DATE,
        end_at: DataTypes.DATE,
        desc: DataTypes.TEXT,
        award_desc: DataTypes.TEXT,
        duration: { type: DataTypes.BIGINT(11), defaultValue: '0' },
        gear: { type: DataTypes.BIGINT(11), defaultValue: '0' },
        /*created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },*/
    })
}