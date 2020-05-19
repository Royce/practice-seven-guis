import React, { useState, useRef, useEffect, useCallback } from "react";

const INTERVAL = 50;

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current && savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

interface TimerControls {
  reset: () => void;
}

function useTimer(duration: number): [number, TimerControls] {
  //
  // The elapsed/setElapsed is only used to emit new values.
  //
  const [elapsed, setElapsed] = useState(0);

  //
  // Use startTime when the timer is active, to know when the timer started.
  // Use previousElapsed to store elapsed when the timer is stopped/completed
  // - then we can continue, by extending the duration.
  //
  const previousElapsed = useRef<number>();
  const startTime = useRef<number>();

  const reset = useCallback(function reset() {
    startTime.current = new Date().getTime();
    previousElapsed.current = undefined;
    setElapsed(0);
  }, []);
  useEffect(reset, []);

  const _stop = useCallback(function stop(_elapsed: number) {
    setElapsed(_elapsed);

    startTime.current = undefined;
    previousElapsed.current = _elapsed;
  }, []);

  const _start = useCallback(function start() {
    if (previousElapsed.current === undefined) throw new Error("oops");

    startTime.current = new Date().getTime() - previousElapsed.current;
    previousElapsed.current = undefined;
  }, []);

  useEffect(
    function() {
      if (startTime.current === undefined) {
        if (
          previousElapsed.current !== undefined &&
          duration > previousElapsed.current
        ) {
          // If duration increase above the old elapsed
          // .. restart/continue the timer.
          _start();
        }
      } else {
        const newElapsed = new Date().getTime() - startTime.current;
        if (duration <= newElapsed) {
          // If the duration has been reduced to below the elapsed,
          // save the current elapsed and stop.
          _stop(newElapsed);
        }
      }
    },
    [duration, _start, _stop]
  );

  const tick = useCallback(
    function tick() {
      if (startTime.current === undefined) return;

      const now = new Date().getTime();
      const newElapsed = now - startTime.current;

      if (newElapsed > duration) {
        _stop(duration);
      } else {
        setElapsed(newElapsed);
      }
    },
    [duration, _stop]
  );

  const isTimeRemaining = duration > elapsed;
  useInterval(tick, isTimeRemaining ? INTERVAL : null);

  return [elapsed, { reset }];
}

function Timer() {
  const [duration, setDuration] = useState(6 * 1000);
  const [elapsed, controls] = useTimer(duration);

  const percent = (100 * elapsed) / duration;

  return (
    <div>
      <h2>Timer</h2>

      <form>
        <div className="form-group row">
          <label
            className="col-sm-2 col-form-label"
            style={{ paddingTop: "7px" }}
          >
            Elapsed time
          </label>
          <div className="col-sm-8">
            <div style={{ paddingTop: "10px" }}>
              <div className="progress" style={{ marginBottom: "0px" }}>
                <div
                  className={`progress-bar ${
                    percent >= 100 ? "bg-danger" : "bg-info"
                  }`}
                  role="progressbar"
                  aria-valuenow={elapsed / 1000}
                  aria-valuemin={0}
                  aria-valuemax={duration / 1000}
                  style={{
                    width: Math.min(percent, 100) + "%",
                    transition: "none"
                  }}
                >
                  {elapsed / 1000}s
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-2" style={{ paddingTop: "7px" }}>
            {elapsed / 1000}s
          </div>
        </div>

        <div className="form-group row">
          <label className="col-sm-2 col-form-label" htmlFor="filter">
            Duration
          </label>
          <div className="col-sm-8">
            <input
              className="form-control"
              type="range"
              min="0"
              max={60 * 10}
              value={duration / 100}
              onChange={event => setDuration(Number(event.target.value) * 100)}
            />
          </div>
          <div className="col-sm-2" style={{ paddingTop: "7px" }}>
            {duration / 1000}s
          </div>
        </div>
        <div className="form-group">
          <div className="col-xs-offset-3 col-xs-9">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={controls.reset}
            >
              Reset!
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Timer;
