import React, { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts';
import { getCurrentUserPerformance } from '../../services/api';

function PerfGraph({ userId = 12 }) {
  const [perf, setPerf] = useState({ kind: {}, data: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setIsLoading(true);
        setLoadError(null);
        const p = await getCurrentUserPerformance({ signal: controller.signal });
        setPerf(p);
      } catch (err) {
        if (err.name !== 'AbortError') setLoadError(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [userId]);

  const frLabel = {
    cardio: 'Cardio',
    energy: 'Energie',
    endurance: 'Endurance',
    strength: 'Force',
    speed: 'Vitesse',
    intensity: 'Intensité',
  };

  const chartData = useMemo(() => {
    return (perf.data || []).map(item => ({
      subject: frLabel[perf.kind?.[item.kind]] ?? String(perf.kind?.[item.kind] ?? ''),
      value: item.value ?? 0,
    }));
  }, [perf]);

  if (isLoading) {
    return <div style={{ background: '#2E2E2E', borderRadius: 8, padding: 12, color: '#FFFFFF', aspectRatio: '1 / 1' }}>Chargement…</div>;
  }
  if (loadError) {
    return <div style={{ background: '#2E2E2E', borderRadius: 8, padding: 12, color: '#FFFFFF', aspectRatio: '1 / 1' }}>Une erreur est survenue.</div>;
  }

  return (
    <div style={{ background: '#2E2E2E', borderRadius: 8, padding: 12, color: '#FFFFFF', aspectRatio: '1 / 1' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid gridType="polygon" stroke="#FFFFFF" strokeOpacity={0.5} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#FFFFFF', fontSize: 11 }}
            tickLine={false}
          />
          <Radar name="performance" dataKey="value" stroke="#E60000" fill="#E60000" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PerfGraph;
