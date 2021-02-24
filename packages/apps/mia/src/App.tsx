import React from 'react';
import './App.css';

import {LoggedInUser} from '@stanson/components';
import Main from "./components/Main/Main";

const App: React.FC = () => {

  return (
    <LoggedInUser>
      <div className="App">
        <header className="App-header">
          <h1>
            MIA
          </h1>
          <Main></Main>
          <a href="http://localhost:3001">GO TO IRIS</a>
        </header>

      </div>
    </LoggedInUser>
  );
};

export default App;
