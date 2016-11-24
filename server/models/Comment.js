var base = require('./Base');  
var ObjectId = base.ObjectId;  
var CommentScheme =new base.Schema({
    content: String,
    createTime: {type: Date, default: Date.now},
    updateTime: {type: Date},
    user: {type: ObjectId, ref: 'UserEntity'},
    article: {type: ObjectId, ref: 'ArticleEntity'}
});
CommentScheme.index({article:1},{"background" : true});
var CommentEntity = base.mongoose.model('CommentEntity', CommentScheme, 'comment');
exports.CommentEntity = CommentEntity;