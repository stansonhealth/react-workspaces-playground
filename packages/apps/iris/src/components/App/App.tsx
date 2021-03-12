import React from 'react';

import {LoggedInUser, PageWrapper} from "@stanson/components";
import Main from "../Main/Main";
import {
  BrowserRouter as Router} from "react-router-dom";

const App: React.FC = () => {
  return (
    <Router>
      <PageWrapper>
        <LoggedInUser>
          <Main></Main>
        </LoggedInUser>
      </PageWrapper>
    </Router>
  );
};

export default App;
