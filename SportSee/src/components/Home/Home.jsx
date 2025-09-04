import React from 'react';
import SideBar from '../SideBar/SideBar';
import CalGraph from './CalGraph';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <SideBar />
      <CalGraph />
    </div>
  );
}
export default Home;