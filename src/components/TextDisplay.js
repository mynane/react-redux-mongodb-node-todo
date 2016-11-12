import React, {Component, PropTypes} from 'react';

class TextDisplay extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div>
        {this.props.passedDownText}
      </div>
    );
  }
}

export default TextDisplay;
