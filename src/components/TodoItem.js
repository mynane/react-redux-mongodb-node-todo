import React, {Component} from 'react';

class TodoItem extends Component {
  constructor(props) {
    super(props);
    this.renderTextStyle = this.renderTextStyle.bind(this);
    this.handleCompleted = this.handleCompleted.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleCompleted() {
    this.props.completeTodo(this.props.todo.id);
  }

  handleDelete() {
    this.props.deleteTodo(this.props.todo.id);
  }

  handleChange() {
    this.props.changeTodo(this.props.todo.id);
  }

  renderTextStyle() {
    return {
      color: this.props.todo.completed ? 'lightgrey' : 'black',
      textDecoration: this.props.todo.completed ? 'line-through' : 'none'
    };
  }
  render() {
    let textStyle = this.renderTextStyle();
    return (
      <ul>
        <li>
          <div style={textStyle}>
            {this.props.todo.text}
          </div>
          <button onClick={this.handleCompleted}>toggle completed</button>
          <button onClick={this.handleDelete}>delete</button>
          <button onClick={this.handleChange}>change</button>
        </li>
      </ul>
    );
  }
}

export default TodoItem;