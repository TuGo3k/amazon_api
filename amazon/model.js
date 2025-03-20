const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('model', {
    teacherId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    courseId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'model',
    timestamps: true,
    timestamp: false
  });
};
