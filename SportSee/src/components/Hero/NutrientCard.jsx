import React from 'react';

function NutrientCard({ type, value, unit, label }) {
  const iconMap = {
    calorie: '🔥',
    protein: '🥩',
    carb: '🍞',
    lipid: '🧈',
  };

  const getIcon = () => {
    const icon = iconMap[type];
    if (icon) {
      return icon;
    }
    return '📊';
  };

  const formatValue = (val) => {
    const isNumber = typeof val === 'number';
    if (isNumber) {
      return val.toLocaleString('fr-FR');
    }
    return val;
  };

  const formattedValue = formatValue(value);

  return (
    <div className="nutrient-card">
      <div className="nutrient-icon">
        <span className="icon">{getIcon()}</span>
      </div>
      <div className="nutrient-content">
        <div className="nutrient-value">
          {formattedValue}{unit}
        </div>
        <div className="nutrient-label">
          {label}
        </div>
      </div>
    </div>
  );
}

export default NutrientCard;