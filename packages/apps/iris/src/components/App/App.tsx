import React from 'react';

import {LoggedInUser, PageWrapper} from "@stanson/components";
import Main from "../Main/Main";

const App: React.FC = () => {
  return (
    <PageWrapper>
      <LoggedInUser>
        <Main></Main>
      </LoggedInUser>
    </PageWrapper>
  );
};

export default App;
