import React from 'react';
import {CssBaseline} from "@material-ui/core";
import Authenticator from "../Authenticator/Authenticator";



const App: React.FC = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Authenticator />
    </React.Fragment>
  );
};

export default App;
