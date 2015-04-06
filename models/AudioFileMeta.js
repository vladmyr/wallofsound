"use strict";

module.exports = function(sequelize, DataTypes){
  var AudioFileMeta = sequelize.define("AudioFileMeta", {
    title: { type: DataTypes.STRING, allowNull: false },
    trackNo: DataTypes.INTEGER,
    duration: DataTypes.INTEGER,
    filePath: { type: DataTypes.STRING, allowNull: false, unique: true },
    fileSize: { type: DataTypes.STRING, allowNull: false, defaultValue: 0 },
    isFavourite: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 },
    listenCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
  }, {
    getterMethods: {
      getFormattedDuration: function(){
        var hours = Math.floor(this.duration / 3600);
        var minutes = Math.floor((this.duration - hours * 3600) / 60);
        var seconds = ("00" + (this.duration - hours * 3600 - minutes * 60)).slice(-2);
        return hours > 0
          ? hours + ":" + ("00" + minutes).slice(-2) + ":" + seconds
          : minutes + ":" + seconds;
      }
    },
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