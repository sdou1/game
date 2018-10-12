module.exports = (sequelize, DataTypes) => {
    return sequelize.define('games', {
        name: DataTypes.STRING,
        code: { type: DataTypes.BIGINT(11), defaultValue: '0' },
        desc: DataTypes.TEXT,
        /*created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },*/
        wx_oauth2_scope: { type: DataTypes.BIGINT(11), allowNull: false, defaultValue: '0' }
    })
}