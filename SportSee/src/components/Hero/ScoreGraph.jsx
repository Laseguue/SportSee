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
        const user = data.user ?? data;
        const rawScore = user?.todayScore ?? user?.score ?? 0;
        setScorePercent(Math.round(rawScore * 100));
      } catch (err) {
        if (err.name !== 'AbortError') setLoadError(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [userId]);

  const chartData = useMemo(() => [{ name: 'score', value: scorePercent }], [scorePercent]);

  if (isLoading) {
    return <div style={{ position: 'relative', background: '#FFFFFF', borderRadius: 8, padding: 16, aspectRatio: '1 / 1' }}>Chargement…</div>;
  }
  if (loadError) {
    return <div style={{ position: 'relative', background: '#FFFFFF', borderRadius: 8, padding: 16, aspectRatio: '1 / 1' }}>Une erreur est survenue.</div>;
  }

  return (
    <div style={{ position: 'relative', background: '#FBFBFB', borderRadius: 8, padding: 16, aspectRatio: '1 / 1' }}>
      <div style={{ position: 'absolute', top: 16, left: 16, color: '#74798C', fontWeight: 600 }}>Score</div>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="85%"
            barSize={12}
            data={chartData}
            startAngle={90}
            endAngle={450}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              cornerRadius={12}
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
            <div style={{ fontSize: 24, fontWeight: 700, color: '#282D30' }}>{scorePercent}%</div>
            <div style={{ marginTop: 4, color: '#74798C', fontSize: 12 }}>de votre</div>
            <div style={{ color: '#74798C', fontSize: 12 }}>objectif</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScoreGraph;
