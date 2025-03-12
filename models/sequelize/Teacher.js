module.exports = function (sequelize, DataTypes) {
    return sequelize.define('teacher', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,/// null utga zowshoorohgvi
            primaryKey: true,//vndsen tvlhvvr
        },

        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
            
        },
        phone: {
            type: DataTypes.STRING(12),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        login_date: {
            type: DataTypes.DATE
        },
        birth_date: {
            type: DataTypes.DATEONLY
        },
    }, {
        tableName: 'teacher',
        timestamps: false,
    })
}