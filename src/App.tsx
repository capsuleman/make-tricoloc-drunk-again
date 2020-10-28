import React from 'react';
import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { theme } from 'src/theme';

const App: React.FC = () => {
  return (
    <CssBaseline>
      <StylesProvider injectFirst>
        <MuiThemeProvider theme={theme}>Content here</MuiThemeProvider>
      </StylesProvider>
    </CssBaseline>
  );
};

export default App;
