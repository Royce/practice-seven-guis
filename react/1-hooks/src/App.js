import React, { Component } from 'react';
import Counter from './Counter';
import Converter from './Converter';
import Timer from './Timer';
import CRUD from './Crud';
import './App.css';

const tabs = { Counter, Converter, Timer, CRUD };

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { tab: 'Timer' };
  }

  render() {
    const active = tabs[this.state.tab];
    return (
      <div className="container">
        <div className="page-header">
          <h1>
            React{' '}
            <small>
              Functions using <em>hooks</em>
            </small>
          </h1>
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#">GUIs</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div class="navbar-nav">
              {Object.keys(tabs).map(tab =>
                <a
                  key={tab}
                  className={"nav-item nav-link " + (tab === this.state.tab && 'active')}
                  href="#"
                  onClick={() => this.setState({ tab })}>{tab}</a>
              )}
              </div>
            </div>
          </nav>
        </div>
        {React.createElement(active)}
      </div>
    );
  }
}

export default App;
