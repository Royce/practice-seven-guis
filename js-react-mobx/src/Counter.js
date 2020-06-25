import React from 'react';
import {} from 'mobx';
import { useLocalStore, useObserver } from 'mobx-react';

const Counter = function () {
  const local = useLocalStore(() => ({
    count: 0,
    increment() {
      local.count++;
    },
  }));

  return useObserver(() => (
    <div>
      <h2>Counter</h2>
      <div className="input-group">
        <input className="form-control" type="text" value={local.count} />
        <span className="input-group-btn">
          <button
            className="btn btn-default"
            type="button"
            onClick={local.increment}
          >
            Increment
          </button>
        </span>
      </div>
    </div>
  ));
};

export default Counter;
