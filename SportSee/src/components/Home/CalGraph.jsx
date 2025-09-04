import React, { useState } from 'react';
import { USER_ACTIVITY } from '../../../public/data';
import {
    BarChart,
    Bar,
    LabelList,
    Rectangle,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';

const RoundedBar = (props) => {
  const { fill, x, y, width, height } = props;
  const radius = 10;

  return (
    <path
      d={`M${x},${y + radius}
          A${radius},${radius} 0 0 1 ${x + radius},${y}
          H${x + width - radius}
          A${radius},${radius} 0 0 1 ${x + width},${y + radius}
          V${y + height - radius}
          A${radius},${radius} 0 0 1 ${x + width - radius},${y + height}
          H${x + radius}
          A${radius},${radius} 0 0 1 ${x},${y + height - radius}Z`}
      fill={fill}
    />
  );
};

function CalGraph() {
    const activityData = USER_ACTIVITY.find(user => user.userId === 12).sessions.map((session, index) => ({
        day: index + 1,
        kilogram: session.kilogram,
        calories: session.calories
    }));
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <div className="cal-graph">
            <BarChart
                width={600}
                height={300}
                data={activityData}
                onMouseMove={(state) => {
                    if (state.isTooltipActive) {
                        setActiveIndex(state.activeTooltipIndex);
                    }
                }}
                onMouseLeave={() => setActiveIndex(null)}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" orientation="left" stroke="#000" domain={[69, 71]} />
                <YAxis yAxisId="right" orientation="right" stroke="#ff0000" domain={[300, 356]} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="kilogram" fill="#000" name="Poids (kg)" shape={<RoundedBar />}>
                    <LabelList dataKey="kilogram" position="top" />
                </Bar>
                <Bar yAxisId="right" dataKey="calories" fill="#ff0000" name="Calories brûlées (kCal)" shape={<RoundedBar />}>
                    <LabelList dataKey="calories" position="top" />
                </Bar>
                {activityData.map((entry, index) => (
                    activeIndex === index && (
                        <Rectangle
                            key={`highlight-${index}`}
                            x={index * 60 + 10}
                            y={0}
                            width={60}
                            height={300}
                            fill="rgba(211, 211, 211, 0.5)"
                        />
                    )
                ))}
            </BarChart>
        </div>
    );
}

export default CalGraph;