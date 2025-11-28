import React, { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { getCurrentUser } from '../../services/api';

function ScoreGraph({ userId = 12 }) {
  const [scorePercent, setScorePercent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    
    async function load() {
      try {
        setIsLoading(true);
        setLoadError(null);
        
        const data = await getCurrentUser({ signal: controller.signal });
        
        let userInfo = data.user;
        if (!userInfo) {
          userInfo = data;
        }
        let rawScore = userInfo.todayScore;
        if (!rawScore) {
          rawScore = userInfo.score;
        }
        if (!rawScore) {
          rawScore = 0;
        }
        const scoreValue = Math.round(rawScore * 100);
        setScorePercent(scoreValue);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setLoadError(err);
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    load();
    return () => controller.abort();
  }, [userId]);

  const chartData = useMemo(() => [{ name: 'score', value: scorePercent }], [scorePercent]);

  const containerStyle = {
    position: 'relative',
    background: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    aspectRatio: '1 / 1'
  };

  if (isLoading) {
    return <div style={containerStyle}>Chargement…</div>;
  }
  
  if (loadError) {
    return <div style={containerStyle}>Une erreur est survenue.</div>;
  }

  return (
    <div className="score-graph" style={{ position: 'relative', background: '#FBFBFB', borderRadius: 8, padding: 16, aspectRatio: '1 / 1' }}>
      <div className="chart-title" style={{ position: 'absolute', top: 16, left: 16, color: '#74798C', fontWeight: 600 }}>Score</div>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="85%"
            barSize={20}
            data={chartData}
            startAngle={90}
            endAngle={450}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              cornerRadius={20}
              fill="#E60000"
              background
            />
          </RadialBarChart>
        </ResponsiveContainer>
        
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            aspectRatio: '1 / 1',
            background: '#FBFBFB',
            borderRadius: '50%'
          }} />
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div className="score-value" style={{ fontWeight: 700, color: '#282D30' }}>
              {scorePercent}%
            </div>
            <div className="score-sub" style={{ marginTop: 4, color: '#74798C' }}>
              de votre
            </div>
            <div className="score-sub" style={{ color: '#74798C' }}>
              objectif
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScoreGraph;