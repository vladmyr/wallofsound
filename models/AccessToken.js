"use strict";

module.exports = function(sequelize, DataTypes){
  var AccessToken = sequelize.define("AccessToken", {
    token: { type: DataTypes.STRING, unique: true, allowNull: false }
  },{
    classMethods: {
      associate: function(models){
        AccessToken.belongsTo(models.Client);
        AccessToken.belongsTo(models.User);
      }
    }
  });

  return AccessToken;
}