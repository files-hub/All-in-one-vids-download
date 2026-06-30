const platforms = [
    { name: 'youtube', regex: /(?:youtube\.com|youtu\.be)/i },
    { name: 'facebook', regex: /(?:facebook\.com|fb\.watch|fb\.com)/i },
    { name: 'instagram', regex: /instagram\.com/i },
    { name: 'tiktok', regex: /(?:tiktok\.com|vt\.tiktok\.com)/i },
    { name: 'twitter', regex: /(?:twitter\.com|x\.com)/i },
    { name: 'pinterest', regex: /(?:pinterest\.com|pin\.it)/i },
    { name: 'telegram', regex: /t\.me/i },
    { name: 'linkedin', regex: /linkedin\.com/i },
    { name: 'reddit', regex: /reddit\.com/i },
    { name: 'threads', regex: /threads\.net/i },
    { name: 'likee', regex: /likee\.video/i },
    { name: 'kwai', regex: /kwai\.com/i },
    { name: 'vimeo', regex: /vimeo\.com/i },
    { name: 'dailymotion', regex: /(?:dailymotion\.com|dai\.ly)/i }
];

const detectPlatform = (url) => {
    for (const platform of platforms) {
        if (platform.regex.test(url)) {
            return platform.name;
        }
    }
    return null;
};

module.exports = { detectPlatform };
