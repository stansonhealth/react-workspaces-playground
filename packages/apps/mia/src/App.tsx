import React from 'react';
import './App.css';

import {LoggedInUser} from '@stanson/components';
import Main from "./components/Main/Main";
import PageWrapper from "@stanson/components/src/PageWrapper/PageWrapper";

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
