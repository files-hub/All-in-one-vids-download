const fs = require('fs');
const path = require('path');

const STATS_FILE = path.join(process.cwd(), 'data', 'stats.json');
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Read JSON Helper
const readJSON = (filePath, defaultStructure) => {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
    } catch (err) {
        console.error(`Error reading ${filePath}:`, err.message);
    }
    return defaultStructure;
};

// Write JSON Helper
const writeJSON = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
        console.error(`Error writing to ${filePath}:`, err.message);
    }
};

// Internal Cache (Prevents excessive disk IO and handles Vercel statelessness gracefully)
let stats = readJSON(STATS_FILE, {
    total_requests: 0,
    total_downloads: 0,
    total_users: 0,
    today_requests: 0,
    today_downloads: 0,
    last_date: new Date().toDateString()
});

let users = readJSON(USERS_FILE, []);

const resetDailyStats = () => {
    const today = new Date().toDateString();
    if (stats.last_date !== today) {
        stats.today_requests = 0;
        stats.today_downloads = 0;
        stats.last_date = today;
    }
};

const recordRequest = (ip) => {
    resetDailyStats();
    stats.total_requests += 1;
    stats.today_requests += 1;

    // Track Unique User IP
    if (!users.includes(ip)) {
        users.push(ip);
        stats.total_users = users.length;
        writeJSON(USERS_FILE, users);
    }
    writeJSON(STATS_FILE, stats);
};

const recordDownload = () => {
    resetDailyStats();
    stats.total_downloads += 1;
    stats.today_downloads += 1;
    writeJSON(STATS_FILE, stats);
};

const getStats = () => {
    resetDailyStats();
    // Calculate uptime in days safely
    const uptimeSeconds = process.uptime();
    const uptimeDays = Math.floor(uptimeSeconds / (3600 * 24));

    return {
        total_requests: stats.total_requests,
        total_downloads: stats.total_downloads,
        total_users: stats.total_users,
        today_requests: stats.today_requests,
        today_downloads: stats.today_downloads,
        uptime: `${uptimeDays} Days`
    };
};

module.exports = { recordRequest, recordDownload, getStats };
