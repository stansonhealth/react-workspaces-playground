import React from 'react';
import './App.css';

import { CompOne } from '@stanson/components';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          MIA
        </h1>
        <h2>Hot Reload Your React TypeScript Workspaces</h2>
        <div className="components">
          <CompOne />
        </div>
      </header>
    </div>
  );
};

export default App;
