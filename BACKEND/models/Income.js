const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    icon: { type: String },
    source: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    note: { type: String, trim: true, maxlength: 500, default: '' },
    tags: { type: [String], default: [] },
    receipt: {
        filename: { type: String },
        originalName: { type: String },
        contentType: { type: String },
        uploadedAt: { type: Date },
    },
}, { timestamps: true });

module.exports = mongoose.model('Income', incomeSchema);