import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { addThousandSeparators } from '../../utils/helper';

const COLORS = ['#059669', '#0ea5e9', '#f59e0b', '#6d4aff', '#e11d48', '#6366f1'];
const EMPTY_TRANSACTIONS = [];

const IncomeTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
      <p className="text-sm font-medium text-slate-700">{payload[0].name}</p>
      <p className="text-sm font-semibold text-slate-950">${addThousandSeparators(payload[0].value)}</p>
    </div>
  );
};

const IncomeLast60Days = ({ income }) => {
  const transactions = Array.isArray(income?.transactions) ? income.transactions : EMPTY_TRANSACTIONS;
  const totalIncome = income?.total ?? transactions.reduce((sum, txn) => sum + (txn.amount || 0), 0);

  const pieData = useMemo(() => {
    if (transactions.length === 0) return [];

    const grouped = transactions.reduce((acc, txn) => {
      const key = txn.source || 'Other';
      acc[key] = (acc[key] || 0) + (txn.amount || 0);
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const renderCenterContent = () => (
    <g>
      <text x="50%" y="44%" fill="#64748b" textAnchor="middle" fontSize="13" fontWeight="500">
        Income (60d)
      </text>
      <text x="50%" y="58%" fill="#0f172a" textAnchor="middle" fontSize="24" fontWeight="bold">
        ${addThousandSeparators(totalIncome)}
      </text>
    </g>
  );

  return (
    <div className="card p-5 sm:p-6">
      <h5 className="section-title mb-5">Income (last 60 days)</h5>

      {pieData.length === 0 ? (
        <p className="rounded-xl bg-slate-50 py-8 text-center text-sm text-slate-500">No income recorded in the last 60 days</p>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={95}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<IncomeTooltip />} />
                {renderCenterContent()}
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-3 px-2">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                <span className="text-sm font-medium text-slate-600">
                  {item.name}: <span style={{ color: COLORS[index % COLORS.length] }} className="font-bold">${addThousandSeparators(item.value)}</span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default IncomeLast60Days;