import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Auth/Login';
import PageNotFound from './Auth/PageNotFound';
import Dashboard from './Dashboard/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
