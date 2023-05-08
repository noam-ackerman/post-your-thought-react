import './App.css';
import Signup from './components/signup';
import {AuthContextProvider} from './context/AuthContext'


function App() {
  return (
    <div>
      <AuthContextProvider>
        <Signup/>
      </AuthContextProvider>
    </div>
  );
}

export default App;

