
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// utils/apiPaths.js
export const API_PATHS = {
    AUTH: {
        LOGIN: `/api/v1/auth/login`,
        REGISTER: `/api/v1/auth/register`,
        GET_USER_INFO: `/api/v1/auth/getUser`,
        UPDATE_PROFILE: `/api/v1/auth/profile`,
    },

    DASHBOARD: {
        GET_DATA: `/api/v1/dashboard`,
    },

    REPORTS: {
        GET: `/api/v1/reports`,
        DOWNLOAD: `/api/v1/reports/download-excel`,
    },

    COPILOT: {
        ASK: `/api/v1/copilot/ask`,
    },
    
    INCOME: {
        ADD_INCOME: `/api/v1/income/add`,
        GET_ALL_INCOME: `/api/v1/income/get`,
        UPDATE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
        DELETE_INCOME: (incomeid) => `/api/v1/income/${incomeid}`,
        UPLOAD_RECEIPT: (incomeId) => `/api/v1/income/${incomeId}/receipt`,
        DOWNLOAD_RECEIPT: (incomeId) => `/api/v1/income/${incomeId}/receipt`,
        DOWNLOAD_INCOME: `/api/v1/income/download-excel`,
    },

    EXPENSE: {
        ADD_EXPENSE: `/api/v1/expense/add`,
        GET_ALL_EXPENSE: `/api/v1/expense/get`,
        UPDATE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
        DELETE_EXPENSE: (expenseid) => `/api/v1/expense/${expenseid}`,
        UPLOAD_RECEIPT: (expenseId) => `/api/v1/expense/${expenseId}/receipt`,
        DOWNLOAD_RECEIPT: (expenseId) => `/api/v1/expense/${expenseId}/receipt`,
        DOWNLOAD_EXPENSE: `/api/v1/expense/download-excel`,
    },

    IMAGE: {
        UPLOAD_IMAGE: `/api/v1/auth/upload-image`,
    },
    
};
