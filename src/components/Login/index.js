import React, {Component, PropTypes} from 'react';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const FormItem = Form.Item;

import actions from '../../actions';
import notDisAction from '../../actions/actions';

import './login.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, value) => {
            if (!err) {
                // this.props.actions.submitTodo(value, this.props.dispatch);
                notDisAction.submitTodo.value = value;
                this.props.dispatch(notDisAction.submitTodo);
            }
        });
    }

   shouldComponentUpdate() {
        console.log(this.props.login.show);
        if(this.props.login.show){
            message.error(this.props.login.showText);
        }
        return true;
    }

    render() {
       const { getFieldDecorator } = this.props.form;
        return (
            <div className="web-login-wrap">
                <div className ="web-handle-type">{this.props.handleText}</div>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input addonBefore={<Icon type="user" />} placeholder="Username" />
                    )}
                    </FormItem>
                    <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />
                    )}
                    </FormItem>
                    <div className="web-forget-item">
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox>Remember me</Checkbox>
                    )}
                    <a className="login-form-forgot" href="/find_passwd">Forgot password</a>
                    Or <a href="/register">register now!</a>
                    </div>
                    <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button" loading={this.props.isLoad ? true : false}>
                        Log in
                    </Button>
                    </FormItem>
                </Form>
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
