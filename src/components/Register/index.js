import React, {Component, PropTypes} from 'react';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import { bindActionCreators } from 'redux';
import ajax from 'pajamas';
import { connect } from 'react-redux';
const FormItem = Form.Item;

import actions from '../../actions';
import notDisAction from '../../actions/actions';

import './register.css';

class Register extends Component {
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
        let api = 'http://localhost:3000/register';
        let dispatch = this.props.dispatch;
        this.props.form.validateFields((err, value) => {
            if (!err) {
                 ajax({
                    url: api,
                    data:{
                        mobile: value.userName,
                        password: value.passwordOne,
                        passwordTwo: value.passwordTwo,
                        captchaCode: value.captchaCode
                    },
                    type: 'post'
                }).then((jsonData)=>{
                    if(jsonData.meta.code == 200) {
                        message.success('注册成功');
                        this.props.router.replace('/list')
                    }
                    else {
                        message.error(jsonData.meta.message);
                    }
                }).catch((err) => {
                });
            }
        });
    }

    render() {
       const { getFieldDecorator } = this.props.form;
        return (
            <div className="web-login-wrap">
                <div className="login-wrap">
                    <div className ="web-handle-type">注册</div>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input addonBefore={<Icon type="phone" />} placeholder="Username" />
                        )}
                        </FormItem>
                        <FormItem>
                        {getFieldDecorator('passwordOne', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />
                        )}
                        </FormItem>
                        <FormItem>
                        {getFieldDecorator('passwordTwo', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input addonBefore={<Icon type="lock" />} type="password" placeholder="repeat Password" />
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
                        <a className="login-form-forgot" href="/find_passwd">Forgot password</a>
                        Or <a href="#/login">login now!</a>
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Register));
