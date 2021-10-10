import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
//context
import { UserProvider } from "./userContext";
import { ChaptersProvider } from "./ChaptersContext";

ReactDOM.render(
  <React.StrictMode>
    <ChaptersProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </ChaptersProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
