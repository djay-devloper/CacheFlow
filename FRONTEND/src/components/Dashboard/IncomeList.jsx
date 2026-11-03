import React from 'react';
import moment from 'moment';
import { LuArrowRight, LuDownload } from 'react-icons/lu';
import { addThousandSeparators, getCategoryIcon } from '../../utils/helper';
import { formatDateTimeInIndia } from '../../utils/helper';

const EMPTY_INCOME = [];

const IncomeList = ({ income, onSeeMore, onDownload, hideSeeAll = false }) => {
  const incomeArray = Array.isArray(income?.transactions) ? income.transactions : EMPTY_INCOME;

  // Keep only last 60 days income, newest first
  const now = React.useMemo(() => moment(), []);
  const recentIncome = React.useMemo(() => {
    const cutoff = now.clone().subtract(60, 'days');
    return incomeArray
      .filter(txn => {
        const d = moment(txn.date);
        return d.isValid() && d.isSameOrAfter(cutoff);
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [incomeArray, now]);

  const totalIncome = recentIncome.reduce((sum, txn) => sum + (txn.amount || 0), 0);

  const showSeeAll = !hideSeeAll && typeof onSeeMore === 'function';

  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h5 className="section-title">Income</h5>
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
        {recentIncome.length > 0 ? (
          recentIncome.slice(0, 4).map((txn) => (
            <div key={txn._id || txn.id} className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-slate-50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                <span>{getCategoryIcon(txn.source, 'income')}</span>
              </div>

              <div className="flex-1 min-w-0">
                <h6 className="text-sm font-medium text-slate-800">{txn.source || 'Income'}</h6>
                <p className="text-xs text-slate-500">{formatDateTimeInIndia(txn.date)}</p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-emerald-600">+${addThousandSeparators(txn.amount)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-xl bg-slate-50 py-8 text-center text-sm text-slate-500">No income found</p>
        )}
      </div>

      {recentIncome.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600">Total income (60d)</span>
            <span className="text-lg font-semibold text-emerald-600">${addThousandSeparators(totalIncome)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeList;