import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import TodoInput from '../components/TodoInput';
import TodoList from '../components/TodoList';

class App extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div>
          <TodoInput addTodo={this.props.actions.addTodo} />
          <TodoList todos={this.props.todos} actions={this.props.actions} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);