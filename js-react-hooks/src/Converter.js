import React, { useState } from 'react';

const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);

function Converter() {
  const [temperature, setTemperature] = useState({});

  const setCelsius = value => {
    if (isNumeric(value)) {
      setTemperature({ celsius: value, fahrenheit: value * (9 / 5.0) + 32 });
    } else {
      setTemperature({ ...temperature, celsius: value });
    }
  };

  const setFahrenheit = value => {
    if (isNumeric(value)) {
      setTemperature({ fahrenheit: value, celsius: (value - 32) * (5 / 9.0) });
    } else {
      setTemperature({ ...temperature, fahrenheit: value });
    }
  };

  return (
    <div>
      <h2>Temperature Converter</h2>

      <div class="row">
        <div class="col">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="Celsius">Celsius</span>
            </div>
            <input type="text" class="form-control"
              value={temperature.celsius || ''}
              onChange={event => setCelsius(event.target.value)}
              aria-label="Celsius" aria-describedby="Celsius" />
          </div>
        </div>

        <div class="col">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="Fahrenheit">Fahrenheit</span>
            </div>
            <input type="text" class="form-control"
              value={temperature.fahrenheit || ''}
              onChange={event => setFahrenheit(event.target.value)}
              aria-label="Fahrenheit" aria-describedby="Fahrenheit" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Converter;
