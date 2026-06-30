const { validateUrl } = require('../utils/validator');
const { detectPlatform } = require('../utils/detectPlatform');
const { processDownload } = require('../utils/downloader');
const { recordRequest, recordDownload, getStats } = require('../utils/stats');
const { logRequest } = require('../utils/logger');

// Homepage
exports.home = (req, res) => {
    res.json({
        success: true,
        name: "All In One Video Downloader API",
        version: "1.0.0",
        developer: "Code Craft",
        status: "Online"
    });
};

// Download Endpoint
exports.downloadVideo = async (req, res, next) => {
    const { url } = req.query;
    const ip = req.ip || req.connection.remoteAddress;

    try {
        // Track unique IP & increment requests
        recordRequest(ip);

        // Validate URL
        if (!url || !validateUrl(url)) {
            logRequest(ip, "Unknown", url || "No URL provided", false);
            return res.status(400).json({
                success: false,
                message: "Unsupported or Invalid URL"
            });
        }

        // Detect Platform
        const platform = detectPlatform(url);
        if (!platform) {
            logRequest(ip, "Unknown", url, false);
            return res.status(400).json({
                success: false,
                message: "Unsupported or Invalid URL"
            });
        }

        // Process Download Logic
        const downloadData = await processDownload(platform, url);

        // Update successful stats & logs
        recordDownload();
        logRequest(ip, platform, url, true);

        // Return Data
        return res.json(downloadData);

    } catch (error) {
        logRequest(ip, detectPlatform(url) || "Unknown", url, false);
        next(error);
    }
};

// Stats Endpoint
exports.getStatsEndpoint = (req, res) => {
    const statsData = getStats();
    res.json({
        success: true,
        ...statsData
    });
};
