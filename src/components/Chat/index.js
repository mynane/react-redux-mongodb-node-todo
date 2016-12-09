import React, {Component, PropTypes} from 'react';
import { Form, Icon, Input, Button, Checkbox, message, Pagination  } from 'antd';
import { bindActionCreators } from 'redux';
import ajax from 'pajamas';
import { connect } from 'react-redux';
const FormItem = Form.Item;

import actions from '../../actions';
import notDisAction from '../../actions/actions';

import './chat.css';

const getList = (props, currPage) => {
    var query = props.router.location.search,
        dispatch = props.dispatch;
    currPage = currPage ? currPage : 1;
    query = query ? (query + '&page=' + currPage) : (query + '?page=' + currPage)
    ajax({
        url: '/postList' + query ,
        type: 'get'
    }).then((jsonData)=>{
        if(jsonData.meta.code == 200) {
            dispatch({type:'LIST_TODO', list: jsonData.data.list});
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
};

const getDetail = (id) => {
    ajax({
        url: '/detail?id=' + id ,
        type: 'get'
    }).then((jsonData)=>{
        if(jsonData.meta.code == 200) {
            // dispatch({type:'LIST_TODO', list: jsonData.data.list});
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

class Chat extends Component {
    constructor(props) {
        super(props);
        this.loginOut = this.loginOut.bind(this);
        this.onPaginChange = this.onPaginChange.bind(this);
        // this.onDetail = this.onDetail.bind(this);
    }

    componentWillMount() {
        getList(this.props);
    }

    onPaginChange(num) {
        getList(this.props, num);
    }

    onDetail(id) {
        this.props.router.push('/detail?id='+id);
    }

    loginOut() {
        ajax({
            url: '/loginOut',
            type: 'get'
        }).then((jsonData)=>{
            if(jsonData.meta.code == 200) {
                message.success('提出登录');
                this.props.router.replace('/login');
            }
            else {
                message.error(jsonData.meta.message);
            }
            this.setState({isLoad: false});
        }).catch((err) => {
            this.setState({isLoad: false});
        })
    }

    render() {
        return (
            <div className="web-chat-wrap">
                <div className="chat-wrap">
                    <div className="chat-header"></div>
                    <div className="chat-content"></div>
                    <div className="chat-footer">
                    </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Chat));
