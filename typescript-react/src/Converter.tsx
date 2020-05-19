import React, { useState } from 'react';

interface Temperatures {
  celsius?: number | string;
  fahrenheit?: number | string;
}

// This is probably typed wrong.
export const isNumeric = (n:any) => !isNaN(parseFloat(n)) && isFinite(n as number);

function Converter() {
  const [temperature, setTemperature] = useState<Temperatures>({});

  const setCelsius = (value:string) => {
    if (isNumeric(value)) {
      setTemperature({ celsius: value, fahrenheit: parseFloat(value) * (9 / 5.0) + 32 });
    } else {
      setTemperature({ ...temperature, celsius: value });
    }
  };

  const setFahrenheit = (value:string) => {
    if (isNumeric(value)) {
      setTemperature({ fahrenheit: value, celsius: (parseFloat(value) - 32) * (5 / 9.0) });
    } else {
      setTemperature({ ...temperature, fahrenheit: value });
    }
  };

  return (
    <div>
      <h2>Temperature Converter</h2>

      <div className="row">
        <div className="col">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="Celsius">Celsius</span>
            </div>
            <input type="text" className="form-control"
              value={temperature.celsius || ''}
              onChange={event => setCelsius(event.target.value)}
              aria-label="Celsius" aria-describedby="Celsius" />
          </div>
        </div>

        <div className="col">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="Fahrenheit">Fahrenheit</span>
            </div>
            <input type="text" className="form-control"
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
