import React, { Component, PropTypes } from 'react';
import { Form, Icon, Input, Button, Checkbox, message, Pagination, Table } from 'antd';
import { bindActionCreators } from 'redux';
import ArticleApi from '../../api/article';
import ajax from 'pajamas';
import { connect } from 'react-redux';
const FormItem = Form.Item;

import ListItem from '../common/listItem/index';
import Header from '../common/header/index';

import actions from '../../actions';
import notDisAction from '../../actions/actions';

import './list.scss';

const getList = (props, currPage, cb) => {
    let query = props.router.location.search,
        dispatch = props.dispatch;
        query = query ? query : {};
    query.currPage = currPage;
    ArticleApi.getList(query, props, cb);
};

class Login extends Component {
    constructor(props) {
        super(props);
        this.loginOut = this.loginOut.bind(this);
        this.onPaginChange = this.onPaginChange.bind(this);
        this.addArticle = this.addArticle.bind(this);
        this.state = {
            count: 0,
            pageCount: 0,
            records: [],
        }
        // this.onDetail = this.onDetail.bind(this);
    }

    componentWillMount() {
        getList(this.props, 1, (list) => {
            console.log(list);
            this.setState({count: list.count, pageCount: list.pageCount, records: list.records});
        });
    }

    onPaginChange(num) {
        getList(this.props, num, (list) => {
            console.log(list);
            this.setState({count: list.count, pageCount: list.pageCount, records: list.records});
        });
    }

    onDetail(id) {
        this.props.router.push('/detail?id=' + id);
    }

    addArticle() {
        this.props.router.push('/edit?id=' + '5836c5bc60d06a78648a1e5c');
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
        // <!-- < a href = "javascript:void(0);" onClick = { this.loginOut } > 退出登录 < /a> | < a href = "javascript:void(0);" onClick = { this.addArticle } > 添加文件 < /a> -->
        console.log(this.props);
        return ( 
            <div className = "web-content-wrap" >
            <Header/>
            <div className="web-list-wrap">
                {
                    this.state.records.map((item, index) => {
                        return (<ListItem router = {this.props.router} listData = {item}/>)
                    })
                }
            </div >
            < div className = "pagin-wrap" >
                <Pagination showQuickJumper pageSize={20} defaultCurrent={1} total={this.state.count} onChange={this.onPaginChange} />
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