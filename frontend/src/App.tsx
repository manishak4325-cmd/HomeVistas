import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import AdminPanel from './pages/AdminPanel';
import { Matchmaker } from './pages/Matchmaker';
import { MatchResults } from './pages/MatchResults';
import { Compare } from './pages/Compare';
import { CompareBottomBar } from './components/CompareBottomBar';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="properties" element={<Properties />} />
            <Route path="properties/:id" element={<PropertyDetail />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="matchmaker" element={<Matchmaker />} />
            <Route path="match-results" element={<MatchResults />} />
            <Route path="compare" element={<Compare />} />
          </Route>
        </Routes>
      <CompareBottomBar />
    </Router>
  );
}

export default App;
