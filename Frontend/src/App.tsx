import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Modules from "./pages/Modules";
import ModuleDetails from "./pages/ModuleDetails";
import Builds from "./pages/Builds";
import QualityGate from "./pages/QualityGate";
import AIInsights from "./pages/AIInsights";
import CodeHealth from "./pages/CodeHealth";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Dashboard />}
      />

      <Route
        path="/modules"
        element={<Modules />}
      />

      <Route
        path="/modules/:id"
        element={<ModuleDetails />}
      />

      <Route
        path="/builds"
        element={<Builds />}
      />
      <Route
  path="/quality-gate"
  element={<QualityGate />}
/>
<Route
  path="/ai-insights"
  element={<AIInsights />}
/>
<Route
  path="/code-health"
  element={<CodeHealth />}
/>
    </Routes>
    
  );
}

export default App;