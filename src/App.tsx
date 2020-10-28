import React from 'react';
import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import SignIn from 'src/components/SignIn';
import { theme } from 'src/theme';

const App: React.FC = () => {
  return (
    <CssBaseline>
      <StylesProvider injectFirst>
        <MuiThemeProvider theme={theme}>
          <SignIn />
        </MuiThemeProvider>
      </StylesProvider>
    </CssBaseline>
  );
};

export default App;
