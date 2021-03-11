import {createMuiTheme} from "@material-ui/core";
import color from "./colors";

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    neutral: {
      primary: string;
    }
  }
  interface PaletteOptions {
    neutral: {
      primary: string;
    }
  }
}

const theme = createMuiTheme({
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
    text: {
      primary: color["neutral-80"],
    },
    neutral: {
      primary: color["neutral-60"]
    }
  },
  typography: {
    h3: {
      fontWeight: 300
    },
    h4: {
      fontSize: "1.75rem",
      fontWeight: 300
    }
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

export default theme
