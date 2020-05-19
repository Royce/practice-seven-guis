import React, { Component } from 'react';

const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);
const convertTo = {
  celsius: f => (f - 32) * (5 / 9.0),
  fahrenheit: c => c * (9 / 5.0) + 32,
};
const other = {
  celsius: 'fahrenheit',
  fahrenheit: 'celsius',
};

class Converter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  set = (type, value) => {
    if (isNumeric(value)) {
      this.setState({ [type]: value, [other[type]]: convertTo[other[type]](value) });
    } else {
      this.setState({ [type]: value });
    }
  };

  render() {
    return (
      <div>
        <h2>Temperature Converter</h2>
        <div className="row">
          <div className="three columns">
            <label htmlFor="celsius">Celsius</label>
            <input
              className="u-full-width"
              id="celsius"
              type="text"
              value={this.state.celsius || ''}
              onChange={event => this.set('celsius', event.target.value)}
            />
          </div>
          <div className="two columns">
            {'<->'}
          </div>
          <div className="three columns">
            <label htmlFor="fahrenheit">Fahrenheit</label>
            <input
              className="u-full-width"
              id="fahrenheit"
              type="text"
              value={this.state.fahrenheit || ''}
              onChange={event => this.set('fahrenheit', event.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Converter;
