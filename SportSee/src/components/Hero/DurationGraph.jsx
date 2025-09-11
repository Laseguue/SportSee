import React, { useState, useEffect } from 'react';
import { getCurrentUserAverageSessions } from '../../services/api';
import {
    LineChart,
    Line,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    Rectangle,
} from 'recharts';

function DurationGraph() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const sessionData = await getCurrentUserAverageSessions();
                const formattedData = sessionData.sessions.map((session) => ({
                    day: session.day,
                    duration: session.sessionLength,
                    label: ['L','M','M','J','V','S','D'][session.day - 1],
                }));
                setData(formattedData);
            } catch (error) {
                console.error('Erreur lors du chargement des données de sessions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSessionData();
    }, []);

    if (loading || data.length === 0) {
        return <div>Chargement...</div>;
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: '#FFFFFF', padding: '6px 8px', fontSize: 12, color: '#000' }}>
                    {payload[0].value} min
                </div>
            );
        }
        return null;
    };

    const CustomCursor = (props) => {
        const { points, width, height } = props;
        const { x } = points[0];
        return (
            <Rectangle
                fill="rgba(0,0,0,0.1)"
                x={x}
                y={0}
                width={width - x}
                height={height}
            />
        );
    };

    return (
        <div className="duration-graph" style={{
            background: '#FF0101',
            borderRadius: 8,
            padding: 17,
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
            aspectRatio: '1 / 1',
        }}>
            {activeIndex !== null && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: `${activeIndex * (100 / data.length)}%`,
                        width: `${100 / data.length}%`,
                        background: 'rgba(0,0,0,0.1)',
                        pointerEvents: 'none',
                    }}
                />
            )}
            <div style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 180, fontSize: 15 }}>
                Durée moyenne des sessions
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                    onMouseMove={(s) => {
                        const i = s?.activeTooltipIndex ?? null;
                        if (i !== activeIndex) setActiveIndex(i);
                      }}
                    onMouseLeave={() => setActiveIndex(null)}
                >
                    <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.6)' }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Line
                        type="monotone"
                        dataKey="duration"
                        stroke="#FFFFFF"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, stroke: 'rgba(255,255,255,0.3)', strokeWidth: 8, fill: '#FFFFFF' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default DurationGraph;
