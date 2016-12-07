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

router.post('/addArticle', function(req, res, next) {
    var restResult = new RestResult();
    var articleData = req.body;
    articleData.tags = articleData.tags.split(',');
    var articleEntity = new ArticleEntity({ title: articleData.title, content: articleData.content, tags: articleData.tags, user: articleData.user });
    articleEntity.save(function(err, doc) {
        if (err) {
            return;
        }
        res.send(doc);
    });
});

router.post('/addComment', function(req, res, next) {
    var restResult = new RestResult();
    var commentData = req.body;
    var commentEntity = new CommentEntity({ content: commentData.content, user: commentData.user, article: commentData.article });
    commentEntity.save(function(err, doc) {
        if (err) {
            return;
        }
        dbHelper.commentNumAdd(ArticleEntity,  commentData.article);
        res.send(doc);
    });
});

router.get('/articleList', function(req, res, next) {
    var restResult = new RestResult();
    var query = req.query;
    ArticleEntity.find({ user: query.userId }).populate({ path: 'user', model: 'UserEntity' }).exec(function(err, docs) {
        if (err) {
            return;
        }
        restResult.data.lists = docs;
        res.send(restResult); //返回成功结果
    });
});

router.get('/articleDetail', function(req, res, next) {
    var restResult = new RestResult();
    var query = req.query;
    var searchId = query.id;
    dbHelper.articleDetail(ArticleEntity, { path: 'user', model: 'UserEntity' }, { _id: searchId },
        function(err, data) {
            if (err) { //服务器保存异常  
                restResult.meta.code = RestResult.SERVER_EXCEPTION_ERROR_CODE;
                restResult.meta.message = "服务器异常";
                res.send(restResult);
                return;
            } else {
                restResult.meta.code = 200;
                restResult.data = data;
                res.send(restResult);
            }
        });
});

router.get('/addWatch', function(req, res, next) {
    var restResult = new RestResult();
    var query = req.query;
    var searchId = query.id;
    var watch = query.w;
    ArticleEntity.update({ _id: searchId }, { $set: { watch: watch} }).exec(function(err, isok) {
        if (err) { //服务器保存异常  
            restResult.meta.code = RestResult.SERVER_EXCEPTION_ERROR_CODE;
            restResult.meta.message = "服务器异常";
            res.send(restResult);
            return;
        } else {
            restResult.meta.code = 200;
            restResult.data = isok;
            res.send(restResult);
        }
    });
});

module.exports = router;