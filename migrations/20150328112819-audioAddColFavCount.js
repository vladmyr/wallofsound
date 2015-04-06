"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn("AudioFileMeta", "isFavourite", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }).complete(function(){
      migration.addColumn("AudioFileMeta", "listenCount", {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }).complete(done);
    });
  },

  down: function(migration, DataTypes, done) {
    migration.removeColumn("AudioFileMeta", "isFavourite").complete(function(){
      migration.removeColumn("AudioFileMeta", "listenCount").complete(done);
    });
  }
};
