import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/api';
import SideBar from '../SideBar/SideBar';
import CalGraph from './CalGraph';
import ProfilName from './ProfilName';
import DurationGraph from './DurationGraph';
import PerfGraph from './PerfGraph';
import ScoreGraph from './ScoreGraph';
import NutrientCard from './NutrientCard';
import './Hero.css';

function Hero() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getCurrentUser();
        setUserData(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading || !userData) {
    return <div>Chargement...</div>;
  }

  const { calorieCount, proteinCount, carbohydrateCount, lipidCount } = userData.keyData;
  return (
    <div className="hero">
      <SideBar />
      <div className="hero-content">
        <ProfilName />
        <div className="dashboard">
          <div className='graphs'>
            <CalGraph />
            <DurationGraph />
            <PerfGraph />
            <ScoreGraph />
          </div>
          <div className="nutrients">
            <NutrientCard type="calorie" value={calorieCount} unit="kCal" label="Calories" />
            <NutrientCard type="protein" value={proteinCount} unit="g" label="Proteines" />
            <NutrientCard type="carb" value={carbohydrateCount} unit="g" label="Glucides" />
            <NutrientCard type="lipid" value={lipidCount} unit="g" label="Lipides" />
          </div>
        </div>

      </div>
    </div>
  );
}
export default Hero;
