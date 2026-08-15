require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
].filter(Boolean);

const isAllowedOrigin = (origin) => {
    if (!origin) return true;
    if (allowedOrigins.includes(origin)) return true;
    if (/\.vercel\.app$/i.test(origin)) return true;
    if (/\.onrender\.com$/i.test(origin)) return true;
    if (/localhost(:\d+)?$/i.test(origin)) return true;
    return false;
};

// Middleware to handle CORS
app.use(
    cors({
        origin: (origin, callback) => {
            if (isAllowedOrigin(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error(`Origin ${origin} not allowed by CORS`));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

app.options(/^(.*)$/, cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

    // Handle invalid JSON payloads gracefully
    app.use((err, req, res, next) => {
        if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
            return res.status(400).json({ message: 'Invalid JSON payload' });
        }
        next(err);
    });

     connectDB();
    
     app.use("/api/v1/auth",authRoutes);
     app.use("/api/v1/income",incomeRoutes);
    app.use("/api/v1/expense",expenseRoutes);
    app.use("/api/v1/dashboard",dashboardRoutes);

// Serve uploads folder 

    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));





    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
