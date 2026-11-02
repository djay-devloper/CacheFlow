import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import InfoCard from '../../components/Cards/InfoCard';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import ExpensesList from '../../components/Dashboard/ExpensesList';
import Last30DaysExpenses from '../../components/Dashboard/Last30DaysExpenses';
import IncomeLast60Days from '../../components/Dashboard/IncomeLast60Days';
import IncomeList from '../../components/Dashboard/IncomeList';
import { IoMdCard } from 'react-icons/io';
import { addThousandSeparators } from '../../utils/helper';
import { LuHandCoins,LuWalletMinimal } from 'react-icons/lu';

function Home() {
  useUserAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get(
          API_PATHS.DASHBOARD.GET_DATA
        );

        if (response?.data) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setError(error.response?.data?.message || 'We could not load your latest financial overview.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="mx-auto my-2 max-w-7xl">
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">Your overview</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Your money, in focus.</h1>
            <p className="mt-2 text-sm text-slate-500">A clear view of what’s coming in and going out.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => navigate('/copilot')} className="card-btn border-violet-100 bg-violet-50 text-violet-700 hover:bg-violet-100">Ask AI copilot</button>
            <button type="button" onClick={() => navigate('/reports')} className="card-btn">View reports</button>
          </div>
        </header>

        {error && <p role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

        {loading && !dashboardData ? (
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => <div key={item} className="card h-28 animate-pulse bg-slate-100" />)}
          </div>
        ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <InfoCard
            icon={<IoMdCard />}
            label="Total balance"
            value={addThousandSeparators(dashboardData?.totalBalance || 0)}
             color="bg-primary"
          />
<InfoCard
            icon={<LuWalletMinimal />}
            label="Total income"
            value={addThousandSeparators(dashboardData?.totalIncome || 0)}
             color="bg-green-500"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total expenses"
            value={addThousandSeparators(dashboardData?.totalExpense || 0)}
             color="bg-red-500"
          />
         </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
          <RecentTransactions
            transactions={dashboardData?.lastTransactions || []}
            onSeeMore={() => navigate('/expense')}
          />
          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpense || 0}
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
          <ExpensesList
            expenses={dashboardData?.last30DaysExpense?.transactions || []}
            onSeeMore={() => navigate('/expense')}
          />
          <Last30DaysExpenses
            expenses={dashboardData?.last30DaysExpense?.transactions || []}
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
          <IncomeList
            income={dashboardData?.last60DaysIncome}
            onSeeMore={() => navigate('/income')}
          />
          <IncomeLast60Days income={dashboardData?.last60DaysIncome} />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Home;
