import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import App from '../src/index';
import Hello from '../src/components/hello/index';
import Login from '../src/components/Login/index';
import Register from '../src/components/Register/index';
import List from '../src/components/list/index';
import Detail from '../src/components/Detail/index';
import Chat from '../src/components/Chat/index';
import Edit from '../src/components/editor/index';
import 'antd/dist/antd.css';

var initialState = {
  handleText: '登录',
  login: {
    show: false,
    showText: ''
  },
  todos: [{
    id: 0,
    completed: false,
    text: 'Learn how to use react and redux'
  }],
  files: [],
  list:[],
  detail:{},
  menuList:[{
    id: 0,
    "name": "选项1",
    "link": "/",
    "children":[{
      id:0-1,
      "name":"选项0-1"
    },{
      id:0-2,
      "name":"选项0-2"
    }]
  },{
    id: 1,
    "name": "选项2",
    "link": "/index",
    "children":[{
      id:1-1,
      "name":"选项1-1"
    },{
      id:1-2,
      "name":"选项1-2"
    }]
  }]
}

var store =  require('../src/store')(initialState);
render(
  <Provider store={store}>
      <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Login}/>
        <Route path="/index" component={List} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/list" component={List} />
        <Route path="/detail" component={Detail} />
        <Route path="/chat" component={Chat} />
        <Route path="/edit" component={Edit} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
