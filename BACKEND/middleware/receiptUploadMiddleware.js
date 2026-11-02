const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const multer = require('multer');

const receiptDir = path.join(__dirname, '../private-receipts');
fs.mkdirSync(receiptDir, { recursive: true });

const extensions = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'application/pdf': '.pdf',
};

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, receiptDir),
    filename: (_req, file, callback) => callback(null, `${randomUUID()}${extensions[file.mimetype] || ''}`),
});

module.exports = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, callback) => {
        if (!extensions[file.mimetype]) {
            callback(new Error('Receipt must be a JPEG, PNG, WebP, or PDF file'));
            return;
        }
        callback(null, true);
    },
});
