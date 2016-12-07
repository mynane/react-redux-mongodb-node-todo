var fs = require('fs');
var path = require('path');
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var formidable = require('formidable');
var util = require('util');
var qr_image = require('qr-image');

var gm = require('gm');

var UserEntity = require('../models/User').UserEntity;
var PostEntity = require('../models/Post').PostEntity;
var ImageEntity = require('../models/Image').ImageEntity;
var api = require('../middleware/api').api;
var RestResult = require('../middleware/RestResult');
var FormatQuery = require('../middleware/FormatQuery');
var queryConfig = require('../config/queryConfig');
var LoginSession = require('../middleware/LoginSession');
var dbHelper = require('../db/dbHelper');
var utils = require('../utils/tools');

var captchapng = require('captchapng');

var images = require("images");

var im = require('imagemagick');

var crypto = require('crypto');
var privateKey = fs.readFileSync(path.join(process.cwd(), 'private.key'));

router.get('/captcha.png', function(req, res) {
    var captchaCode = parseInt(Math.random() * 9000 + 1000);
    req.session.captchaCode = captchaCode;
    var p = new captchapng(80, 30, captchaCode); // width,height,numeric captcha 
    p.color(0, 0, 0, 0); // First color: background (red, green, blue, alpha) 
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha) 

    var img = p.getBase64();
    var imgbase64 = new Buffer(img, 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
});

router.get('/download/*', function(req, res, next) {
    var id = req.path.split('/')[2];
    ImageEntity.findOne({ _id: id }, function(err, doc) {
        res.download(doc.filePath, doc.fileName);
    });
});

router.get('/qrcode', function(req, res) {
    var temp_qrcode = qr_image.image('http://www.baidu.com');
    res.type('png');
    temp_qrcode.pipe(res);
});

router.post('/upload', function(req, res, next) {
    var id = req.path.split('/')[2];
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.keepExtensions = true;
    form.uploadDir = './mgtFile/';
    form.parse(req);
    form.on('file', function(name, file) {
        if (!!file) {
            var uploadFile = new ImageEntity({ fileName: file.name, fileType: file.type, fileSize: file.size, filePath: file.path, listId: id });
            uploadFile.save(function(err, row) {
                if (err) {
                    return;
                }
                res.writeHead(200, { 'content-type': 'text/plain' });
                res.write('received upload:\n\n');
                res.end('ok');
            });
        }
    });

    return;
});

module.exports = router;