import React, {Component, PropTypes} from 'react';
import { DatePicker } from 'antd';
import TodoItem from './TodoItem';

class TodoList extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div>
          <DatePicker/>
          {
          this.props.todos.map(function (todo) {
            return (
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                deleteTodo={this.props.actions.deleteTodo}
                completeTodo={this.props.actions.completeTodo}
                changeTodo={this.props.actions.changeTodo} />
            )
          }.bind(this))
        }

      </div>
    );
  }
}

export default TodoList;