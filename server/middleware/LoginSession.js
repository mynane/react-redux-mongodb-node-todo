var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');
var privateKey = fs.readFileSync(path.join(process.cwd(), 'private.key'));
var loginSession = function(req, res, next) {
    var cookies = req.cookies;
    jwt.verify(cookies.token, privateKey, function(err, userObject){
        if(!!err || !cookies.token || !cookies.uid || userObject.uid !== cookies.uid){
            res.send({meta:{code: 401, message:'token 失效'}});
            return;
        }
        next();
    });
}
module.exports = loginSession;