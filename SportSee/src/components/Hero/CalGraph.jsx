import React, { useState, useEffect } from 'react';
import { getCurrentUserActivity } from '../../services/api';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

function CalGraph() {
    const [activityData, setActivityData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        const fetchActivityData = async () => {
            try {
                const data = await getCurrentUserActivity();
                const formattedData = data.sessions.map((session, index) => ({
                    day: index + 1,
                    kilogram: session.kilogram,
                    calories: session.calories
                }));
                setActivityData(formattedData);
            } catch (error) {
                console.error('Erreur lors du chargement des données d\'activité:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivityData();
    }, []);

    if (loading || activityData.length === 0) {
        return <div>Chargement...</div>;
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const kg = payload.find(p => p.dataKey === 'kilogram')?.value;
            const cal = payload.find(p => p.dataKey === 'calories')?.value;
            return (
                <div style={{
                    background: '#E60000',
                    color: '#FFFFFF',
                    padding: '8px 10px',
                    fontSize: 12,
                    lineHeight: 1.6,
                }}>
                    <div>{kg}kg</div>
                    <div>{cal}kCal</div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="cal-graph">
            <div className= "cal-graph" style={{ position: 'relative', borderRadius: 5}}>
                <div style={{ position: 'absolute', left: 24, right: 24, top: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="chart-title" style={{ fontWeight: 600, lineHeight: '1.1' }}>Activité quotidienne</div>
                    <div className="chart-legend" style={{ display: 'flex', gap: 24, alignItems: 'center', color: '#74798C', lineHeight: '1.1' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#282D30', display: 'inline-block' }} />
                            Poids (kg)
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E60000', display: 'inline-block' }} />
                            Calories brûlées (kCal)
                        </span>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                        data={activityData}
                        margin={{ top: 56, right: 20, left: 20, bottom: 20 }}
                        onMouseMove={undefined}
                        onMouseLeave={undefined}
                        barCategoryGap="35%"
                        barGap={8}
                    >
                        <CartesianGrid vertical={false} stroke="#DEDEDE" strokeDasharray="3 3" />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#9B9EAC' }}
                            dy={10}
                        />
                        <YAxis
                            yAxisId="left"
                            hide
                            domain={[dataMin => Math.floor(dataMin - 50), dataMax => Math.ceil(dataMax + 50)]}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                            tick={{ fill: '#9B9EAC' }}
                            domain={[dataMin => Math.floor(dataMin - 1), dataMax => Math.ceil(dataMax + 1)]}
                        />
                        <Tooltip cursor={{ fill: '#C4C4C4', opacity: 0.5 }} content={<CustomTooltip />} />
                        <Bar
                            yAxisId="right"
                            dataKey="kilogram"
                            fill="#282D30"
                            radius={[3, 3, 0, 0]}
                            barSize={10}
                            name="kilogram"
                        />
                        <Bar
                            yAxisId="left"
                            dataKey="calories"
                            fill="#E60000"
                            radius={[3, 3, 0, 0]}
                            barSize={10}
                            name="calories"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default CalGraph;
