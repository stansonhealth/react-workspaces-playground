import React, {useContext, useEffect} from 'react';
import './App.css';

import {CompOne, LoggedInUser, UserStore} from '@stanson/components';

const App: React.FC = () => {

  const {state} = useContext(UserStore);

  useEffect(() => {
    console.log(state);
  }, [state.userDetails])

  console.log(state);

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          MIA
        </h1>
        <h2>Hot Reload Your React TypeScript Workspaces</h2>
        <div className="components">
            <CompOne name={state.userDetails?.username}/>
        </div>
      </header>
    </div>
  );
};

export default App;
