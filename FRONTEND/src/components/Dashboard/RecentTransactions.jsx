import React from 'react';
import { LuArrowRight } from 'react-icons/lu';
import { getCategoryIcon, addThousandSeparators } from '../../utils/helper';
import { formatDateTimeInIndia } from '../../utils/helper';

const RecentTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">Activity</p>
          <h5 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Recent transactions</h5>
        </div>

        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="space-y-4">
        {transactions?.slice(0, 5)?.map((item) => {
          const isExpense = item.type === 'expense';
          const title = isExpense ? (item.category || 'Expense') : (item.source || 'Income');
          const icon = getCategoryIcon(title, item.type);
          const amountText = `${isExpense ? '-' : '+'}$${addThousandSeparators(item.amount || 0)}`;

          return (
            <div key={item._id || item.id} className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-50 sm:gap-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${isExpense ? 'bg-rose-50' : 'bg-emerald-50'}`}>
                <span>{icon}</span>
              </div>

              <div className="flex-1 min-w-0">
                <h6 className="text-sm font-semibold text-slate-800">{title}</h6>
                <p className="mt-0.5 text-xs text-slate-500">{formatDateTimeInIndia(item.date)}</p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className={`text-sm font-semibold ${isExpense ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {amountText}
                </p>
              </div>
            </div>
          );
        })}
        {!transactions?.length && <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">Your latest activity will appear here.</p>}
      </div>
    </div>
  );
};

export default RecentTransactions;
