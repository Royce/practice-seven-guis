import React, { Component } from 'react';

const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);

class Converter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  setCelsius = value => {
    if (isNumeric(value)) {
      this.setState({ celsius: value, fahrenheit: value * (9 / 5.0) + 32 });
    } else {
      this.setState({ celsius: value });
    }
  };

  setFahrenheit = value => {
    if (isNumeric(value)) {
      this.setState({ fahrenheit: value, celsius: (value - 32) * (5 / 9.0) });
    } else {
      this.setState({ fahrenheit: value });
    }
  };

  render() {
    return (
      <div>
        <h2>Temperature Converter</h2>

        <div className="form-horizontal">
          <div className="form-group">
            <label htmlFor="celsius" className="control-label col-xs-2">
              Celsius
            </label>
            <div className="col-xs-4">
              <input
                className="form-control"
                id="celsius"
                type="text"
                value={this.state.celsius || ''}
                onChange={event => this.setCelsius(event.target.value)}
              />
            </div>
            <label htmlFor="fahrenheit" className="control-label col-xs-2">
              Fahrenheit
            </label>
            <div className="col-xs-4">
              <input
                className="form-control"
                id="fahrenheit"
                type="text"
                value={this.state.fahrenheit || ''}
                onChange={event => this.setFahrenheit(event.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Converter;
