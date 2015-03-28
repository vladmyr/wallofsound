"use strict";

var CHARSET = "utf8";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.dropAllTables().complete(function(error){
      //AccessToken
      migration.createTable("AccessTokens", {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        token: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
        },
        ClientId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        UserId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        createdAt: {
          type: DataTypes.DATE
        },
        updatedAt: {
          type: DataTypes.DATE
        }
      }, {
        charset: CHARSET
      }).complete(function(){
        //Album
        migration.createTable("Albums", {
          id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          title: {
            type: DataTypes.STRING,
            allowNull: false
          },
          year: {
            type: DataTypes.INTEGER
          },
          tracks: {
            type: DataTypes.INTEGER
          },
          cover: {
            type: DataTypes.STRING
          },
          ArtistId: {
            type: DataTypes.INTEGER
          },
          createdAt: {
            type: DataTypes.DATE
          },
          updatedAt: {
            type: DataTypes.DATE
          }
        }, {
          charset: CHARSET
        }).complete(function(){
          //Artist
          migration.createTable("Artists", {
            id: {
              type: DataTypes.INTEGER,
              allowNull: false,
              primaryKey: true,
              autoIncrement: true
            },
            name: {
              type: DataTypes.STRING,
              allowNull: false,
              unique: true
            },
            createdAt: {
              type: DataTypes.DATE
            },
            updatedAt: {
              type: DataTypes.DATE
            }
          },{
            charset: CHARSET
          }).complete(function(){
            //AudioFileMeta
            migration.createTable("AudioFileMeta", {
              id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
              },
              title: {
                type: DataTypes.STRING,
                allowNull: false
              },
              trackNo: {
                type: DataTypes.INTEGER
              },
              duration: {
                type: DataTypes.INTEGER
              },
              filePath: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
              },
              fileSize: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
              },
              AlbumId: {
                type: DataTypes.INTEGER
              },
              UserId: {
                type: DataTypes.INTEGER
              },
              GenreId: {
                type: DataTypes.INTEGER
              },
              createdAt: {
                type: DataTypes.DATE
              },
              updatedAt: {
                type: DataTypes.DATE
              }
            }, {
              charset: CHARSET
            }).complete(function(){
              //Clients
              migration.createTable("Clients", {
                id: {
                  type: DataTypes.INTEGER,
                  allowNull: false,
                  primaryKey: true,
                  autoIncrement: true
                },
                name: {
                  type: DataTypes.STRING,
                  unique: true,
                  allowNull: false
                },
                clientId: {
                  type: DataTypes.STRING,
                  unique: true,
                  allowNull: false
                },
                clientSecret: {
                  type: DataTypes.STRING,
                  allowNull: false
                },
                createdAt: {
                  type: DataTypes.DATE
                },
                updatedAt: {
                  type: DataTypes.DATE
                }
              }, {
                charset: CHARSET
              }).complete(function(){
                //Genre
                migration.createTable("Genres", {
                  id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
                  },
                  name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true
                  },
                  createdAt: {
                    type: DataTypes.DATE
                  },
                  updatedAt: {
                    type: DataTypes.DATE
                  }
                }, {
                  charset: CHARSET
                }).complete(function(){
                  //RefreshToken
                  migration.createTable("RefreshTokens", {
                    id: {
                      type: DataTypes.INTEGER,
                      allowNull: false,
                      autoIncrement: true,
                      primaryKey: true
                    },
                    token: {
                      type: DataTypes.STRING,
                      allowNull: false,
                      unique: true
                    },
                    ClientId: {
                      type: DataTypes.INTEGER,
                      allowNull: false
                    },
                    UserId: {
                      type: DataTypes.INTEGER,
                      allowNull: false
                    },
                    createdAt: {
                      type: DataTypes.DATE
                    },
                    updatedAt: {
                      type: DataTypes.DATE
                    }
                  }, {
                    charset: CHARSET
                  }).complete(function(){
                    //Users
                    migration.createTable("Users", {
                      id: {
                        type: DataTypes.INTEGER,
                        primaryKey: true,
                        autoIncrement: true,
                        allowNull: false
                      },
                      email: {
                        type: DataTypes.STRING,
                        allowNull: false,
                        unique: true
                      },
                      password: {
                        type: DataTypes.STRING,
                        allowNull: false
                      },
                      isBlocked: {
                        type: DataTypes.BOOLEAN,
                        allowNull: false,
                        defaultValue: false
                      },
                      isLocked: {
                        type: DataTypes.BOOLEAN,
                        allowNull: false,
                        defaultValue: false
                      },
                      role: {
                        type: DataTypes.INTEGER,
                        allowNull: false
                      },
                      createdAt: {
                        type: DataTypes.DATE
                      },
                      updatedAt: {
                        type: DataTypes.DATE
                      }
                    }, {
                      charset: CHARSET
                    }).complete(function(){
                      //UserSettings
                      migration.createTable("UserSettings", {
                        id: {
                          type: DataTypes.INTEGER,
                          allowNull: false,
                          autoIncrement: true,
                          primaryKey: true
                        },
                        photo: {
                          type: DataTypes.STRING
                        },
                        name: {
                          type: DataTypes.STRING
                        },
                        surname: {
                          type: DataTypes.STRING
                        },
                        birth: {
                          type: DataTypes.DATEONLY
                        },
                        UserId: {
                          type: DataTypes.INTEGER,
                          allowNull: false
                        },
                        createdAt: {
                          type: DataTypes.DATE
                        },
                        updatedAt: {
                          type: DataTypes.DATE
                        }
                      }, {
                        charset: CHARSET
                      }).complete(done);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  },

  down: function(migration, DataTypes, done) {
    migration.dropAllTables().complete(done);
  }
};
