var base = require('./Base');  
var ObjectId = base.ObjectId;  
var ArticleScheme =new base.Schema({  
    title: String,
    content: String,
    watch: {type: Number, default: 0},
    commentNumber: {type: Number, default: 0},
    createTime: {type: Date, default: Date.now},
    updateTime: {type: Date},
    tags: [String],
    user: {type: ObjectId, ref: 'UserEntity'}
});
ArticleScheme.index({title:1},{"background" : true});
var ArticleEntity = base.mongoose.model('ArticleEntity', ArticleScheme, 'article');
exports.ArticleEntity = ArticleEntity;