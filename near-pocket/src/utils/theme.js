import { createTheme } from '@mui/material';

export const theme = createTheme({
  typography: {
    fontFamily: ['Roboto', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"Helvetica Neue"', 'Arial', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"'].join(','),
  },
  palette: {
    primary: {
      main: '#5f8afa',
      // main: '#010C80',
    },
    secondary: {
      main: '#1976d2',
    },
  },
});
