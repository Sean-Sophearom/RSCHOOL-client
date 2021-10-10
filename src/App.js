import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//css global
import "./app.css";

//components
import LoginPage from "./LoginPage.js";
import LandingPage from "./LandingPage";
import MainPageContainer from "./MainPageContainer";

//mui
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/" exact component={LandingPage} />
          <Route path="/user/login" exact component={LoginPage} />
          <Route path="/" component={MainPageContainer} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;
