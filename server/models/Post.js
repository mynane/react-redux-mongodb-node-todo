var base = require('./Base');  
var ObjectId = base.ObjectId;  
var PostScheme =new base.Schema({
    title: String, //事件title
    createTime: {type:Date,default:Date.now}, //创建时间
    content: String, //事件内容
    updateTime: Date,
    createUser: {type: ObjectId, ref: 'UserEntity'}
});  
var PostEntity = base.mongoose.model('PostEntity', PostScheme, 'post');//指定在数据库中的collection名称为user  
exports.PostEntity  = PostEntity;//导出实体