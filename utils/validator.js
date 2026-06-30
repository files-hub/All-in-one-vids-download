const validateUrl = (urlString) => {
    try {
        const parsedUrl = new URL(urlString);
        return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch (e) {
        return false;
    }
};

module.exports = { validateUrl };
