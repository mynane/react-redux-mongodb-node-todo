import { Form, Icon, Input, Button, Checkbox, message, Pagination, Upload } from 'antd';
import ajax from 'pajamas';
const Article = {
	addWatch : function(id ,watch , callback) {
		ajax({
            url: '/article/addWatch?id=' + id + '&w=' + watch,
            type: 'get'
        }).then((jsonData) => {
            if (jsonData.meta.code == 200) {
                callback();
            } else {
                message.error(jsonData.meta.message);
            }
        }).catch((err) => {})
	},
    getList: function(query, props,callback) {
        ajax({
            url: 'http://localhost:3000/article/articleList' + query,
            type: 'get'
        }).then((jsonData) => {
            if (jsonData.meta.code == 200) {
                callback && callback(jsonData);
            } else if (jsonData.meta.code == 401) {
                props.router.replace('/login');
            } else {
                message.error(jsonData.meta.message);
            }
        }).catch((err) => {
            console.log(err);
        });
    }
}

module.exports = Article;