const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 Hour
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: "Too many requests from this IP, please try again after an hour."
        });
    }
});

module.exports = apiLimiter;
