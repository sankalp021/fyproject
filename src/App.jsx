import React from "react";
import Layout from "./layout/Layout";
import Admin from "./layout/Admin-Layout.jsx";

function App() {
  // Simple logic to determine layout based on URL path
  // Use Layout component as the default
  return <Layout />;
}

export default App;
