import React, {Component, PropTypes} from 'react';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import { Link } from 'react-router'
import { bindActionCreators } from 'redux';
import ajax from 'pajamas';
import { connect } from 'react-redux';
const FormItem = Form.Item;

import actions from '../../actions';
import notDisAction from '../../actions/actions';
import cookie from '../../tools/js/cookie'

import './login.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            isLoad: false,
            captcha: '/captcha.png?_t=' + new Date() * 1
        };
        this.refreshCaptcha = this.refreshCaptcha.bind(this);
    }

    refreshCaptcha() {
        this.setState({'captcha': '/captcha.png?v=' + new Date()})
    }

    handleSubmit(e) {
        e.preventDefault();
        let api = 'http://localhost:3000/login';
        let dispatch = this.props.dispatch;
        this.props.form.validateFields((err, value) => {
            console.log(value);
            if (!err) {
                 ajax({
                    url: api,
                    data:{
                        mobile: value.userName,
                        password: value.password,
                        captchaCode: value.captchaCode
                    },
                    type: 'post'
                }).then((jsonData)=>{
                    if(jsonData.meta.code == 200) {
                        message.success('登录成功');
                        this.props.router.replace('/list?userId=' + jsonData.data._id);
                    }
                    else {
                        message.error(jsonData.meta.message);
                    }
                    this.setState({isLoad: false});
                }).catch((err) => {
                    console.log(err);
                    this.setState({isLoad: false});
                })
            }
        });
    }

    render() {
       const { getFieldDecorator } = this.props.form;
        return (
            <div className="web-login-wrap">
                <div className="login-wrap">
                    <div className ="web-handle-type">登录</div>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: '请输入用户名!' }],
                        })(
                            <Input addonBefore={<Icon type="user" />} placeholder="Username" />
                        )}
                        </FormItem>
                        <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码!' }],
                        })(
                            <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />
                        )}
                        </FormItem>
                        <FormItem>
                            <div>
                            {getFieldDecorator('captchaCode', {
                                // rules: [{ required: true, message: '请输入验证码!' }],
                            })(
                                <Input type="text" placeholder="验证码" className="captcha-code login-left"/>
                            )}
                            <div className="login-left login-code-content"><img src={this.state.captcha} onClick={this.refreshCaptcha} /></div>
                            <Button onClick={this.refreshCaptcha} className="login-left login-refresh-content">刷新</Button></div>
                        </FormItem>
                        <div className="web-forget-item">
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>Remember me</Checkbox>
                        )}
                        <a className="login-form-forgot"><Link to="/find_passwd">Forgot password</Link></a>
                        Or <a><Link to="/register">register now!</Link></a>
                        </div>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button" loading={this.state.isLoad ? true : false}>
                            Log in
                        </Button>
                        </FormItem>
                    </Form>
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
