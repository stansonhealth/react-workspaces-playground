import React from 'react';

import {LoggedInUser} from "@stanson/components";
import {Container, CssBaseline, ThemeProvider} from "@material-ui/core";
import Main from "../Main/Main";
import {theme} from "@stanson/constants/themes";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoggedInUser>
          <Main></Main>
      </LoggedInUser>
    </ThemeProvider>
  );
};

export default App;
