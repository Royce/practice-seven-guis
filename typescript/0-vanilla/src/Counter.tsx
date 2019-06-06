import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Counter</h2>
      <div className="input-group mb-3">
        <input
          value={count}
          readOnly={true}
          type="text" className="form-control" aria-label="Count" aria-describedby="button-count" />
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setCount(count + 1)}
            type="button" id="button-count">Increment</button>
        </div>
      </div>
    </div>
  );
}

export default Counter;
