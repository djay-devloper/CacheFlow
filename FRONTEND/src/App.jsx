import React, { useContext } from 'react';
import { 
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './pages/auth/Login.jsx';
import SignUp from './pages/auth/SignUp.jsx';
import Landing from './pages/Landing.jsx';
import Home from './pages/Dashboard/Home.jsx';
import Expense from './pages/Dashboard/Expense.jsx';
import Income from './pages/Dashboard/Income.jsx';
import UserProvider, { UserContext } from './context/userContext.jsx';


const Root = () => {
  const { isInitialized } = useContext(UserContext);

  // Show loading indicator while checking authentication
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Send authenticated users to their dashboard and signed-out users to the landing page.
  return localStorage.getItem('token') ? (
    <Navigate to="/home" replace />
  ) : (
    <Landing />
  );
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path='/' element={<Root />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/home' element={<Home />} />
            <Route path='/dashboard' element={<Home />} />
            <Route path='/expense' element={<Expense />} />
            <Route path='/income' element={<Income />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  )
}

export default App;
