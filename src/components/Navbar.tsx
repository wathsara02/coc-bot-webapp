import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          ⚔️ COC Bot Dashboard
        </Link>
        <ul className="navbar-nav">
          <li>
            <Link to="/" className={isActive('/')}>
              📊 Dashboard
            </Link>
          </li>
          <li>
            <Link to="/leaderboard" className={isActive('/leaderboard')}>
              🏆 Leaderboard
            </Link>
          </li>
          <li>
            <Link to="/analytics" className={isActive('/analytics')}>
              📈 Analytics
            </Link>
          </li>
          <li>
            <Link to="/feedback" className={isActive('/feedback')}>
              💬 Feedback
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;