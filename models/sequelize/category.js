const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('category', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ner: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    aver_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    aver_rate: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categorycol: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'category',
    timestamps: false,
    timestamp: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
