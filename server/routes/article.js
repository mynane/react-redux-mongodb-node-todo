var fs = require('fs');
var path = require('path');
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var formidable = require('formidable');
var util = require('util');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var UserEntity = require('../models/User').UserEntity;
var PostEntity = require('../models/Post').PostEntity;
var ImageEntity = require('../models/Image').ImageEntity;
var ArticleEntity = require('../models/Article').ArticleEntity;
var CommentEntity = require('../models/Comment').CommentEntity;

var api = require('../middleware/api').api;
var RestResult = require('../middleware/RestResult');
var FormatQuery = require('../middleware/FormatQuery');
var queryConfig = require('../config/queryConfig');
var LoginSession = require('../middleware/LoginSession');
var dbHelper = require('../db/dbHelper');

var captchapng = require('captchapng');

var crypto = require('crypto');
var privateKey = fs.readFileSync(path.join(process.cwd(), 'private.key'));

router.post('/addArticle', function (req, res, next) {
    var restResult = new RestResult();
    var articleData = req.body;
    articleData.tags = articleData.tags.split(',');
    var articleEntity = new ArticleEntity({title: articleData.title, content: articleData.content, tags: articleData.tags});
    articleEntity.save(function(err, doc){
        if(err){
            return;
        }
        res.send(doc);
    });
});

router.post('/addComment', function (req, res, next) {
    var restResult = new RestResult();
    var commentData = req.body;
    var commentEntity = new CommentEntity({content: commentData.content, user: commentData.user, article: commentData.article});
    commentEntity.save(function(err, doc){
        if(err){
            return;
        }
        res.send(doc);
    });
});

router.get('/articleList', function (req, res, next) {
    var restResult = new RestResult();
    var query = req.query;
    ArticleEntity.find(query, function(err,doc){
        if(err) {
            return;
        }
        res.send(doc);
    })
});

module.exports = router;