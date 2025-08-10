import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import { ThemeProvider, createTheme } from "@mui/material";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const theme = createTheme({
  palette: {
    primary: { main: "#0049B7" },
    background: { default: "#f9fafb" },
  },
});

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
