const MAX_PAGE_SIZE = 100;
const INDIA_OFFSET_MS = 330 * 60 * 1000;

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const invalidInput = (message) => {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
};

const parseTransactionDate = (value) => {
    const date = new Date(value);
    if (!value || Number.isNaN(date.getTime())) {
        throw invalidInput('A valid date is required');
    }

    if (typeof value === 'string') {
        const calendarDate = value.match(/^(\d{4}-\d{2}-\d{2})/);
        if (calendarDate) {
            const parsedDay = new Date(`${calendarDate[1]}T00:00:00.000Z`);
            if (
                Number.isNaN(parsedDay.getTime())
                || parsedDay.toISOString().slice(0, 10) !== calendarDate[1]
            ) {
                throw invalidInput('A valid date is required');
            }
        }
    }
    return date;
};

const parsePagination = (query = {}) => {
    const page = query.page === undefined ? 1 : Number(query.page);
    const limit = query.limit === undefined ? 10 : Number(query.limit);

    if (!Number.isInteger(page) || page < 1) {
        throw invalidInput('Page must be a positive integer');
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_PAGE_SIZE) {
        throw invalidInput(`Limit must be an integer between 1 and ${MAX_PAGE_SIZE}`);
    }

    return { page, limit };
};

const parseDateRange = (query = {}) => {
    const date = {};

    if (query.from) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(query.from)) {
            throw invalidInput('From date must use YYYY-MM-DD format');
        }
        date.$gte = new Date(`${query.from}T00:00:00.000+05:30`);
        if (Number.isNaN(date.$gte.getTime())) {
            throw invalidInput('From date is invalid');
        }
        if (new Date(date.$gte.getTime() + INDIA_OFFSET_MS).toISOString().slice(0, 10) !== query.from) {
            throw invalidInput('From date is invalid');
        }
    }

    if (query.to) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(query.to)) {
            throw invalidInput('To date must use YYYY-MM-DD format');
        }
        date.$lte = new Date(`${query.to}T23:59:59.999+05:30`);
        if (Number.isNaN(date.$lte.getTime())) {
            throw invalidInput('To date is invalid');
        }
        if (new Date(date.$lte.getTime() + INDIA_OFFSET_MS).toISOString().slice(0, 10) !== query.to) {
            throw invalidInput('To date is invalid');
        }
    }

    if (date.$gte && Number.isNaN(date.$gte.getTime())) {
        throw invalidInput('From date is invalid');
    }

    if (date.$lte && Number.isNaN(date.$lte.getTime())) {
        throw invalidInput('To date is invalid');
    }

    if (date.$gte && date.$lte && date.$gte > date.$lte) {
        throw invalidInput('From date must be on or before To date');
    }

    return date;
};

const buildTransactionFilter = (query = {}, displayField) => {
    const filter = {};
    const date = parseDateRange(query);
    const { page, limit } = parsePagination(query);

    if (Object.keys(date).length) filter.date = date;

    if (query.category) {
        if (typeof query.category !== 'string' || query.category.length > 80) {
            throw invalidInput('Category filter must be 80 characters or fewer');
        }
        filter[displayField] = query.category.trim();
    }

    if (query.search) {
        if (typeof query.search !== 'string' || query.search.length > 100) {
            throw invalidInput('Search must be 100 characters or fewer');
        }
        const search = new RegExp(escapeRegex(query.search.trim()), 'i');
        filter.$or = [
            { [displayField]: search },
            { note: search },
            { tags: search },
        ];
    }

    return { filter, page, limit };
};

const validateTransactionInput = (body = {}, displayField, { partial = false } = {}) => {
    const values = {};
    const has = (key) => Object.prototype.hasOwnProperty.call(body, key);

    if (!partial || has(displayField)) {
        const value = typeof body[displayField] === 'string' ? body[displayField].trim() : '';
        if (!value || value.length > 80) {
            throw invalidInput(`${displayField} is required and must be 80 characters or fewer`);
        }
        values[displayField] = value;
    }

    if (!partial || has('amount')) {
        const amount = Number(body.amount);
        if (!Number.isFinite(amount) || amount <= 0) {
            throw invalidInput('Amount must be a number greater than zero');
        }
        values.amount = amount;
    }

    if (!partial || has('date')) {
        values.date = parseTransactionDate(body.date);
    }

    if (has('icon')) {
        if (typeof body.icon !== 'string' || body.icon.length > 24) {
            throw invalidInput('Icon must be 24 characters or fewer');
        }
        values.icon = body.icon;
    }

    if (has('note')) {
        if (typeof body.note !== 'string' || body.note.length > 500) {
            throw invalidInput('Note must be 500 characters or fewer');
        }
        values.note = body.note.trim();
    }

    if (has('tags')) {
        if (!Array.isArray(body.tags) || body.tags.length > 10) {
            throw invalidInput('Tags must be an array containing at most 10 items');
        }
        const tags = body.tags.map((tag) => {
            if (typeof tag !== 'string' || !tag.trim() || tag.trim().length > 24) {
                throw invalidInput('Each tag must contain 1 to 24 characters');
            }
            return tag.trim();
        });
        values.tags = [...new Set(tags)];
    }

    return values;
};

module.exports = {
    buildTransactionFilter,
    parsePagination,
    validateTransactionInput,
};
