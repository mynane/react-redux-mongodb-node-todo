var base = require('./Base');  
var ObjectId = base.ObjectId;  
var ImageScheme =new base.Schema({
    fileName: String,
    fileSize: {type:String,default:0},
    uploadTime: {type:Date,default:Date.now},
    filePath: String,
    listId: {type:ObjectId, ref: 'PostEntity'},
    fileType: String
});  
var ImageEntity = base.mongoose.model('ImageEntity', ImageScheme, 'images');//指定在数据库中的collection名称为user  
exports.ImageEntity  = ImageEntity;//导出实体