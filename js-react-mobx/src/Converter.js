import React from 'react';
import { useObserver, useLocalStore } from 'mobx-react';

const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);

const TempInput = function ({ id, value, onChange }) {
  return (
    <input
      className="form-control"
      id={id}
      type="text"
      value={value || ''}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};

const Converter = function () {
  const temperature = useLocalStore(() => ({
    celsius: undefined,
    fahrenheit: undefined,
    setCelsius(value) {
      temperature.celsius = value;
      if (isNumeric(value)) {
        temperature.fahrenheit = value * (9 / 5.0) + 32;
      }
    },
    setFahrenheit(value) {
      temperature.fahrenheit = value;
      if (isNumeric(value)) {
        temperature.celsius = (value - 32) * (5 / 9.0);
      }
    },
  }));

  return useObserver(() => (
    <div>
      <h2>Temperature Converter</h2>

      <div className="form-horizontal">
        <div className="form-group">
          <label htmlFor="celsius" className="control-label col-xs-2">
            Celsius
          </label>
          <div className="col-xs-4">
            <TempInput
              id="celsius"
              value={temperature.celsius}
              onChange={temperature.setCelsius}
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
              value={temperature.fahrenheit || ''}
              onChange={(event) =>
                temperature.setFahrenheit(event.target.value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  ));
};

export default Converter;
