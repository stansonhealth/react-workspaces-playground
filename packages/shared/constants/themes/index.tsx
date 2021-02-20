import {createMuiTheme} from "@material-ui/core";
import {color} from "./colors";

export const theme = createMuiTheme({
  palette: {
    background: {
        default: color["darkblue-40"]
    },
    primary: {
      main: color["blue-40"],
    },
    secondary: {
      main: color["darkblue-40"],
    },
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1398,
    }
  }
});
