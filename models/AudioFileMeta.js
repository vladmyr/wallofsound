"use strict";

module.exports = function(sequelize, DataTypes){
  var AudioFileMeta = sequelize.define("AudioFileMeta", {
    title: { type: DataTypes.STRING, allowNull: false },
    trackNo: DataTypes.INTEGER,
    duration: DataTypes.INTEGER,
    filePath: { type: DataTypes.STRING, allowNull: false, unique: true }
  }, {
    classMethods: {
      associate: function(models){
        AudioFileMeta.belongsTo(models.Album);
        AudioFileMeta.belongsTo(models.User);
        AudioFileMeta.belongsTo(models.Genre);
      }
    }
  });

  return AudioFileMeta;
}