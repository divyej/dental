import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PhotoDisplay from './components/PhotoDisplay';

// Create a dark/black theme
const theme = createTheme({
  palette: {
    type: 'dark',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div style={{ backgroundColor: 'black', minHeight: '100vh' }}>
        <PhotoDisplay />
      </div>
    </ThemeProvider>
  );
};

export default App;
