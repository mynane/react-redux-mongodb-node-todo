import React, { Component, PropTypes } from 'react';
import { Form, Icon, Input, Button, Checkbox, message, Pagination, Table } from 'antd';
import { bindActionCreators } from 'redux';
import ArticleApi from '../../api/article';
import ajax from 'pajamas';
import { connect } from 'react-redux';

import Editor from '../common/edit/index';

import actions from '../../actions';
import notDisAction from '../../actions/actions';

import TagsInput from 'react-tagsinput'

import 'react-tagsinput/react-tagsinput.css' // If using WebPack and style-loader.

import './edit.css';
class Login extends Component {
    constructor(props) {
        super(props);
		this.state = {tags: [], subject: '123'};
		this._handleClick = this._handleClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
    }

	handleChange(tags) {
		this.setState({tags});
	}

	_handleClick () {
		/* eslint-disable no-alert */
		alert('这个是自定义按钮')
		/* eslint-enable no-alert */
	}

	handleInputChange (e) {
		this.setState({subject: e.target.value});
	}

	handleSubmit () {
		let innerHtml = document.getElementById('md-preview-warp').innerHTML;
		console.log(this.state.tags);
		let data = {
			title: this.state.subject,
			content: innerHtml,
			tags: this.state.tags.join(','),
			user: '5836c5bc60d06a78648a1e5c'
		}
		ArticleApi.addArticle(data, function(jsondata){
			console.log(jsondata);
		})
	}
    render() {
        return ( 
            <div>
			<div><div>主题:</div><Input onChange={this.handleInputChange} defaultValue = {this.state.subject}/></div>
			<div><div>标签:</div><TagsInput value={this.state.tags} onChange={this.handleChange} /></div>
            <Editor>
                <option title="自定义按钮" onClick={this._handleClick}><i className="fa fa-bomb"></i></option>
            </Editor>
			<Button onClick={this.handleSubmit}>提交</Button>
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