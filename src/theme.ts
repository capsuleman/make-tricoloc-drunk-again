import { createMuiTheme, Theme } from '@material-ui/core';

export const colors = {
  primary: '#E27D60',
  secondary: '#85DCBA',
  red: '#E8A87C',
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
      main: colors.primary,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.secondary,
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
