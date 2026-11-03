import React from 'react';
import { LuTrendingUp, LuTrendingDown } from 'react-icons/lu';
import { addThousandSeparators } from '../../utils/helper';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const FinanceTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
      <p className="text-sm font-medium text-slate-700">{payload[0].name}</p>
      <p className="text-sm font-semibold text-slate-950">${addThousandSeparators(payload[0].value)}</p>
    </div>
  );
};

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  // Calculate data for the donut chart
  const chartData = [
    { name: 'Income', value: totalIncome, color: '#059669' },
    { name: 'Expense', value: totalExpense, color: '#e11d48' },
    { name: 'Balance', value: Math.max(totalBalance, 0), color: '#6d4aff' },
  ];

  // Filter out zero values for cleaner chart
  const filteredData = chartData.filter(item => item.value > 0);

  const renderCenterContent = () => {
    return (
      <g>
        <text 
          x="50%" 
          y="45%" 
          fill="#64748b"
          textAnchor="middle" 
          fontSize="13" 
          fontWeight="500"
        >
          Total Balance
        </text>
        <text 
          x="50%" 
          y="58%" 
          fill="#0f172a"
          textAnchor="middle" 
          fontSize="26" 
          fontWeight="bold"
        >
          ${addThousandSeparators(totalBalance)}
        </text>
      </g>
    );
  };

  return (
    <div className="card p-5 sm:p-6">
      <h5 className="section-title mb-5">Financial overview</h5>
      
      {/* Donut Chart */}
      <div className="flex flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={2}
              dataKey="value"
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<FinanceTooltip />} />
            {renderCenterContent()}
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-3 px-2">
        {filteredData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm font-medium text-slate-600">
              {item.name}: <span style={{ color: item.color }} className="font-bold">${addThousandSeparators(item.value)}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FinanceOverview;
