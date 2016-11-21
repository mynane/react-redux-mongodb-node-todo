var UserEntity = require('../models/User').UserEntity;
var PostEntity = require('../models/Post').PostEntity;

var api = {
    getUser: function (id) {
        UserEntity.findOne({_id: id}, function(err, user){
            if(err){
                return null;
            }
            return user;
        });
    }
};

exports.api = api;