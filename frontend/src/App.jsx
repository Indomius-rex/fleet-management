import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Main App component with route definitions
export default function App() {
  return (
    <Routes>
      {/* Login route */}
      <Route path="/login" element={<Login />} />

      {/* Register route */}
      <Route path="/register" element={<Register />} />

      {/* Dashboard route */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Default route redirects to login */}
      <Route path="/" element={<Login />} />
    </Routes>
  );
}
