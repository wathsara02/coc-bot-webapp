import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import Analytics from './components/Analytics';
import Feedback from './components/Feedback';
import ActivityStats from './components/ActivityStats';
import UserData from './components/UserData';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/activity" element={<ActivityStats />} />
            <Route path="/users" element={<UserData />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
