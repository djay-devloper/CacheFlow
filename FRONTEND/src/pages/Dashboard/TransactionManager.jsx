import React from 'react';
import { LuDownload, LuPencil, LuPlus, LuReceipt, LuTrash2 } from 'react-icons/lu';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { addThousandSeparators, formatDateTimeInIndia, getIndiaDateTimeInputValue, getIndiaDateTimeISOString } from '../../utils/helper';

const PAGE_SIZE = 10;

const transactionConfig = {
  expense: {
    title: 'Expenses',
    singular: 'expense',
    field: 'category',
    collection: 'expenses',
    getPath: API_PATHS.EXPENSE.GET_ALL_EXPENSE,
    addPath: API_PATHS.EXPENSE.ADD_EXPENSE,
    updatePath: API_PATHS.EXPENSE.UPDATE_EXPENSE,
    deletePath: API_PATHS.EXPENSE.DELETE_EXPENSE,
    uploadReceiptPath: API_PATHS.EXPENSE.UPLOAD_RECEIPT,
    downloadReceiptPath: API_PATHS.EXPENSE.DOWNLOAD_RECEIPT,
    downloadPath: API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
    icons: ['🍔', '🛒', '🚗', '🛍️', '🎬', '🏥', '📚', '📄'],
  },
  income: {
    title: 'Income',
    singular: 'income',
    field: 'source',
    collection: 'incomes',
    getPath: API_PATHS.INCOME.GET_ALL_INCOME,
    addPath: API_PATHS.INCOME.ADD_INCOME,
    updatePath: API_PATHS.INCOME.UPDATE_INCOME,
    deletePath: API_PATHS.INCOME.DELETE_INCOME,
    uploadReceiptPath: API_PATHS.INCOME.UPLOAD_RECEIPT,
    downloadReceiptPath: API_PATHS.INCOME.DOWNLOAD_RECEIPT,
    downloadPath: API_PATHS.INCOME.DOWNLOAD_INCOME,
    icons: ['💼', '💻', '🏢', '📈', '🎉', '💳', '🏠', '🚀'],
  },
};

const getErrorMessage = (error, fallback) => error.response?.data?.message || fallback;

