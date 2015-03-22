"use strict";

module.exports = function(sequelize, DataTypes){
  var User = sequelize.define("User", {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    isBlocked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isLocked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    role: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    //tableName:
    //timestamp:
    classMethods: {
      associate: function(models){
        User.hasOne(models.UserSettings);
        User.hasMany(models.AudioFileMeta);
        User.hasMany(models.AccessToken);
        User.hasMany(models.RefreshToken);
      }
    }
  });

  return User;
}