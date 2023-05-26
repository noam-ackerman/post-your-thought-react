import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthContextProvider } from "./context/AuthContext";
import { UsersContextProvider } from "./context/usersContext";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./pages/ErrorPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary fallback={<ErrorPage />}>
      <AuthContextProvider>
        <UsersContextProvider>
          <App />
        </UsersContextProvider>
      </AuthContextProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
