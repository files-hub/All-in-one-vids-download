const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const downloadRoutes = require('./routes/download');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Security and Utility Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Trust proxy for accurate IP tracking behind Vercel/Cloudflare
app.set('trust proxy', 1);

// Mount Routes
app.use('/', downloadRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`[SERVER] All In One Video Downloader API running on port ${PORT}`);
});

module.exports = app;
