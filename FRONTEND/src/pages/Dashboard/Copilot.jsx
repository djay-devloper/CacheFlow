import React from 'react';
import { LuSparkles } from 'react-icons/lu';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { addThousandSeparators } from '../../utils/helper';

const suggestions = [
  'How did my income and spending change month over month?',
  'Which categories account for most of my spending?',
  'Summarize my cash flow over the last year.',
];

const Copilot = () => {
  useUserAuth();
  const [question, setQuestion] = React.useState('');
  const [answer, setAnswer] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const askQuestion = async (event) => {
    event.preventDefault();
    if (!question.trim()) {
      setError('Enter a question to get started.');
      return;
    }

    setLoading(true);
    setError('');
    setAnswer(null);
    try {
      const response = await axiosInstance.post(
        API_PATHS.COPILOT.ASK,
        { question: question.trim() },
        { timeout: 30000 }
      );
      setAnswer(response.data);
    } catch (requestError) {
      console.error('Finance copilot request failed:', requestError);
      setError(requestError.response?.data?.message || 'Could not get an answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout activeMenu="AI Copilot">
      <section className="mx-auto w-full max-w-4xl py-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-xl bg-purple-100 p-3 text-xl text-purple-700"><LuSparkles /></div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Finance copilot</h1>
            <p className="mt-1 text-sm text-gray-500">Ask questions about your recorded income and expenses.</p>
          </div>
        </div>

        <div className="card p-5 sm:p-6">
          <form onSubmit={askQuestion}>
            <label htmlFor="copilot-question" className="mb-2 block text-sm font-medium text-gray-800">What would you like to understand?</label>
            <textarea
              id="copilot-question"
              maxLength="500"
              rows="3"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="For example: How much did I spend in my top category last month?"
              className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
            <div className="mt-3 flex flex-col-reverse items-start justify-between gap-3 sm:flex-row sm:items-center">
              <span className="text-xs text-gray-400">Answers use your last 12 months of data and may take a few seconds.</span>
              <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60">
                <LuSparkles /> {loading ? 'Thinking…' : 'Ask copilot'}
              </button>
            </div>
          </form>

          {!answer && !loading && (
            <div className="mt-6 border-t border-gray-100 pt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Try asking</p>
              <div className="flex flex-col gap-2">
                {suggestions.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => setQuestion(suggestion)} className="rounded-lg border border-gray-100 px-3 py-2 text-left text-sm text-gray-700 hover:border-purple-200 hover:bg-purple-50">{suggestion}</button>
                ))}
              </div>
            </div>
          )}

          {loading && <div role="status" className="mt-6 rounded-xl bg-purple-50 p-5 text-sm text-purple-800">Reviewing your finance data…</div>}
          {error && <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          {answer && (
            <div className="mt-6 rounded-xl border border-purple-100 bg-purple-50/60 p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="font-semibold text-gray-900">Your answer</h2>
                <span className="text-right text-xs text-gray-500">Data window: {answer.coverage.from} – {answer.coverage.to}</span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">{answer.answer}</p>
              <details className="mt-5 border-t border-purple-100 pt-4">
                <summary className="cursor-pointer text-sm font-medium text-purple-800">See the report data used</summary>
                <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                  <div className="rounded-lg bg-white p-3"><span className="block text-xs text-gray-500">Income</span><strong>{addThousandSeparators(answer.data.totals.income)}</strong></div>
                  <div className="rounded-lg bg-white p-3"><span className="block text-xs text-gray-500">Expenses</span><strong>{addThousandSeparators(answer.data.totals.expenses)}</strong></div>
                  <div className="rounded-lg bg-white p-3"><span className="block text-xs text-gray-500">Net cash flow</span><strong>{addThousandSeparators(answer.data.totals.net)}</strong></div>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-gray-700">
                  {answer.data.categories.map((category) => <li key={category.category} className="flex justify-between gap-4"><span>{category.category}</span><span>{addThousandSeparators(category.total)}</span></li>)}
                </ul>
              </details>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">AI-generated explanations can be inaccurate and are not professional financial advice. Verify important figures against the report.</p>
      </section>
    </DashboardLayout>
  );
};

export default Copilot;
