const axios = require('axios');
const yts = require("yt-search");

async function baseApiUrl() {
    try {
        const base = await axios.get('https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json');
        return base.data.api;
    } catch (error) {
        console.error("❌ Failed to fetch base API URL:", error.message);
        return null;
    }
}

(async () => {
    global.apis = global.apis || {};
    global.apis.diptoApi = await baseApiUrl();
})();

async function getStreamFromURL(url, pathName) {
    try {
        const response = await axios.get(url, { responseType: "stream" });
        response.data.path = pathName;
        return response.data;
    } catch (err) {
        console.error("❌ Error fetching stream:", err.message);
        throw err;
    }
}

global.utils = global.utils || {};
global.utils.getStreamFromURL = global.utils.getStreamFromURL || getStreamFromURL;

function getVideoID(url) {
    const regex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

const config = {
    name: "sing2",
    author: "Mesbah Saxx",
    version: "1.2.1",
    role: 0,
    Description: "Search and download YouTube songs as MP3",
    prefix: true,
    category: "media",
    countDown: 5,
};

async function onStart({ api, args, event }) {
    try {
        if (!global.apis.diptoApi) {
            return api.sendMessage("⚠️ Base API URL not available. Try again later.", event.threadID, event.messageID);
        }

        let videoID;
        const url = args[0];
        let waitingMessage;

        if (url && (url.includes("youtube.com") || url.includes("youtu.be"))) {
            videoID = getVideoID(url);
            if (!videoID) {
                return api.sendMessage("❌ Invalid YouTube URL.", event.threadID, event.messageID);
            }
        } else {
            const songName = args.join(' ');
            waitingMessage = await api.sendMessage(`🔍 Searching for "${songName}"...`, event.threadID);
            const searchResults = await yts(songName);
            const videos = searchResults.videos.slice(0, 50);

            if (videos.length === 0) {
                return api.sendMessage("❌ No results found.", event.threadID, event.messageID);
            }

            const videoData = videos[Math.floor(Math.random() * videos.length)];
            videoID = videoData.videoId;
        }

        const { data: { title, quality, downloadLink } } = await axios.get(`${global.apis.diptoApi}/ytDl3?link=${videoID}&format=mp3`);

        if (waitingMessage) api.unsendMessage(waitingMessage.messageID);

        const tinyUrlResponse = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(downloadLink)}`);
        const shortenedLink = tinyUrlResponse.data;

        await api.sendMessage({
            body: `🎶 **Title:** ${title}\n🔊 **Quality:** ${quality}\n\n📥 **Download:** ${shortenedLink}`,
            attachment: await global.utils.getStreamFromURL(downloadLink, `${title}.mp3`)
        }, event.threadID, event.messageID);

    } catch (error) {
        console.error("❌ Error in onStart function:", error.message);
        api.sendMessage(`❌ Error: ${error.message || "Something went wrong."}`, event.threadID, event.messageID);
    }
}

module.exports = {
    config,
    onStart,
    run: onStart
};
