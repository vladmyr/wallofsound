"use strict";

module.exports = function(sequelize, DataTypes){
  var RefreshToken = sequelize.define("RefreshToken", {
    token: { type: DataTypes.STRING, unique: true, allowNull: false }
  },{
    classMethods: {
      associate: function(models){
        RefreshToken.belongsTo(models.Client);
        RefreshToken.belongsTo(models.User);
      }
    }
  });
  return RefreshToken;
}