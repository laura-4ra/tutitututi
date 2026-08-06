import { Routes, Route } from "react-router-dom";
import App from "./App";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/sala/:id" element={<App />} />
    </Routes>
  );
}

export default Router;