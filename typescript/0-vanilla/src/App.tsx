import React, { useState, FunctionComponent } from 'react';
import Counter from './Counter';
import Converter from './Converter';
// import Timer from './Timer';
// import CRUD from './Crud';
import './App.css';

// const tabs = { Counter, Converter, Timer, CRUD };
const components:any = { Counter, Converter };

function App() {
  const [activeTab, setActiveTab] = useState('Counter');
  const activeComponent:FunctionComponent = components[activeTab];

  return (
    <div className="container">
      <div className="page-header">
        <h1>
          React{' '}
          <small>
            Functions using <em>hooks</em>
          </small>
        </h1>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#">GUIs</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
            {Object.keys(components).map(tab =>
              <a
                key={tab}
                className={"nav-item nav-link " + (tab === activeTab && 'active')}
                href="#"
                onClick={() => setActiveTab(tab)}>{tab}</a>
            )}
            </div>
          </div>
        </nav>
      </div>
      {React.createElement(activeComponent)}
    </div>
  );
}

export default App;
