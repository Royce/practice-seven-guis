import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import examples from "./examples";
import _ from "lodash";

it("renders without crashing", () => {
  expect(null).toEqual(null);
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
