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
    this.state = { tab: 'Counter' };
  }

  render() {
    const active = tabs[this.state.tab];
    return (
      <div className="container">
        <div className="page-header">
          <h1>
            React{' '}
            <small>
              Vanilla. Components using <code>.setState</code>
            </small>
          </h1>
          <ul className="nav nav-pills">
            {Object.keys(tabs).map(tab =>
              <li role="presentation" key={tab} className={tab === this.state.tab && 'active'}>
                <a href={'#' + tab} onClick={() => this.setState({ tab })}>
                  {tab}
                </a>
              </li>
            )}
          </ul>
        </div>
        {React.createElement(active)}
      </div>
    );
  }
}

export default App;
