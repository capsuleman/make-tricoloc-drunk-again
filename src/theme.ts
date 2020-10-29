import { createMuiTheme, Theme } from '@material-ui/core';

export const colors = {
  darkBlue: '#003049',
  red: '#d62828',
  orange: '#f77f00',
  yellow: '#fcbf49',
  darkWhite: '#eae2b7',
  white: '#fff',
  grey: '#6d7278',
};

export const theme: Theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1440,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      main: colors.darkBlue,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.orange,
      contrastText: colors.white,
    },
    error: {
      main: colors.red,
      contrastText: colors.white,
    },
    background: {
      default: colors.white,
    },
    text: {
      primary: colors.grey,
    },
  },
  shape: {
    borderRadius: 6,
  },
  typography: {
    fontFamily: `'Nunito', 'Helvetica', 'Arial', sans-serif`,
    fontSize: 14,
    button: {
      textTransform: 'none',
    },
    body1: {
      letterSpacing: 'normal',
    },
    body2: {
      letterSpacing: 'normal',
    },
  },
});
