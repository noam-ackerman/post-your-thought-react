import Signup from "./pages/signup";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Login from "./pages/login";
import Profile from "./pages/Profile";
import NavigateToProfile from "./components/AuthenticatedUserProfile/NavigateToProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicAuthenticateRoute from "./components/PublicAuthenticateRoute";
import Homepage from "./pages/Homepage";
import Search from "./pages/searchPage";
import ForgotPassword from "./pages/forgotPassword";
import { useAuth } from "./context/AuthContext";
import ScrollToTop from "./components/resources/scrollToTop";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

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
                <PublicAuthenticateRoute>
                  <Signup />
                </PublicAuthenticateRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicAuthenticateRoute>
                  <Login />
                </PublicAuthenticateRoute>
              }
            />
            <Route
              path="/resetpassword"
              element={
                <PublicAuthenticateRoute>
                  <ForgotPassword />
                </PublicAuthenticateRoute>
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
