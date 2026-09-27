import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthContextProvider } from "@/context/AuthContext";
import { UsersContextProvider } from "@/context/UsersContext";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "@/App";
import { ErrorPage } from "@/pages/ErrorPage";
import "@/tokens/tokens.css";
import "./index.css";

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <ErrorBoundary fallback={<ErrorPage />}>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <UsersContextProvider>
            <App />
          </UsersContextProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
