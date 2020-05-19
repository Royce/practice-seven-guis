import React, { useState, FunctionComponent, useCallback } from "react";
import Counter from "./Counter";
import Converter from "./Converter";
import Timer from "./Timer";
// import CRUD from './Crud';

import "bootstrap/dist/css/bootstrap.css";
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

const components: any = { Counter, Converter, Timer };

const useToggle = function useToggle(
  initialState: boolean
): [boolean, () => void] {
  const [on, setOn] = useState(initialState);
  const toggle = useCallback(() => setOn(state => !state), []);
  return [on, toggle];
};

function App() {
  const [activeTab, setActiveTab] = useState("Timer");
  const [navOpen, toggleNav] = useToggle(false);
  const activeComponent: FunctionComponent = components[activeTab];

  return (
    <div className="container">
      <div className="page-header">
        <h1>
          React{" "}
          <small>
            Functions using <em>hooks</em>
          </small>
        </h1>
        <Navbar color="light" light expand="lg">
          <NavbarBrand>GUIs</NavbarBrand>
          <NavbarToggler onClick={toggleNav} />

          <Collapse isOpen={navOpen} navbar>
            <Nav className="ml-auto" navbar>
              {Object.keys(components).map(tab => (
                <NavItem active={tab === activeTab}>
                  <NavLink href="#" onClick={() => setActiveTab(tab)}>
                    {tab}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
      {React.createElement(activeComponent)}
    </div>
  );
}

export default App;
