"use strict";

module.exports = function(sequelize, DataTypes){
  var UserSettings = sequelize.define("UserSettings", {
    photo: DataTypes.STRING,
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    birth: DataTypes.DATEONLY
  }, {
    classMethods: {
      associate: function(models){
        UserSettings.belongsTo(models.User);
      }
    }
  });
  return UserSettings;
}