const test = require('node:test');
const assert = require('node:assert/strict');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { askCopilot } = require('../controllers/copilotController');

test('retries with the current Gemini model when the configured model is unavailable', async (t) => {
    const previousApiKey = process.env.GEMINI_API_KEY;
    const previousModel = process.env.GEMINI_MODEL;
    process.env.GEMINI_API_KEY = 'test-api-key';
    process.env.GEMINI_MODEL = 'gemini-2.5-flash';
    t.after(() => {
        if (previousApiKey === undefined) delete process.env.GEMINI_API_KEY;
        else process.env.GEMINI_API_KEY = previousApiKey;
        if (previousModel === undefined) delete process.env.GEMINI_MODEL;
        else process.env.GEMINI_MODEL = previousModel;
    });

    t.mock.method(Income, 'aggregate', async () => []);
    t.mock.method(Expense, 'aggregate', async () => []);
    const requestedModels = [];
    t.mock.method(globalThis, 'fetch', async (url) => {
        const model = new URL(url).pathname.split('/').at(-1).split(':')[0];
        requestedModels.push(model);
        if (requestedModels.length === 1) {
            return new Response(JSON.stringify({ error: { message: 'Model is unavailable' } }), { status: 404 });
        }
        if (requestedModels.length === 2) {
            return new Response(JSON.stringify({ error: { message: 'Model is temporarily unavailable' } }), { status: 503 });
        }
        return new Response(JSON.stringify({
            candidates: [{ content: { parts: [{ text: 'Your report has no recorded activity.' }] } }],
        }), { status: 200 });
    });

    const response = {};
    const res = {
        status(status) {
            response.status = status;
            return this;
        },
        json(body) {
            response.body = body;
            return this;
        },
    };

    await askCopilot({ body: { question: 'Summarize my finances.' }, user: { _id: 'test-user' } }, res);

    assert.deepEqual(requestedModels, ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-3.8-flash']);
    assert.equal(response.status, 200);
    assert.equal(response.body.answer, 'Your report has no recorded activity.');
    assert.deepEqual(response.body.data.totals, { income: 0, expenses: 0, net: 0 });
});
