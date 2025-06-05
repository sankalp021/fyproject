import { createContext } from "react";

// Create a simplified auth context with default values
const initialState = {
  user: { name: 'Guest User' },
  role: 'patient',  // Default role to allow access to most features
  token: 'dummy-token',  // Dummy token to bypass auth checks
};

export const authContext = createContext(initialState);

export const AuthContextProvider = ({ children }) => {
  // Simplified provider that always provides the same auth values
  // This removes the need for auth logic while maintaining compatibility with components
  return (
    <authContext.Provider
      value={{
        user: initialState.user,
        token: initialState.token,
        role: initialState.role,
        // Mock dispatch function that does nothing
        dispatch: () => console.log('Auth actions are disabled'),
      }}
    >
      {children}
    </authContext.Provider>
  );
};
