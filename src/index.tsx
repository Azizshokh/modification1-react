import React from "react";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import theme from "./app/MaterialTheme";
import { store } from "./app/store";
import App from "./app/App";
import ContextProvider from "./app/context/ContextProvider";
import reportWebVitals from "./reportWebVitals";

import { SocketProvider } from "./app/context/SocketContext";
import "./css/index.css";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ContextProvider>
            <Router
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <App />
            </Router>
          </ContextProvider>
        </ThemeProvider>
      </SocketProvider>
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
