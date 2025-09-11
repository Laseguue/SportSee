import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function HeaderButton({ to, label, className }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <button className={`button ${className || ''} ${isActive ? 'active' : ''}`.trim()}>
        {label}
      </button>
    </Link>
  );
}

export default HeaderButton;


