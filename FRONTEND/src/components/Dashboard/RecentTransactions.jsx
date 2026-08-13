import React from 'react';
import { LuArrowRight } from 'react-icons/lu';
import moment from 'moment';
import { getCategoryIcon, addThousandSeparators } from '../../utils/helper';

const RecentTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h5 className="text-lg font-semibold">Recent Transactions</h5>

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
            <div key={item._id || item.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
              <div className="w-10 h-10 flex items-center justify-center text-xl bg-gray-100 rounded-full flex-shrink-0">
                <span>{icon}</span>
              </div>

              <div className="flex-1 min-w-0">
                <h6 className="text-sm font-medium text-gray-800">{title}</h6>
                <p className="text-xs text-gray-500">{moment(item.date).format('DD MMM YYYY')}</p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className={`text-sm font-semibold ${isExpense ? 'text-red-600' : 'text-green-600'}`}>
                  {amountText}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentTransactions;
