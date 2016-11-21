var fs = require('fs');
var path = require('path');
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var formidable = require('formidable');
var util = require('util');

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

//注册路由  
router.post('/register', function (req, res, next) {
    var restResult = new RestResult();
    var mobile = req.body.mobile;
    if (!/1\d{10}/.test(mobile)) { //手机号码格式校验  
        restResult.meta.code = RestResult.ILLEGAL_ARGUMENT_ERROR_CODE;
        restResult.meta.message = "请填写真确的手机格式";
        res.send(restResult);
        return;
    }
    var password = req.body.password;
    if (!password || password.length < 6) { //密码长度校验  
        restResult.meta.code = RestResult.ILLEGAL_ARGUMENT_ERROR_CODE;
        restResult.meta.message = "密码长度不能少于6位";
        res.send(restResult);
        return;
    }

    var passwordTwo = req.body.passwordTwo;
    if (!passwordTwo) {
        restResult.meta.code = RestResult.ILLEGAL_ARGUMENT_ERROR_CODE;
        restResult.meta.message = "重复密码不能为空";
        res.send(restResult);
        return;
    }

    if (password !== passwordTwo) {
        restResult.meta.code = RestResult.ILLEGAL_ARGUMENT_ERROR_CODE;
        restResult.meta.message = "两次密码不同";
        res.send(restResult);
        return;
    }
    var captchaCode = req.body.captchaCode;
    if(!captchaCode) {
        restResult.meta.code = RestResult.ILLEGAL_ARGUMENT_ERROR_CODE;
        restResult.meta.message = "验证码不能为空";
        res.send(restResult);
        return;
    }

    if(req.session.captchaCode != captchaCode) {
        restResult.meta.code = RestResult.CAPTCHA_CODE_ERROR_CODE;
        restResult.meta.message = "验证码错误";
        res.send(restResult);
        return;
    }

    //findOne方法,第一个参数数条件,第二个参数是字段投影,第三那个参数是回调函数  
    UserEntity.findOne({ mobile: mobile }, '_id', function (err, user) {
        if (err) { //查询异常  
            restResult.meta.code = RestResult.SERVER_EXCEPTION_ERROR_CODE;
            restResult.meta.message = "服务器异常";
            res.send(restResult);
            return;
        }

        if (user) { //手机号已注册  
            restResult.meta.code = RestResult.BUSINESS_ERROR_CODE;
            restResult.meta.message = "手机号已注册";
            res.send(restResult);
            return;
        }
        password = crypto.createHash('md5').update(password).digest('hex');
        var registerUser = new UserEntity({ mobile: mobile, password: password });
        //调用实体的实例的保存方法  
        registerUser.save(function (err, row) {
            if (err) { //服务器保存异常  
                restResult.meta.code = RestResult.SERVER_EXCEPTION_ERROR_CODE;
                restResult.meta.message = "服务器异常";
                res.send(restResult);
                return;
            }
            var token = jwt.sign({ uid: row._id }, privateKey, { expiresIn: '1h' });
            res.cookie('token', token, { maxAge: 600000, httpOnly: true, path: '/', secure: false });
            res.cookie('uid', row._id, { maxAge: 600000, httpOnly: true, path: '/', secure: false });
            res.send(restResult); //返回成功结果  

        });

    });

});

//登陆路由  
router.post('/login', function (req, res, next) {
    var restResult = new RestResult();
    var mobile = req.body.mobile;
    if (!/1\d{10}/.test(mobile)) { //手机号码格式校验  
        restResult.meta.code = RestResult.ILLEGAL_ARGUMENT_ERROR_CODE;
        restResult.meta.message = "请填写真确的手机格式";
        res.send(restResult);
        return;
    }
    var password = req.body.password;
    if (!password) {
        restResult.meta.code = RestResult.ILLEGAL_ARGUMENT_ERROR_CODE;
        restResult.meta.message = "密码不能为空";
        res.send(restResult);
        return;
    }

    var captchaCode = req.body.captchaCode;
    if(!captchaCode) {
        restResult.meta.code = RestResult.ILLEGAL_ARGUMENT_ERROR_CODE;
        restResult.meta.message = "验证码不能为空";
        res.send(restResult);
        return;
    }

    if(req.session.captchaCode != captchaCode) {
        restResult.meta.code = RestResult.CAPTCHA_CODE_ERROR_CODE;
        restResult.meta.message = "验证码错误";
        res.send(restResult);
        return;
    }

    password = crypto.createHash('md5').update(password).digest('hex');
    UserEntity.findOne({ mobile: mobile, password: password }, { password: 0 }, function (err, user) {
        if (err) {
            restResult.meta.code = RestResult.SERVER_EXCEPTION_ERROR_CODE;
            restResult.meta.message = "服务器异常";
            res.send(restResult);
            return;
        }

        if (!user) {
            restResult.meta.code = RestResult.BUSINESS_ERROR_CODE;
            restResult.meta.message = "用户名或密码错误";
            res.send(restResult);
            return;
        }

        restResult.data = user;
        var token = jwt.sign({ uid: user._id }, privateKey, { expiresIn: '1h' });
        res.cookie('token', token, { maxAge: 600000, httpOnly: true, path: '/', secure: false });
        res.cookie('uid', user._id, { maxAge: 600000, httpOnly: true, path: '/', secure: false });
        res.send(restResult);

        //更新最后登陆时间  
        UserEntity.update({ _id: user._id }, { $set: { lastLoginTime: new Date() } }).exec();

    });

});

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

router.get('/loginOut', function (req, res, next) {
    res.cookie('token', 0, { maxAge: -1, httpOnly: true, path: '/', secure: false });
    res.send({ meta: {code: 200, message: ""}});
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

router.get('/captcha.png', function (req, res) {
    var captchaCode = parseInt(Math.random()*9000+1000);
    req.session.captchaCode = captchaCode;
    var p = new captchapng(80,30,captchaCode); // width,height,numeric captcha 
    p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha) 
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha) 

    var img = p.getBase64();
    var imgbase64 = new Buffer(img,'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
});

router.post('/upload', function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.keepExtensions = true;
    form.uploadDir = './public/';
    form.parse(req);
    form.on('file', function(name, file) {
        if(!!file) {
            var uploadFile = new ImageEntity({ fileName: file.name, fileType: file.type, fileSize: file.size, filePath: file.path, listId:'582aa1a4b6687e6344e82b48' });
            uploadFile.save(function(err, row){
                if(err){
                    return;
                }
                res.writeHead(200, {'content-type': 'text/plain'});
                res.write('received upload:\n\n');
                res.end('ok');
            });
        }
    });

    return;
});

router.get('/download/*',function(req,res,next){
    console.log(req.path.split('/')[2])
    var id = req.path.split('/')[2];
    ImageEntity.findOne({_id: id}, function(err, doc) {
        res.download(doc.filePath, doc.fileName);
    });
    // res.send(req);
    // console.log(123123);
    //..db get file realpath
    // res.download(realpath,filename);
});

module.exports = router;