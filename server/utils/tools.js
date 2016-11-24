var fs = require('fs');
var path = require('path');

var utils = {
    mkdir: function (dirpath, dirname) {
        //判断是否是第一次调用
        if (typeof dirname === "undefined") {
            if (fs.existsSync(dirpath)) {
                return;
            } else {
                this.mkdir(dirpath, path.dirname(dirpath));
            }
        } else {
            //判断第二个参数是否正常，避免调用时传入错误参数
            if (dirname !== path.dirname(dirpath)) {
                this.mkdir(dirpath);
                return;
            }
            if (fs.existsSync(dirname)) {
                fs.mkdirSync(dirpath);
            } else {
                this.mkdir(dirname, path.dirname(dirname));
                fs.mkdirSync(dirpath);
            }
        }
    }
};
module.exports = utils;