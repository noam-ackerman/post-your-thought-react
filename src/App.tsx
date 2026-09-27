import { useAuth } from "@/context/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Signup } from "@/pages/Signup";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Login } from "@/pages/Login";
import { Profile } from "@/pages/Profile";
import { NavigateToProfile } from "@/components/routes/NavigateToProfile";
import { RouteGuard } from "@/components/routes/RouteGuard";
import { Homepage } from "@/pages/Homepage";
import { SearchPage } from "@/pages/SearchPage";
import { ForgotPassword } from "@/pages/ForgotPassword";
import { ScrollToTop } from "@/utilities/scrollToTop";

function App() {
  const { currentUser } = useAuth();
  return (
    <>
      <Router>
        <ScrollToTop />
        {currentUser && <Navbar />}
        <Routes>
          <Route
            path="/"
            element={
              <RouteGuard mode="protected">
                <Homepage />
              </RouteGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <RouteGuard mode="protected">
                <NavigateToProfile />
              </RouteGuard>
            }
          />
          <Route
            path="/:userId"
            element={
              <RouteGuard mode="protected">
                <Profile />
              </RouteGuard>
            }
          />
          <Route
            path="/search-users"
            element={
              <RouteGuard mode="protected">
                <SearchPage />
              </RouteGuard>
            }
          />
          <Route
            path="/signup"
            element={
              <RouteGuard mode="public">
                <Signup />
              </RouteGuard>
            }
          />
          <Route
            path="/login"
            element={
              <RouteGuard mode="public">
                <Login />
              </RouteGuard>
            }
          />
          <Route
            path="/resetpassword"
            element={
              <RouteGuard mode="public">
                <ForgotPassword />
              </RouteGuard>
            }
          />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export { App };
