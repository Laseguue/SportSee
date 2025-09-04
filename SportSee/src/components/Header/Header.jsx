import React from 'react';
import Logo from './Logo';
import HomeBtn from './HomeBtn';
import ProfilBtn from './ProfilBtn';
import ComunauteBtn from './ComunauteBtn';
import ReglageBtn from './ReglageBtn';
import './Header.css';

function Header() {
  return (
    <header>
      <div className="header-content">
        <Logo />
        <nav>
            <HomeBtn />
            <ProfilBtn />
            <ComunauteBtn />
            <ReglageBtn />
        </nav>
      </div>
    </header>
  );
}
export default Header;