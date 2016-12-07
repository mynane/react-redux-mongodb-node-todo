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
var CONFIG = require('../config/sysConfig').CONFIG;

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: CONFIG.EMAIL.service,
    auth: {
        user: CONFIG.EMAIL.user,
        pass: CONFIG.EMAIL.pass
    }
});



function sendEmail(toEmail, code){
    var mailOptions = {
        from: CONFIG.EMAIL.user, // sender address
        to: toEmail, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world ✔', // plaintext body
        html: '<b>邀请验证码: ' + code + '</b>' // html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
}

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
    var authCode = req.body.authCode;
    if(!authCode) {
        restResult.meta.code = RestResult.ILLEGAL_ARGUMENT_ERROR_CODE;
        restResult.meta.message = "验证码不能为空";
        res.send(restResult);
        return;
    }
    var authCode = req.body.authCode;
    if(req.session.authCode != authCode) {
        restResult.meta.code = RestResult.CAPTCHA_CODE_ERROR_CODE;
        restResult.meta.message = "验证码错误";
        res.send(restResult);
        return;
    }
    var email = req.body.email;


    //findOne方法,第一个参数数条件,第二个参数是字段投影,第三那个参数是回调函数  
    UserEntity.findOne({ phone: mobile }, '_id', function (err, user) {
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
        var registerUser = new UserEntity({ phone: mobile, pwd: password, email: email});
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

// 验证用户
router.post('/authCode', function (req, res, next) {
    var email = req.body.email;
    var captchaCode = req.body.captchaCode;
    var restResult = new RestResult();
    if(!email) {
        restResult.meta.code = RestResult.ILLEGAL_ARGUMENT_ERROR_CODE;
        restResult.meta.message = "邮箱不能为空";
        res.send(restResult);
        return;
    }
    if(!captchaCode){
        restResult.meta.code = RestResult.ILLEGAL_ARGUMENT_ERROR_CODE;
        restResult.meta.message = "验证码不能为空";
        res.send(restResult);
        return;
    }
    if(captchaCode != req.session.captchaCode){
        restResult.meta.code = RestResult.ILLEGAL_ARGUMENT_ERROR_CODE;
        restResult.meta.message = "验证码错误";
        res.send(restResult);
        return;
    }
    var authCode = parseInt(Math.random()*9000+1000);
    req.session.authCode = authCode;
    sendEmail('2590575337@qq.com', authCode);
    restResult.meta.code = RestResult.NO_ERROR;
    restResult.meta.message = "成功";
    res.send(restResult);
});

//登陆路由  
router.post('/login', function (req, res, next) {
    // var client = req.client;
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
    UserEntity.findOne({ phone: mobile, pwd: password }, { password: 0 }, function (err, user) {
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
        // client.set('token',token);
        res.cookie('token', token, { maxAge: 600000, httpOnly: true, path: '/', secure: false });
        res.cookie('uid', user._id, { maxAge: 600000, httpOnly: true, path: '/', secure: false });
        res.send(restResult);

        //更新最后登陆时间  
        UserEntity.update({ _id: user._id }, { $set: { lateLoginTime: new Date(), loginTimes: ++user.loginTimes } }).exec();

    });

});

router.get('/loginOut', function (req, res, next) {
    res.cookie('token', 0, { maxAge: -1, httpOnly: true, path: '/', secure: false });
    res.send({ meta: {code: 200, message: ""}});
});

module.exports = router;