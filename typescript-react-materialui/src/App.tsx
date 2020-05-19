import React from "react";
import ResponsiveLayout from "./components/ResponsiveLayout";

import examples from "./examples";

const App: React.FC = () => {
  const current = examples[0];
  return (
    <ResponsiveLayout
      title={current.title}
      element={current.element}
      list={examples}
    />
  );
};
export default App;
