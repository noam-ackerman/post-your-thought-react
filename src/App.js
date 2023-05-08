import './App.css';
import Signup from './components/signup';
import Login from './components/login';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import {AuthContextProvider} from './context/AuthContext'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import ForgotPassword from './components/forgotPassword';


function App() {
  return (
    <div>
      <Router>
        <AuthContextProvider>
          <Routes>
            {['/', '/profile'].map((path, index) => (
              <Route path={path} key={index} element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            ))}
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/login"element={<Login/>}/>
            <Route path="/resetpassword" element={<ForgotPassword/>}/>
          </Routes>
        </AuthContextProvider>
      </Router>
    </div>
  );
}

export default App;

