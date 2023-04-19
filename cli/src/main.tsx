import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraBaseProvider } from "@chakra-ui/react";
import { theme } from "./theme";
import { RoomProvider } from "./context/RoomContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraBaseProvider theme={theme}>
      <Router>
        <RoomProvider>
          <App />
        </RoomProvider>
      </Router>
    </ChakraBaseProvider>
  </React.StrictMode>
);
