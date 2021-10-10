import { red, green } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#65a9e8",
    },
    secondary: red,
    triple: green,
    bg: {
      light: "#f4f4f4",
      dark: "#e9e9e9",
    },
    text: {
      gray: "#878787",
      blue: "#65a9e8",
      yellow: "#f8b32d",
      pink: "#fd7397",
      green: "#4aa23c",
    },
    white: "#fff",
  },
  typography: {
    fontFamily: "Poppins",
  },
  maxWidth: "1000px",
});

export default theme;
