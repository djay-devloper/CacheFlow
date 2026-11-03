import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const EMPTY_EXPENSES = [];

const ExpenseTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
      <p className="text-xs text-slate-500">{payload[0].payload.date}</p>
      <p className="text-sm font-semibold text-violet-600">${payload[0].value}</p>
    </div>
  );
};

const Last30DaysExpenses = ({ expenses }) => {
  // Ensure expenses is an array
  const expensesArray = Array.isArray(expenses) ? expenses : EMPTY_EXPENSES;
  
  // Process data for the last 30 days
  const chartData = useMemo(() => {
    const last30Days = {};
    const today = moment();

    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = today.clone().subtract(i, 'days');
      const dayKey = date.format('DD MMM');
      last30Days[dayKey] = 0;
    }

    // Add only expense amounts (filter by type) to corresponding days
    expensesArray.forEach((expense) => {
      if (expense.type === 'expense' || !expense.type) { // Include if type is 'expense' or undefined
        const expenseDate = moment(expense.date);
        if (expenseDate.isBetween(today.clone().subtract(30, 'days'), today, null, '[]')) {
          const dayKey = expenseDate.format('DD MMM');
          if (Object.hasOwn(last30Days, dayKey)) {
            last30Days[dayKey] += expense.amount;
          }
        }
      }
    });

    // Convert to array preserving daily order (oldest -> newest)
    const dailyData = Object.entries(last30Days).map(([date, amount]) => ({ date, amount }));

    return dailyData;
  }, [expensesArray]);

  return (
    <div className="card p-5 sm:p-6">
      <h5 className="section-title mb-5">Last 30 days expenses</h5>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ExpenseTooltip />} />
          <Bar 
            dataKey="amount" 
            fill="#8b75f8"
            radius={[8, 8, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Last30DaysExpenses;
