module.exports = function (sequelize, DataTypes) {
    return sequelize.define('course', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,/// null utga zowshoorohgvi
            primaryKey: true,//vndsen tvlhvvr
        },

        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
            
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tailbar: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, 
    {
        tableName: 'course',
    })
}