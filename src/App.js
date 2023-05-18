import "./App.css";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Profile from "./pages/Profile";
import NavigateToProfile from "./components/AuthenticatedUserProfile/NavigateToProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import Homepage from "./pages/Homepage";
import Search from "./pages/searchPage";
import ForgotPassword from "./pages/forgotPassword";
import ScrollToTop from "./components/scrollToTop";
import { AuthContextProvider } from "./context/AuthContext";
import { UsersContextProvider } from "./context/usersContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <AuthContextProvider>
          <UsersContextProvider>
            <ScrollToTop />
            <Routes>
              <Route
                path="/"
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
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/resetpassword" element={<ForgotPassword />} />
              <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
          </UsersContextProvider>
        </AuthContextProvider>
      </Router>
    </div>
  );
}

export default App;
