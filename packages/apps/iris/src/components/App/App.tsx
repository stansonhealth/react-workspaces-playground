import React from 'react';

import {LoggedInUser} from "@stanson/components";
import {Container, CssBaseline, ThemeProvider} from "@material-ui/core";
import Main from "../Main/Main";
import {theme} from "@stanson/constants/themes";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <CssBaseline />
          <LoggedInUser>
            <Container>
              <Main></Main>
            </Container>
          </LoggedInUser>
      </div>
    </ThemeProvider>
  );
};

export default App;
