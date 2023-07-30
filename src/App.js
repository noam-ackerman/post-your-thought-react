import { useAuth } from "./context/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Signup from "./pages/signup";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Login from "./pages/login";
import Profile from "./pages/Profile";
import NavigateToProfile from "./components/AuthenticatedUserProfile/NavigateToProfile";
import ProtectedRoute from "./components/routesWrappers/ProtectedRoute";
import PublicAuthRoute from "./components/routesWrappers/PublicAuthRoute";
import Homepage from "./pages/Homepage";
import Search from "./pages/searchPage";
import ForgotPassword from "./pages/forgotPassword";
import ScrollToTop from "./components/utilities/scrollToTop";

const queryClient = new QueryClient();

function App() {
  const { currentUser } = useAuth();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ScrollToTop />
          {currentUser && <Navbar />}
          <Routes>
            <Route
              path="/"
              exact
              element={
                <ProtectedRoute>
                  <Homepage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <NavigateToProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/:userId"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search-users"
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicAuthRoute>
                  <Signup />
                </PublicAuthRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicAuthRoute>
                  <Login />
                </PublicAuthRoute>
              }
            />
            <Route
              path="/resetpassword"
              element={
                <PublicAuthRoute>
                  <ForgotPassword />
                </PublicAuthRoute>
              }
            />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
