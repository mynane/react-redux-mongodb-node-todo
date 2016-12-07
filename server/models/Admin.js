var base = require('./Base');  
var ObjectId = base.ObjectId;  
var AdminScheme =new base.Schema({  
    phone: {type: Number, unique:true, index: 1},
    email: {type: String, unique:true, index: 1},
    pwd: {type: String},
    sex: {type: Number, default: 0},
    createTime: {type: Date, default: Date.now},
    lateLoginTime: {type: Date, default: Date.now},
    loginTimes: {type: Number, default: 1},
    level: {type: Number, default: 1}
});
AdminScheme.index({"background" : true});
var AdminEntity = base.mongoose.model('AdminEntity', AdminScheme, 'admin');
exports.AdminEntity = AdminEntity;