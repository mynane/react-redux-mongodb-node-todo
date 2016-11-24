import React, {Component, PropTypes} from 'react';
import { Form, Icon, Input, Button, Checkbox, message, Pagination  } from 'antd';
import { bindActionCreators } from 'redux';
import ajax from 'pajamas';
import { connect } from 'react-redux';
const FormItem = Form.Item;

import actions from '../../actions';
import notDisAction from '../../actions/actions';

import './list.css';

const getList = (props, currPage) => {
    var query = props.router.location.search,
        dispatch = props.dispatch;
    currPage = currPage ? currPage : 1;
    query = query ? (query + '&page=' + currPage) : (query + '?page=' + currPage)
    ajax({
        url: 'http://localhost:3000/post/postList' + query ,
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
        url: 'http://localhost:3000/post/detail?id=' + id ,
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
        this.props.router.push('/detail?id='+id);
    }

    loginOut() {
        ajax({
            url: '/user/loginOut',
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
            <div className="web-list-wrap">
                <div><a href="javascript:void(0);" onClick={this.loginOut}>退出登录</a></div>
                {
                    this.props.list.records.map((item, index) => {
                        return (<div onClick={this.onDetail.bind(this,item._id)} eventId={item.id}><a>{item['title']}</a>&nbsp;|&nbsp;<a>{item['createUser']['mobile']}</a><a></a></div>)
                    })
                }
                <div class="pagin-wrap">
                    <Pagination onChange={this.onPaginChange} showQuickJumper defaultCurrent={1} total={this.props.list.count} />
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
