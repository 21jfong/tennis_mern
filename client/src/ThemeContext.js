import React, { createContext, useContext } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProviderWrapper = ({ children }) => {
  // Set the default theme to dark mode
  const theme = createTheme({
    palette: {
      mode: 'dark', // Always use dark mode
      primary: {
        main: '#353633', // Dark
        dark: '#1b1b1b',
        lighter: '#52544F'
      },
      secondary: {
        main: '#E0E0E0', // Light
      },
      ternary: {
        main: '#C2C2C2'
      }
    },
  });

  return (
    <ThemeContext.Provider value={{}}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};