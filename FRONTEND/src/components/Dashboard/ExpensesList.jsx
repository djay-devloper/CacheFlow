import React from 'react';
import { LuArrowRight, LuDownload } from 'react-icons/lu';
import moment from 'moment';
import { getCategoryIcon, addThousandSeparators } from '../../utils/helper';
import { formatDateTimeInIndia } from '../../utils/helper';

const EMPTY_EXPENSES = [];

const ExpensesList = ({ expenses, onSeeMore, onDownload, hideSeeAll = false }) => {
  // Ensure expenses is an array
  const expensesArray = Array.isArray(expenses) ? expenses : EMPTY_EXPENSES;
  
  // Keep only last 30 days expenses, sorted by newest first
  const now = React.useMemo(() => moment(), []);
  const recentExpenses = React.useMemo(() => {
    const cutoff = now.clone().subtract(30, 'days');
    const filtered = expensesArray
      .filter(exp => {
        const d = moment(exp.date);
        return d.isValid() && d.isSameOrAfter(cutoff);
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return filtered;
  }, [expensesArray, now]);

  // Calculate total expenses (recent window)
  const totalExpenses = recentExpenses.length > 0 
    ? recentExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
    : 0;

  const showSeeAll = !hideSeeAll && typeof onSeeMore === 'function';

  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h5 className="section-title">Expenses</h5>
        {(showSeeAll || onDownload) && (
          <div className="flex items-center gap-2">
            {showSeeAll && (
              <button className="card-btn text-sm" onClick={onSeeMore}>
                See All <LuArrowRight className="text-sm" />
              </button>
            )}
            {onDownload && (
              <button
                className="card-btn border-violet-100 bg-violet-50 text-sm text-violet-700 hover:bg-violet-100"
                onClick={onDownload}
              >
                <LuDownload className="text-sm" /> Download
              </button>
            )}
          </div>
        )}
      </div>

      <div className="max-h-80 space-y-3 overflow-y-auto">
        {recentExpenses.length > 0 ? (
          recentExpenses.slice(0, 4).map((expense) => (
            <div key={expense._id || expense.id} className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-slate-50">
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-xl">
                <span>{getCategoryIcon(expense.category, 'expense')}</span>
              </div>

              {/* Category and Date */}
              <div className="flex-1 min-w-0">
                <h6 className="text-sm font-medium text-slate-800">{expense.category}</h6>
                <p className="text-xs text-slate-500">{formatDateTimeInIndia(expense.date)}</p>
              </div>

              {/* Amount */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-rose-600">-${addThousandSeparators(expense.amount)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-xl bg-slate-50 py-8 text-center text-sm text-slate-500">No expenses found</p>
        )}
      </div>

      {/* Total Expenses Spent */}
      {recentExpenses.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600">Total spent</span>
            <span className="text-lg font-semibold text-rose-600">${addThousandSeparators(totalExpenses)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesList;
