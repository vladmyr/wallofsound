"use strict";

module.exports = function(sequelize, DataTypes){
  var Artist = sequelize.define("Artist", {
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
  }, {
    classMethods: {
      associate: function(models){
        Artist.hasMany(models.Album);
      }
    }
  });

  return Artist;
}