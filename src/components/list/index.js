import React, {Component, PropTypes} from 'react';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import { bindActionCreators } from 'redux';
import ajax from 'pajamas';
import { connect } from 'react-redux';
const FormItem = Form.Item;

import actions from '../../actions';
import notDisAction from '../../actions/actions';

import './list.css';

const getList = (query, dispatch) => {
    ajax({
        url: 'http://localhost:3000/postList'+query,
        type: 'get'
    }).then((data)=>{
        if(data.errorCode == 0) {
            dispatch({type:'LIST_TODO', list: data.list});
            message.success('请求成功');
        }
        else {
            message.error(data.errorReason);
        }
    }).catch((err) => {
        console.log(err);
    });
};

class Login extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        getList(this.props.router.location.search, this.props.dispatch);
    }

    render() {
        return (
            <div className="web-login-wrap">
                {
                    this.props.list.map((item, index) => {
                        return (<div>{item['title']}</div>)
                    })
                }
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
