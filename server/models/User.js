var base = require('./Base');
var ObjectId = base.ObjectId;
var UserScheme = new base.Schema({
    phone: {type: Number, unique:true, index: 1},
    email: {type: String, index: 1},
    pwd: {type: String},
    sex: {type: Number, default: 0},
    createTime: {type: Date, default: Date.now},
    lateLoginTime: {type: Date, default: Date.now},
    loginTimes: {type: Number, default: 1},
    level: {type: Number, default: 1}
});


UserScheme.virtual('isAdvanced').get(function () {
  // 积分高于 700 则认为是高级用户
  return this.phone > 700 || false;
});

UserScheme.index({ "background": true });
var UserEntity = base.mongoose.model('UserEntity', UserScheme, 'user');
exports.UserEntity = UserEntity;