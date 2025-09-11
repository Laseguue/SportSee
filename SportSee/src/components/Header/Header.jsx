import React from 'react';
import Logo from './Logo';
import HeaderButton from './HeaderButton';
import './Header.css';

function Header() {
  return (
    <header>
      <div className="header-content">
        <Logo />
        <nav>
            <HeaderButton to="/" label="Accueil" className="home-btn" />
            <HeaderButton to="/profil" label="Profil" className="profil-btn" />
            <HeaderButton to="/communaute" label="Comunauté" className="comunaute-btn" />
            <HeaderButton to="/reglages" label="Réglage" className="reglage-btn" />
        </nav>
      </div>
    </header>
  );
}
export default Header;