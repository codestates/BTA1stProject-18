import { createTheme } from '@mui/material';
import { teal } from '@mui/material/colors';

export const theme = createTheme({
  typography: {
    fontFamily: ['Roboto', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"Helvetica Neue"', 'Arial', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"'].join(','),
  },
  palette: {
    primary: teal,
    secondary: {
      main: '#43a047',
    },
  },
});
