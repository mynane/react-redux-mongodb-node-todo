import React, {Component, PropTypes} from 'react';
import TextDisplay from './TextDisplay';

class TodoInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.addTodo(this.state.text);
    this.setState({
      text: ''
    });
  }

  handleChange(e) {
    this.setState({
      text: e.target.value
    });
  }

  render() {
    return (
      <div>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              placeholder="Add new todo"
              autoFocus="true"
              value={this.state.text}
              onChange={this.handleChange} />
            <input 
              type="submit"
              value="Add todo" />
          </form>

          <TextDisplay passedDownText={this.state.text} />
      </div>
    );
  }
}

export default TodoInput;
