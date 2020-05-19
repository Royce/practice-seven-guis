import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Counter</h2>
      <div class="input-group mb-3">
        <input
          value={count}
          type="text" class="form-control" aria-label="Count" aria-describedby="button-count" />
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            onClick={() => setCount(count + 1)}
            type="button" id="button-count">Increment</button>
        </div>
      </div>
    </div>
  );
}

export default Counter;
