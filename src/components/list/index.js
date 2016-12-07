import React, { Component, PropTypes } from 'react';
import { Form, Icon, Input, Button, Checkbox, message, Pagination } from 'antd';
import { bindActionCreators } from 'redux';
import ArticleApi from '../../api/article';
import ajax from 'pajamas';
import { connect } from 'react-redux';
const FormItem = Form.Item;

import ListItem from '../common/listItem/index';

import actions from '../../actions';
import notDisAction from '../../actions/actions';

import './list.css';

const getList = (props, currPage) => {
    var query = props.router.location.search,
        dispatch = props.dispatch;
    ArticleApi.getList(query, props, function(jsonData){
        dispatch({ type: 'LIST_TODO', list: jsonData.data.lists });
        message.success('请求成功');
    });
};

class Login extends Component {
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
        this.props.router.push('/detail?id=' + id);
    }

    loginOut() {
        ajax({
            url: '/user/loginOut',
            type: 'get'
        }).then((jsonData) => {
            if (jsonData.meta.code == 200) {
                message.success('提出登录');
                this.props.router.replace('/login');
            } else {
                message.error(jsonData.meta.message);
            }
            this.setState({ isLoad: false });
        }).catch((err) => {
            this.setState({ isLoad: false });
        })
    }

    render() {
        return ( 
            <div className = "web-list-wrap" >
            <div > < a href = "javascript:void(0);" onClick = { this.loginOut } > 退出登录 < /a></div >
                {
                    this.props.list.map((item, index) => {
                        return (<ListItem listData = {item}/>)
                    })
                }
            < div class = "pagin-wrap" >
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Login));