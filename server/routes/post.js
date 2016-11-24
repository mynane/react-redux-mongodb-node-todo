var fs = require('fs');
var path = require('path');
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var formidable = require('formidable');
var util = require('util');
var qr_image = require('qr-image');  

var UserEntity = require('../models/User').UserEntity;
var PostEntity = require('../models/Post').PostEntity;
var ImageEntity = require('../models/Image').ImageEntity;
var api = require('../middleware/api').api;
var RestResult = require('../middleware/RestResult');
var FormatQuery = require('../middleware/FormatQuery');
var queryConfig = require('../config/queryConfig');
var LoginSession = require('../middleware/LoginSession');
var dbHelper = require('../db/dbHelper');

var captchapng = require('captchapng');

var crypto = require('crypto');
var privateKey = fs.readFileSync(path.join(process.cwd(), 'private.key'));

router.post('/addPost', LoginSession, function (req, res, next) {
    var restResult = new RestResult();
    var title = req.body.title;
    var createUser = req.body.userId;
    var content = req.body.content;
    var addPost = new PostEntity({ title: title, createUser: createUser, content: content });
    //调用实体的实例的保存方法  
    addPost.save(function (err, row) {
        if (err) { //服务器保存异常  
            restResult.meta.code = RestResult.SERVER_EXCEPTION_ERROR_CODE;
            restResult.meta.message = "服务器异常";
            res.send(restResult);
            return;
        }

        res.send(restResult); //返回成功结果  

    });
});

router.get('/postList', LoginSession, function (req, res, next) {
    var queryObject = FormatQuery(req.query, queryConfig.postList);
    var restResult = new RestResult();
    var page = req.query.page || 1;
    dbHelper.pageQuery(page, 10, PostEntity, { path: 'createUser', model: 'UserEntity' }, queryObject, {
        created_time: 'desc'
    }, function (error, $page) {
        if (error) {
            next(error);
        } else {
            var list = {
                records: $page.results,
                pageCount: $page.pageCount,
                count: $page.count
            };
            restResult.data.list = list;
            res.send(restResult); //返回成功结果
        }
    });
}, function (err) {
    if (err) { //服务器保存异常  
        restResult.meta.code = RestResult.SERVER_EXCEPTION_ERROR_CODE;
        restResult.meta.message = "服务器异常";
        res.send(restResult);
        return;
    }
});

router.get('/detail', function (req, res, next) {
    var restResult = new RestResult();
    var searchId = req.query.id;
    dbHelper.detailQuery(PostEntity, {path: 'createUser', model: 'UserEntity'}, {_id: searchId},{
        uploadTime: 'desc'
    } , function(err, data){
        if (err) { //服务器保存异常  
            restResult.meta.code = RestResult.SERVER_EXCEPTION_ERROR_CODE;
            restResult.meta.message = "服务器异常";
            res.send(restResult);
            return;
        }
        else {
            restResult.meta.code = 200;
            restResult.data = data;
            res.send(restResult);
        }
    });
});

module.exports = router;