const { getFinanceReport } = require('../services/financeAnalytics');

const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash';
const FALLBACK_GEMINI_MODEL = 'gemini-3.5-flash';

const createPrompt = (question, report) => [
    'You are CacheFlow, a careful personal-finance data explainer.',
    'Answer the user using only the supplied JSON data. Never invent transactions, amounts, dates, or trends.',
    'If the data does not contain enough information, say so and state the coverage window.',
    'Do not provide investment, tax, credit, or other professional financial advice.',
    'Keep the answer concise. State relevant month/category and amounts. No currency is configured; do not add a currency name or symbol.',
    'Monthly category lists contain only the top 10 categories for that month. If a category is absent, do not claim its spending was zero; say the provided breakdown does not include it.',
    `Coverage: ${report.coverage.from} through ${report.coverage.to}.`,
    `Finance data: ${JSON.stringify(report)}`,
    `User question: ${question}`,
].join('\n\n');

exports.askCopilot = async (req, res) => {
    const question = req.body?.question;
    if (typeof question !== 'string' || !question.trim() || question.trim().length > 500) {
        return res.status(400).json({ message: 'Question must contain 1 to 500 characters' });
    }
    if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({ message: 'AI copilot is not configured on the server' });
    }

    try {
        const report = await getFinanceReport(req.user._id);
        const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
        const requestModel = (selectedModel) => fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(selectedModel)}:generateContent`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': process.env.GEMINI_API_KEY,
                },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{ text: 'You summarize personal finance data accurately and respect the provided data boundary.' }],
                    },
                    contents: [{ role: 'user', parts: [{ text: createPrompt(question.trim(), report) }] }],
                    generationConfig: { temperature: 0.2, maxOutputTokens: 500 },
                }),
                signal: AbortSignal.timeout(12000),
            }
        );
        let response = await requestModel(model);
        if (response.status === 404 && model !== DEFAULT_GEMINI_MODEL) {
            console.warn(`Gemini model ${model} is unavailable; retrying with ${DEFAULT_GEMINI_MODEL}`);
            response = await requestModel(DEFAULT_GEMINI_MODEL);
        }
        if (response.status === 503 && model !== FALLBACK_GEMINI_MODEL) {
            console.warn(`Gemini model ${model} is temporarily unavailable; retrying with ${FALLBACK_GEMINI_MODEL}`);
            response = await requestModel(FALLBACK_GEMINI_MODEL);
        }

        if (!response.ok) {
            console.error('Gemini request failed with status:', response.status);
            const isTemporarilyUnavailable = response.status === 429 || response.status === 503;
            return res.status(isTemporarilyUnavailable ? 503 : 502).json({
                message: response.status === 429
                    ? 'AI copilot is temporarily rate-limited; try again shortly'
                    : response.status === 503
                        ? 'AI copilot is temporarily unavailable; try again shortly'
                        : 'AI copilot could not complete the request',
            });
        }

        const result = await response.json();
        const answer = result.candidates?.[0]?.content?.parts
            ?.map((part) => part.text || '')
            .join('')
            .trim();
        if (!answer) {
            console.error('Gemini returned no answer text');
            return res.status(502).json({ message: 'AI copilot returned an empty response' });
        }

        res.status(200).json({
            answer,
            coverage: report.coverage,
            data: report,
        });
    } catch (error) {
        if (error.name === 'TimeoutError' || error.name === 'AbortError') {
            return res.status(504).json({ message: 'AI copilot timed out; please try again' });
        }
        console.error('Error answering finance copilot question:', error);
        res.status(500).json({ message: 'Could not answer the finance question' });
    }
};
