import React, { Component } from 'react';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { value: 0 };
  }

  render() {
    return (
      <div>
        <h2>Counter</h2>
        <div className="input-group">
          <input className="form-control" type="text" value={this.state.value} />
          <span className="input-group-btn">
            <button
              className="btn btn-default"
              type="button"
              onClick={() => this.setState({ value: this.state.value + 1 })}>
              Increment
            </button>
          </span>
        </div>
      </div>
    );
  }
}

export default Counter;
