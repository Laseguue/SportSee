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
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        
        const data = await getCurrentUser();
        setUserData(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
        setLoadError(error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  if (loading) {
    return (
      <div className="hero">
        <SideBar />
        <div className="hero-content">
          <div>Chargement...</div>
        </div>
      </div>
    );
  }

  if (loadError || !userData) {
    return (
      <div className="hero">
        <SideBar />
        <div className="hero-content">
          <div>les données n'ont pas été récupérées via l'api. impossible d'afficher les statistiques.</div>
        </div>
      </div>
    );
  }

  const calorieCount = userData.keyData.calorieCount;
  const proteinCount = userData.keyData.proteinCount;
  const carbohydrateCount = userData.keyData.carbohydrateCount;
  const lipidCount = userData.keyData.lipidCount;
  const nutrients = [
    { type: 'calorie', value: calorieCount, unit: 'kCal', label: 'Calories' },
    { type: 'protein', value: proteinCount, unit: 'g', label: 'Proteines' },
    { type: 'carb', value: carbohydrateCount, unit: 'g', label: 'Glucides' },
    { type: 'lipid', value: lipidCount, unit: 'g', label: 'Lipides' },
  ];

  return (
    <div className="hero">
      <SideBar />
      <div className="hero-content">
        <ProfilName />
        <div className="dashboard">
          <div className="graphs">
            <CalGraph />
            <DurationGraph />
            <PerfGraph />
            <ScoreGraph />
          </div>
          <div className="nutrients">
            {nutrients.map(nutrient => (
              <NutrientCard
                key={nutrient.type}
                type={nutrient.type}
                value={nutrient.value}
                unit={nutrient.unit}
                label={nutrient.label}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;