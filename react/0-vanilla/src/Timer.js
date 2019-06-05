import React, { Component } from 'react';

const INTERVAL = 30;

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elapsed: 0,
      duration: 7 * 1000,
    };
  }

  componentDidMount() {
    this.reset();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout_id);
  }

  reset = () => this.start(true);

  start = reset => {
    var now = new Date().getTime();
    if (reset) {
      this.setState({ startTime: now, elapsedAtStart: 0, elapsed: 0 });
    } else {
      this.setState({ startTime: now, elapsedAtStart: this.state.elapsed });
    }
    this.requestTick();
  };

  requestTick = () => {
    clearTimeout(this.timeout_id);
    this.timeout_id = setTimeout(() => this.tick && this.tick(true), INTERVAL);
  };

  tick = ongoing => {
    if (!this.state.startTime) return;

    var now = new Date().getTime();
    var elapsed = now - this.state.startTime + this.state.elapsedAtStart;
    var isOverTime = elapsed >= this.state.duration;
    if (isOverTime) elapsed = Math.max(this.state.elapsed, this.state.duration);

    if (ongoing && !isOverTime) {
      this.setState({ elapsed });
      this.requestTick();
    } else {
      this.setState({ elapsed, startTime: null });
    }
  };

  setDuration = duration => {
    if (duration <= this.state.elapsed) this.tick(false);
    if (duration > this.state.elapsed && !this.state.startTime) this.start();
    this.setState({ duration });
  };

  render() {
    var percent = 100 * this.state.elapsed / this.state.duration;

    return (
      <div>
        <h2>Timer</h2>

        <div className="form-horizontal">
          <div className="form-group">
            <label className="col-xs-3 control-label" style={{ paddingTop: '7px' }}>
              Elapsed time
            </label>
            <div className="col-xs-7">
              <div style={{ paddingTop: '6px' }}>
                <div className="progress" style={{ marginBottom: '0px' }}>
                  <div
                    className={`progress-bar ${percent >= 100
                      ? 'progress-bar-danger'
                      : 'progress-bar-success'}`}
                    role="progressbar"
                    aria-valuenow={this.state.elapsed / 1000}
                    aria-valuemin="0"
                    aria-valuemax={this.state.duration / 1000}
                    style={{ width: Math.min(percent, 100) + '%' }}>
                    {this.state.elapsed / 1000}s
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xs-2" style={{ paddingTop: '7px' }}>
              {this.state.elapsed / 1000}s
            </div>
          </div>
          <div className="form-group">
            <label className="col-xs-3 control-label" htmlFor="filter">
              Duration
            </label>
            <div className="col-xs-7">
              <input
                className="form-control"
                type="range"
                min="0"
                max={60 * 10}
                value={this.state.duration / 100}
                onChange={event => this.setDuration(event.target.value * 100)}
              />
            </div>
            <div className="col-xs-2" style={{ paddingTop: '7px' }}>
              {this.state.duration / 1000}s
            </div>
          </div>
          <div className="form-group">
            <div className="col-xs-offset-3 col-xs-9">
              <button type="submit" className="btn btn-default" onClick={this.reset}>
                Reset!
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Timer;
