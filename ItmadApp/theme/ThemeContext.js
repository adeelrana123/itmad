import React, { createContext, useContext } from 'react';
import appTheme from './colors';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const theme = appTheme.light;  // Fixed to light mode, no toggle

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context.theme;
};
