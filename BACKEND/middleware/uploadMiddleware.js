const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const multer = require('multer');

const uploadDir = path.join(__dirname, '../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, uploadDir);
    },
    filename: function (_req, file, cb) {
        const extension = file.mimetype === 'image/png' ? '.png' : '.jpg';
        cb(null, `${randomUUID()}${extension}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Choose a JPEG or PNG image.'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

const uploadProfileImage = (req, res, next) => {
    upload.single('image')(req, res, (error) => {
        if (!error) {
            next();
            return;
        }

        if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
            res.status(413).json({ message: 'Profile photos must be 5 MB or smaller.' });
            return;
        }

        res.status(400).json({ message: error.message || 'Could not process this profile photo.' });
    });
};

module.exports = uploadProfileImage;
