"use strict";

module.exports = function(sequelize, DataTypes){
  var Genre = sequelize.define("Genre", {
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
  }, {
    classMethods: {
      associate: function(models){
        Genre.hasMany(models.AudioFileMeta);
      }
    }
  });

  return Genre;
}