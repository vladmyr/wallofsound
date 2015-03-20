"use strict";

module.exports = function(sequelize, DataTypes){
  var Album = sequelize.define("Album", {
    title: { type: DataTypes.STRING, allowNull: false },
    year: DataTypes.INTEGER,
    tracks: DataTypes.INTEGER,
    cover: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models){
        Album.hasMany(models.AudioFileMeta);
        Album.belongsTo(models.Artist);
      }
    }
  });

  return Album;
}