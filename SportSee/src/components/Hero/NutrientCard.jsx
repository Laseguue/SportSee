import React from 'react';

function NutrientCard({ type, value, unit, label }) {
  const getIcon = () => {
    switch (type) {
      case 'calorie':
        return '🔥';
      case 'protein':
        return '🥩';
      case 'carb':
        return '🍞';
      case 'lipid':
        return '🧈';
      default:
        return '📊';
    }
  };

  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val.toLocaleString('fr-FR');
    }
    return val;
  };

  return (
    <div className="nutrient-card">
      <div className="nutrient-icon">
        <span className="icon">{getIcon()}</span>
      </div>
      <div className="nutrient-content">
        <div className="nutrient-value">
          {formatValue(value)}{unit}
        </div>
        <div className="nutrient-label">
          {label}
        </div>
      </div>
    </div>
  );
}

export default NutrientCard;
