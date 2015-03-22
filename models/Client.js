"use strict";

module.exports = function(sequelize, DataTypes){
  var Client = sequelize.define("Client",{
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    clientId: { type: DataTypes.STRING, unique: true, allowNull: false },
    clientSecret: { type: DataTypes.STRING, allowNull: false }
  },{
    classMethods: {
      associate: function(models){
        Client.hasOne(models.AccessToken);
        Client.hasOne(models.RefreshToken);
      }
    }
  });

  return Client;
}