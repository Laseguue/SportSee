import React from 'react';
import SideBar from '../SideBar/SideBar';
import CalGraph from './CalGraph';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <SideBar />
      <CalGraph />
    </div>
  );
}
export default Dashboard;