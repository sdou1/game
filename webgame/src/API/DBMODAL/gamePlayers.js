module.exports = (sequelize, DataTypes) => {
    return sequelize.define('game_players', {
        openid: {type:DataTypes.STRING, allowNull: false, defaultValue: ''  },// 
        game_round_id: { type: DataTypes.BIGINT(11), allowNull: false, defaultValue: '0' },
        wechat_account_id: DataTypes.BIGINT(11),
        nickname: DataTypes.STRING(128),   
        score: { type: DataTypes.BIGINT(11), allowNull: false, defaultValue: '0' },
        avatar: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
        aasm_state:{ type: DataTypes.BIGINT(11), allowNull: false, defaultValue: '0' }
        /*end_at: DataTypes.DATE,
        desc: DataTypes.TEXT,
        award_desc: DataTypes.TEXT,
        duration: { type: DataTypes.BIGINT(11), defaultValue: '0' },
        gear: { type: DataTypes.BIGINT(11), defaultValue: '0' },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },*/
    })
}