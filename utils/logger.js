const fs = require('fs');
const path = require('path');

const LOGS_FILE = path.join(process.cwd(), 'data', 'logs.json');

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Load existing logs safely
let logsCache = [];
try {
    if (fs.existsSync(LOGS_FILE)) {
        logsCache = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8'));
    }
} catch (e) {
    logsCache = [];
}

const logRequest = (ip, platform, url, isSuccess) => {
    const now = new Date();
    
    const logEntry = {
        ip: ip || "Unknown",
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0],
        platform: platform,
        url: url,
        status: isSuccess ? "Success" : "Failed"
    };

    logsCache.unshift(logEntry);

    // Keep only the last 1000 logs to prevent file bloat
    if (logsCache.length > 1000) {
        logsCache.pop();
    }

    try {
        fs.writeFileSync(LOGS_FILE, JSON.stringify(logsCache, null, 2), 'utf-8');
    } catch (err) {
        console.error(`Error writing logs:`, err.message);
    }
};

module.exports = { logRequest };
