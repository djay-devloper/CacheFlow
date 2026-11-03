import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { LuDownload } from 'react-icons/lu';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { addThousandSeparators } from '../../utils/helper';

const Reports = () => {
  useUserAuth();
  const [report, setReport] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let active = true;
    const fetchReport = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.REPORTS.GET);
        if (active) setReport(response.data);
      } catch (requestError) {
        console.error('Failed to load finance report:', requestError);
        if (active) setError(requestError.response?.data?.message || 'Could not load the report.');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchReport();
    return () => { active = false; };
  }, []);

  const downloadReport = async () => {
    setError('');
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.DOWNLOAD, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'finance_report.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (requestError) {
      console.error('Failed to download finance report:', requestError);
      setError('Could not download the report.');
    }
  };

  const latestMonth = report?.monthly?.at(-1);
  const previousMonth = report?.monthly?.at(-2);
  const monthlyChange = latestMonth && previousMonth ? latestMonth.net - previousMonth.net : 0;
  const formatAmount = (value) => addThousandSeparators(Number(value || 0).toFixed(2));

  return (
    <DashboardLayout activeMenu="Reports">
      <section className="page-frame">
        <div className="page-header">
          <div>
            <p className="page-eyebrow">Insights</p>
            <h1 className="page-title">Financial reports</h1>
            <p className="page-description">A 12-month view of cash flow and spending categories.</p>
            {report?.coverage && <p className="mt-2 text-xs text-slate-400">Data: {report.coverage.from} – {report.coverage.to}</p>}
          </div>
          <button type="button" onClick={downloadReport} disabled={loading || !report} className="card-btn self-start disabled:opacity-50 sm:self-auto">
            <LuDownload /> Export Excel
          </button>
        </div>

        {error && <p role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

        {loading ? (
          <div className="card p-10 text-center text-sm text-slate-500">Preparing your report…</div>
        ) : report && (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="card p-5"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Income (12 months)</p><p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-600">{formatAmount(report.totals.income)}</p></div>
              <div className="card p-5"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Expenses (12 months)</p><p className="mt-2 text-2xl font-semibold tracking-tight text-rose-600">{formatAmount(report.totals.expenses)}</p></div>
              <div className="card p-5"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Net cash flow</p><p className={`mt-2 text-2xl font-semibold tracking-tight ${report.totals.net >= 0 ? 'text-violet-700' : 'text-rose-600'}`}>{formatAmount(report.totals.net)}</p><p className="mt-1 text-xs text-slate-500">Latest month vs previous: {monthlyChange >= 0 ? '+' : ''}{formatAmount(monthlyChange)}</p></div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
              <div className="card p-5 xl:col-span-3">
                <h2 className="section-title">Monthly cash flow</h2>
                <p className="mb-4 mt-1 text-sm text-slate-500">Income, expenses, and net by calendar month.</p>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={report.monthly} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={1} />
                      <YAxis tickFormatter={addThousandSeparators} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value) => formatAmount(value)} />
                      <Legend />
                      <Line type="monotone" dataKey="income" name="Income" stroke="#059669" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#e11d48" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="net" name="Net" stroke="#6d4aff" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card p-5 xl:col-span-2">
                <h2 className="section-title">Spending by category</h2>
                <p className="mb-4 mt-1 text-sm text-slate-500">Top categories over the same period.</p>
                {report.categories.length ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={report.categories} layout="vertical" margin={{ top: 4, right: 16, left: 10, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                        <XAxis type="number" tickFormatter={addThousandSeparators} tick={{ fontSize: 11 }} />
                        <YAxis type="category" dataKey="category" width={90} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(value) => formatAmount(value)} />
                        <Bar dataKey="total" name="Expenses" radius={[0, 6, 6, 0]}>
                          {report.categories.map((row, index) => <Cell key={row.category} fill={index === 0 ? '#6d4aff' : '#a78bfa'} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : <div className="flex h-80 items-center justify-center text-sm text-slate-500">No expense data in this period yet.</div>}
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="section-title">Monthly totals</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr><th className="px-5 py-3">Month</th><th className="px-5 py-3 text-right">Income</th><th className="px-5 py-3 text-right">Expenses</th><th className="px-5 py-3 text-right">Net cash flow</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[...report.monthly].reverse().map((row) => (
                      <tr key={row.month} className="transition-colors hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-800">{row.label}</td>
                        <td className="px-5 py-3 text-right text-emerald-700">{formatAmount(row.income)}</td>
                        <td className="px-5 py-3 text-right text-rose-700">{formatAmount(row.expenses)}</td>
                        <td className={`px-5 py-3 text-right font-medium ${row.net >= 0 ? 'text-slate-800' : 'text-rose-700'}`}>{formatAmount(row.net)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>
    </DashboardLayout>
  );
};

export default Reports;
