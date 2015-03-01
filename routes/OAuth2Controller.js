var server = OAuth2orize.createServer();
server.serializeClient(function(client, callback){
    return callback(null, client.getId());
});
server.deserializeClient(function(id, callback){
    ClientRepository.findOneById(id, function(error, clientSchema){
        if(error){
            return callback(error);
        }else{
            return callback(ClientSchema.methods.toClient(clientSchema));
        }
    });
});
server.grant(OAuth2orize.grant.code(function(client, redirectUri, user, ares, callback){
    var code = new OAuth2Code({
        value: uid(16),
        clientId: client.getId(),
        redirectUri: redirectUri,
        userId: user.getId()
    });
    OAuth2CodeRepository.save(code, function(error, codeValue){
        if(error){
            return callback(error);
        }else{
            return callback(null, codeValue);
        }
    });
}));
server.exchange(OAuth2orize.exchange.code(function(client, code, redirectUri, callback){
    OAuth2CodeRepository.findOneByValue(code, function(error, codeSchema){
        if(error){
            callback(error);
        }else if(!codeSchema){
            callback(null, false);
        }else if(client.getId().toString() !== codeSchema.clientId){
            callback(null, false);
        }else if(redirectUri !== codeSchema.redirectUri){
            callback(null, false);
        }else{
            OAuth2CodeRepository.remove(codeSchema._id, function(error){
                if(error){
                    callback(error);
                }else{
                    var token = new AccessToken();
                    token.setValue(uid(256));
                    token.setClientId(codeSchema.clientId);
                    token.setUserId(codeSchema.userId);

                    AccessTokenRepository.save(token, function(error){
                        if(error){
                            callback(error);
                        }else{
                            callback(null, token);
                        }
                    })
                }
            });
        }
    })
}));
exports.authorization = [
    server.authorization(function(clientId, redirectUri, callback){
        ClientRepository.findOneById(clientId, function(error, clientSchema){
            if(error){
                return callback(error);
            }else if(!clientSchema){
                return callback(null, false);
            }else{
                return callback(null, ClientSchema.methods.toClient(clientSchema), redirectUri);
            }
        });
    }),
    function(req, res){
        res.render("auth/oauth", {
            transactionId: req.oauth2.transactionId,
            user: req.user,
            client: req.oauth2.client
        });
    }
];
exports.decision = [
    server.decision()
];
exports.token = [
    server.token(),
    server.errorHandler()
];

function uid(length){
    var buffer = [];
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charLength = chars.length;

    for(var i = 0; i < length; i++){
        buffer.push(chars[getRandomInt(0,charLength - 1)]);
    }

    return buffer.join("");
}

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}