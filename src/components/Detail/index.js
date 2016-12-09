import React, {Component, PropTypes} from 'react';
import { Form, Icon, Input, Button, Checkbox, message, Pagination, Upload } from 'antd';
import { bindActionCreators } from 'redux';
import ajax from 'pajamas';
import { connect } from 'react-redux';
const FormItem = Form.Item;

import actions from '../../actions';
import notDisAction from '../../actions/actions';

import './detail.css';
import '../common/common.css';

let uploadUrl = '/common/upload';
const props = {
  name: 'file',
  action: uploadUrl,
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const getDetail = (props) => {
    console.log(props);
    var id = props.location.query.id;
    var dispatch = props.dispatch;
    ajax({
        url: '/article/articleDetail?id=' + id ,
        type: 'get'
    }).then((jsonData)=>{
        if(jsonData.meta.code == 200) {
            dispatch({type:'LIST_DETAIL_TODO', data: jsonData.data});
            message.success('请求成功');
        }
        else if (jsonData.meta.code == 401) {
            props.router.replace('/login');
        }
        else {
            message.error(jsonData.meta.message);
        }
    }).catch((err) => {
        console.log(err);
    });
}

class Login extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        getDetail(this.props);
    }

    render() {
        return (
            <div className="web-detail-wrap">
                <div className="article-title">{this.props.detail.title}</div>
                <div className="markdown" dangerouslySetInnerHTML={{ __html: this.props.detail.content }}></div>
                <img src='/common/qrcode' />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    dispatch: dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Login));
