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
      <section className="page-frame max-w-4xl">
        <div className="page-header">
          <div>
            <p className="page-eyebrow">AI assistant</p>
            <h1 className="page-title">Finance copilot</h1>
            <p className="page-description">Ask questions about your recorded income and expenses.</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-xl text-violet-700">
            <LuSparkles />
          </div>
        </div>

        <div className="card p-5 sm:p-6">
          <form onSubmit={askQuestion}>
            <label htmlFor="copilot-question" className="mb-2 block text-sm font-medium text-slate-800">What would you like to understand?</label>
            <textarea
              id="copilot-question"
              maxLength="500"
              rows="3"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="For example: How much did I spend in my top category last month?"
              className="field-control min-h-28 resize-y px-4 py-3"
            />
            <div className="mt-3 flex flex-col-reverse items-start justify-between gap-3 sm:flex-row sm:items-center">
              <span className="text-xs text-slate-500">Answers use your last 12 months of data and may take a few seconds.</span>
              <button type="submit" disabled={loading} className="button-primary">
                <LuSparkles /> {loading ? 'Thinking…' : 'Ask copilot'}
              </button>
            </div>
          </form>

          {!answer && !loading && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Try asking</p>
              <div className="flex flex-col gap-2">
                {suggestions.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => setQuestion(suggestion)} className="rounded-xl border border-slate-200 px-4 py-3 text-left text-sm text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-800">{suggestion}</button>
                ))}
              </div>
            </div>
          )}

          {loading && <div role="status" className="mt-6 rounded-xl bg-violet-50 p-5 text-sm text-violet-800">Reviewing your finance data…</div>}
          {error && <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

          {answer && (
            <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50/60 p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="section-title">Your answer</h2>
                <span className="text-right text-xs text-slate-500">Data window: {answer.coverage.from} – {answer.coverage.to}</span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-800">{answer.answer}</p>
              <details className="mt-5 border-t border-violet-100 pt-4">
                <summary className="cursor-pointer text-sm font-medium text-violet-800">See the report data used</summary>
                <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-100 bg-white p-3"><span className="block text-xs text-slate-500">Income</span><strong>{addThousandSeparators(answer.data.totals.income)}</strong></div>
                  <div className="rounded-xl border border-slate-100 bg-white p-3"><span className="block text-xs text-slate-500">Expenses</span><strong>{addThousandSeparators(answer.data.totals.expenses)}</strong></div>
                  <div className="rounded-xl border border-slate-100 bg-white p-3"><span className="block text-xs text-slate-500">Net cash flow</span><strong>{addThousandSeparators(answer.data.totals.net)}</strong></div>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-slate-700">
                  {answer.data.categories.map((category) => <li key={category.category} className="flex justify-between gap-4"><span>{category.category}</span><span>{addThousandSeparators(category.total)}</span></li>)}
                </ul>
              </details>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs leading-5 text-slate-500">AI-generated explanations can be inaccurate and are not professional financial advice. Verify important figures against the report.</p>
      </section>
    </DashboardLayout>
  );
};

export default Copilot;
