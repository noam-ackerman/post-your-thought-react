import React from "react";
import ReactDOM from "react-dom/client";
import { AuthContextProvider } from "@/context/AuthContext";
import { UsersContextProvider } from "@/context/UsersContext";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "@/App";
import { ErrorPage } from "@/pages/ErrorPage";
import "./index.css";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary fallback={<ErrorPage />}>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <UsersContextProvider>
            <App />
          </UsersContextProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