const TransactionManager = ({ type }) => {
  useUserAuth();
  const config = transactionConfig[type];
  const [transactions, setTransactions] = React.useState([]);
  const [pagination, setPagination] = React.useState({ page: 1, limit: PAGE_SIZE, total: 0, pages: 0 });
  const [summaryTotal, setSummaryTotal] = React.useState(0);
  const [filters, setFilters] = React.useState({ search: '', category: '', from: '', to: '' });
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState('');
  const [error, setError] = React.useState('');
  const [formError, setFormError] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTransaction, setEditingTransaction] = React.useState(null);
  const [receiptFile, setReceiptFile] = React.useState(null);
  const [formData, setFormData] = React.useState({
    category: '',
    source: '',
    amount: '',
    date: getIndiaDateTimeInputValue(),
    icon: '',
    note: '',
    tags: '',
  });

  const fetchTransactions = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get(config.getPath, {
        params: {
          ...filters,
          page,
          limit: PAGE_SIZE,
        },
      });
      setTransactions(response.data?.[config.collection] || []);
      setPagination(response.data?.pagination || { page: 1, limit: PAGE_SIZE, total: 0, pages: 0 });
      setSummaryTotal(response.data?.summary?.total || 0);
    } catch (requestError) {
      console.error(`Failed to load ${config.title.toLowerCase()}:`, requestError);
      setError(getErrorMessage(requestError, `Could not load ${config.title.toLowerCase()}.`));
    } finally {
      setLoading(false);
    }
  }, [config, filters, page]);

  React.useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const resetForm = () => {
    setEditingTransaction(null);
    setReceiptFile(null);
    setFormError('');
    setFormData({
      category: '',
      source: '',
      amount: '',
      date: getIndiaDateTimeInputValue(),
      icon: '',
      note: '',
      tags: '',
    });
  };

  const openAddForm = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditForm = (transaction) => {
    setEditingTransaction(transaction);
    setReceiptFile(null);
    setFormError('');
    setFormData({
      category: transaction.category || '',
      source: transaction.source || '',
      amount: String(transaction.amount ?? ''),
      date: getIndiaDateTimeInputValue(new Date(transaction.date)),
      icon: transaction.icon || '',
      note: transaction.note || '',
      tags: (transaction.tags || []).join(', '),
    });
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setFormError('');

    const name = formData[config.field].trim();
    const amount = Number(formData.amount);
    if (!name || !Number.isFinite(amount) || amount <= 0 || !formData.date) {
      setFormError(`Enter a ${config.field}, a positive amount, and a date.`);
      return;
    }

    const body = {
      [config.field]: name,
      amount,
      date: getIndiaDateTimeISOString(formData.date),
      icon: formData.icon,
      note: formData.note.trim(),
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    };

    setSaving(true);
    setError('');
    let receiptError = '';
    try {
      const response = editingTransaction
        ? await axiosInstance.put(config.updatePath(editingTransaction._id), body)
        : await axiosInstance.post(config.addPath, body);
      const savedTransaction = response.data?.[config.singular];

      if (receiptFile && savedTransaction?._id) {
        const upload = new FormData();
        upload.append('receipt', receiptFile);
        try {
          await axiosInstance.post(config.uploadReceiptPath(savedTransaction._id), upload, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } catch (uploadError) {
          console.error('Transaction saved but receipt upload failed:', uploadError);
          receiptError = `Transaction saved, but its receipt could not be uploaded: ${getErrorMessage(uploadError, 'please try again.')}`;
        }
      }

      setIsModalOpen(false);
      resetForm();
      await fetchTransactions();
      if (receiptError) setError(receiptError);
    } catch (requestError) {
      console.error(`Failed to save ${config.singular}:`, requestError);
      setFormError(getErrorMessage(requestError, `Could not save this ${config.singular}.`));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (transaction) => {
    if (!window.confirm(`Delete this ${config.singular}? This cannot be undone.`)) return;
    setDeletingId(transaction._id);
    setError('');
    try {
      await axiosInstance.delete(config.deletePath(transaction._id));
      await fetchTransactions();
    } catch (requestError) {
      console.error(`Failed to delete ${config.singular}:`, requestError);
      setError(getErrorMessage(requestError, `Could not delete this ${config.singular}.`));
    } finally {
      setDeletingId('');
    }
  };

  const downloadBlob = (data, filename) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(config.downloadPath, { params: filters, responseType: 'blob' });
      downloadBlob(response.data, `${type}_report.xlsx`);
    } catch (downloadError) {
      console.error(`Failed to download ${config.singular} report:`, downloadError);
      setError('Could not download the report.');
    }
  };

  const handleReceiptDownload = async (transaction) => {
    try {
      const response = await axiosInstance.get(config.downloadReceiptPath(transaction._id), { responseType: 'blob' });
      downloadBlob(response.data, transaction.receipt.originalName || 'receipt');
    } catch (downloadError) {
      console.error('Failed to download receipt:', downloadError);
      setError(getErrorMessage(downloadError, 'Could not download the receipt.'));
    }
  };

  const onFilterSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setFilters({
      search: data.get('search').trim(),
      category: data.get('category').trim(),
      from: data.get('from'),
      to: data.get('to'),
    });
    setPage(1);
  };

  if (!config) return null;

  return (
    <DashboardLayout activeMenu={type === 'expense' ? 'Expense' : 'Income'}>
      <section className="mx-auto w-full max-w-7xl py-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{config.title}</h1>
            <p className="mt-1 text-sm text-gray-500">Search, filter, edit, and export your {config.title.toLowerCase()}.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleDownload} className="card-btn">
              <LuDownload /> Export Excel
            </button>
            <button type="button" onClick={openAddForm} className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700">
              <LuPlus /> Add {config.singular}
            </button>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="card p-5">
            <p className="text-sm text-gray-500">Matching transactions</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{pagination.total}</p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-gray-500">Total for current filters</p>
            <p className="mt-1 text-2xl font-bold text-purple-700">{addThousandSeparators(summaryTotal)}</p>
          </div>
        </div>

        <form key={JSON.stringify(filters)} onSubmit={onFilterSubmit} className="card mb-5 grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <label className="text-sm text-gray-600">
            Search
            <input name="search" defaultValue={filters.search} maxLength="100" placeholder="Category, note, or tag" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900" />
          </label>
          <label className="text-sm text-gray-600">
            Category / source
            <input name="category" defaultValue={filters.category} maxLength="80" placeholder={type === 'expense' ? 'e.g. Food' : 'e.g. Salary'} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900" />
          </label>
          <label className="text-sm text-gray-600">
            From
            <input name="from" type="date" defaultValue={filters.from} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900" />
          </label>
          <label className="text-sm text-gray-600">
            To
            <input name="to" type="date" defaultValue={filters.to} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900" />
          </label>
          <div className="flex items-end gap-2">
            <button type="submit" className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700">Apply</button>
            <button type="button" onClick={() => { setFilters({ search: '', category: '', from: '', to: '' }); setPage(1); }} className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Clear</button>
          </div>
        </form>

        {error && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-sm text-gray-500">Loading transactions…</div>
          ) : transactions.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-medium text-gray-700">No {config.title.toLowerCase()} match these filters.</p>
              <p className="mt-1 text-sm text-gray-500">Add a transaction or adjust your search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-3">{type === 'expense' ? 'Category' : 'Source'}</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Notes / tags</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                    <th className="px-5 py-3">Receipt</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-medium text-gray-900">
                        <span className="mr-2">{transaction.icon || '•'}</span>
                        {transaction[config.field]}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">{formatDateTimeInIndia(transaction.date)}</td>
                      <td className="max-w-64 px-5 py-4">
                        {transaction.note && <p className="truncate text-gray-700" title={transaction.note}>{transaction.note}</p>}
                        {(transaction.tags || []).length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {transaction.tags.map((tag) => <span key={tag} className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-700">{tag}</span>)}
                          </div>
                        )}
                        {!transaction.note && !(transaction.tags || []).length && <span className="text-gray-400">—</span>}
                      </td>
                      <td className={`whitespace-nowrap px-5 py-4 text-right font-semibold ${type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                        {type === 'expense' ? '−' : '+'}{addThousandSeparators(transaction.amount)}
                      </td>
                      <td className="px-5 py-4">
                        {transaction.receipt?.filename ? (
                          <button type="button" onClick={() => handleReceiptDownload(transaction)} className="inline-flex items-center gap-1 text-purple-700 hover:underline" title={transaction.receipt.originalName}>
                            <LuReceipt /> Download
                          </button>
                        ) : <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => openEditForm(transaction)} aria-label={`Edit ${config.singular}`} className="rounded p-2 text-gray-600 hover:bg-purple-50 hover:text-purple-700"><LuPencil /></button>
                          <button type="button" onClick={() => handleDelete(transaction)} disabled={deletingId === transaction._id} aria-label={`Delete ${config.singular}`} className="rounded p-2 text-gray-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"><LuTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 text-sm">
            <span className="text-gray-500">Page {page} of {Math.max(pagination.pages, 1)}</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1 || loading} className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-40">Previous</button>
              <button type="button" onClick={() => setPage((current) => Math.min(pagination.pages, current + 1))} disabled={page >= pagination.pages || loading} className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-40">Next</button>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="presentation">
            <div role="dialog" aria-modal="true" aria-labelledby="transaction-form-title" className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
              <button type="button" onClick={closeForm} aria-label="Close dialog" className="absolute right-4 top-3 text-2xl text-gray-500 hover:text-gray-900">×</button>
              <h2 id="transaction-form-title" className="mb-1 text-xl font-semibold text-gray-900">{editingTransaction ? 'Edit' : 'Add'} {config.singular}</h2>
              <p className="mb-5 text-sm text-gray-500">Record details and optionally attach a receipt.</p>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <span className="mb-2 block text-sm font-medium text-gray-700">Icon</span>
                  <div className="grid grid-cols-8 gap-2">
                    {config.icons.map((icon) => (
                      <button key={icon} type="button" onClick={() => setFormData((current) => ({ ...current, icon }))} aria-label={`Choose ${icon}`} className={`rounded-lg border p-2 text-xl ${formData.icon === icon ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'}`}>{icon}</button>
                    ))}
                  </div>
                </div>
                <label className="block text-sm text-gray-700">
                  {type === 'expense' ? 'Category' : 'Source'}
                  <input required maxLength="80" value={formData[config.field]} onChange={(event) => setFormData((current) => ({ ...current, [config.field]: event.target.value }))} placeholder={type === 'expense' ? 'e.g. Food, transport' : 'e.g. Salary, freelance'} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" />
                </label>
                <label className="block text-sm text-gray-700">
                  Amount
                  <input required type="number" min="0.01" step="0.01" value={formData.amount} onChange={(event) => setFormData((current) => ({ ...current, amount: event.target.value }))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" />
                </label>
                <label className="block text-sm text-gray-700">
                  Date and time
                  <input required type="datetime-local" value={formData.date} onChange={(event) => setFormData((current) => ({ ...current, date: event.target.value }))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" />
                </label>
                <label className="block text-sm text-gray-700">
                  Note
                  <textarea maxLength="500" rows="2" value={formData.note} onChange={(event) => setFormData((current) => ({ ...current, note: event.target.value }))} placeholder="Optional details" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" />
                </label>
                <label className="block text-sm text-gray-700">
                  Tags <span className="text-gray-400">(comma-separated, up to 10)</span>
                  <input value={formData.tags} onChange={(event) => setFormData((current) => ({ ...current, tags: event.target.value }))} placeholder="work, recurring" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" />
                </label>
                <label className="block text-sm text-gray-700">
                  Receipt <span className="text-gray-400">(JPEG, PNG, WebP, or PDF; max 5 MB)</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(event) => setReceiptFile(event.target.files?.[0] || null)} className="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-purple-50 file:px-3 file:py-2 file:text-purple-700" />
                  {editingTransaction?.receipt?.originalName && <span className="mt-1 block text-xs text-gray-500">Current receipt: {editingTransaction.receipt.originalName}</span>}
                </label>
                {formError && <p role="alert" className="text-sm text-red-600">{formError}</p>}
                <button type="submit" disabled={saving} className="w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60">{saving ? 'Saving…' : editingTransaction ? 'Save changes' : `Add ${config.singular}`}</button>
              </form>
            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default TransactionManager;
