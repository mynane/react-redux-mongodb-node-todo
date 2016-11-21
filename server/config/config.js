var mongoose = require('mongoose');//引入mongoose库  
mongoose.connect('mongodb://localhost:27017/NodeJs');//mongodb连接地址,demo为数据库名称,默认mongodb连接不需要密码  
var config = {
    session_opts: {
        sessionsecret: 'my session',
        db: 'mongodb://localhost:27017/NodeJs'
    }
}
exports.mongoose = mongoose;//导出mongoose对象
exports.config = config;