
import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface ComplianceStatusProps {
  score: number;
}

const ComplianceStatus: React.FC<ComplianceStatusProps> = ({ score }) => {
  const data = [{ name: 'Compliance', value: score }];
  const circleSize = 220;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold text-white mb-4 text-center">Compliance Status</h3>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <RadialBarChart
            innerRadius="80%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: '#374151' }}
              dataKey="value"
              cornerRadius={circleSize / 2}
              fill="#3b82f6"
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-current text-white text-4xl font-bold"
            >
              {`${score}%`}
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center mt-4">
          <p className="text-gray-300">Framework: SOC 2</p>
          <button className="mt-2 text-sm text-blue-400 hover:text-blue-300">
              View Details
          </button>
      </div>
    </div>
  );
};

export default ComplianceStatus;
