import React from "react";

// Modified ProtectedRoute that always allows access
const ProtectedRoute = ({ children }) => {
  // Always render the children components
  return children;
};

export default ProtectedRoute;
