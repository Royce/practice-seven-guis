import React, { useState, useRef, useEffect } from 'react';

const INTERVAL = 50;

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function useStopWatch(duration) {
  const [timer, setTimer] = useState({start: new Date().getTime(), elapsed:0});

  function tick(ongoing) {
    console.log(`tick:${ongoing}`);
    if (!timer.start) return;

    var now = new Date().getTime();
    var newElapsed = now - timer.start;
    var isOverTime = newElapsed >= duration;
    if (isOverTime) newElapsed = Math.max(timer.elapsed, duration);

    if (!ongoing || isOverTime) {
      setTimer({start: null, elapsed:newElapsed});
    } else {
      setTimer({start:timer.start, elapsed:newElapsed});
    }
  };

  function reset() {
    setTimer({start: new Date().getTime(), elapsed:0})
  }

  useInterval(() => {
    tick(true);
  }, timer.elapsed < duration ? INTERVAL : null);

  const done = duration <= timer.elapsed;
  useEffect(() => {
    if (done) {
      tick(false);}
  }, [done]);

  const extended = (duration > timer.elapsed && !timer.start);
  useEffect(() => {
    if (extended) {
      const newStartTime = new Date().getTime() - timer.elapsed;
      setTimer({start: newStartTime, elapsed: timer.elapsed});
    }
  }, [extended]);

  return [timer.elapsed, reset];
}


function Timer() {
  const [duration, setDuration] = useState(7 * 1000);
  const [elapsed, reset] = useStopWatch(duration);

  const percent = 100 * elapsed / duration;

  return (
    <div>
      <h2>Timer</h2>

      <form>
        <div class="form-group row">
          <label class="col-sm-2 col-form-label" style={{ paddingTop: '7px' }}>
            Elapsed time
          </label>
          <div class="col-sm-8">
            <div style={{ paddingTop: '10px' }}>
              <div class="progress" style={{ marginBottom: '0px' }}>
                <div
                  class={`progress-bar ${percent >= 100
                    ? 'progress-bar-danger'
                    : 'progress-bar-success'}`}
                  role="progressbar"
                  aria-valuenow={elapsed / 1000}
                  aria-valuemin="0"
                  aria-valuemax={duration / 1000}
                  style={{ width: Math.min(percent, 100) + '%' }}>
                  {elapsed / 1000}s
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-2" style={{ paddingTop: '7px' }}>
            {elapsed / 1000}s
          </div>
        </div>

        <div class="form-group row">
          <label class="col-sm-2 col-form-label" htmlFor="filter">
            Duration
          </label>
          <div class="col-sm-8">
            <input
              class="form-control"
              type="range"
              min="0"
              max={60 * 10}
              value={duration / 100}
              onChange={event => setDuration(event.target.value * 100)}
            />
          </div>
          <div class="col-sm-2" style={{ paddingTop: '7px' }}>
            {duration / 1000}s
          </div>
        </div>
        <div class="form-group">
          <div class="col-xs-offset-3 col-xs-9">
            <button type="submit" class="btn btn-primary" onClick={reset}>
              Reset!
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Timer;
