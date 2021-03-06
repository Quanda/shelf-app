import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'light', // dark
    primary: {
      main: '#15202B', // 37474f
    },
    secondary: {
      main: '#E9F0FE', // e3f2fd
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    }
  },
  typography: {
    fontFamily: 'Open Sans, sans-serif',
  },
});


export default theme;
