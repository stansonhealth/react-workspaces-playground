import React from 'react';
import {CssBaseline, Theme, ThemeProvider} from "@material-ui/core";
import {theme} from "@stanson/constants/themes";

interface Props {
  name?: string;
  theme?: Theme;
}

const ContentWrapper: React.FC<Props> = (props) => {

  return (
    <ThemeProvider theme={props.theme || theme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
};

export default ContentWrapper;
