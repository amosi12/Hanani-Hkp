const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

const BASE_URL = 'https://noobs-api.top';
const BOT_NAME = 'B.M.B-TECH';

// Helper to build caption
const buildCaption = (type, video) => {
    const banner = type === "video" ? `${BOT_NAME} VIDEO PLAYER` : `${BOT_NAME} SONG PLAYER`;
    return (
        `*${banner}*\n\n` +
        `╭───────────────◆\n` +
        `│⿻ *Title:* ${video.title}\n` +
        `│⿻ *Duration:* ${video.timestamp}\n` +
        `│⿻ *Views:* ${video.views.toLocaleString()}\n` +
        `│⿻ *Uploaded:* ${video.ago}\n` +
        `│⿻ *Channel:* ${video.author.name}\n` +
        `╰────────────────◆\n\n` +
        `🔗 ${video.url}`
    );
};

// ======================= PLAY (audio as voice) =======================
cmd({
    pattern: "play",
    alias: ["music"],
    react: '🎵',
    desc: "Download YouTube audio",
    category: "Search",
    use: ".play <song name>"
}, async (msg, zk, { args }) => {
    const query = args.join(" ");
    if (!query) return zk.sendMessage(msg.chat, { text: "Please provide a song name or keyword." }, { quoted: msg });

    try {
        const search = await yts(query);
        const video = search.videos[0];
        if (!video) return zk.sendMessage(msg.chat, { text: "No results found." }, { quoted: msg });

        const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.videoId)}&format=mp3`;
        const { data } = await axios.get(apiURL);

        if (!data.downloadLink) return zk.sendMessage(msg.chat, { text: "Failed to fetch download link." }, { quoted: msg });

        await zk.sendMessage(msg.chat, {
            image: { url: video.thumbnail },
            caption: buildCaption("audio", video)
        }, { quoted: msg });

        await zk.sendMessage(msg.chat, {
            audio: { url: data.downloadLink },
            mimetype: 'audio/mpeg',
            fileName: `${video.title}.mp3`
        }, { quoted: msg });

    } catch (e) {
        console.error("PLAY ERROR:", e);
        zk.sendMessage(msg.chat, { text: "An error occurred while processing your request." }, { quoted: msg });
    }
});

// ======================= SONG (audio as document) =======================
cmd({
    pattern: "song",
    alias: ["mp3"],
    react: '🎶',
    desc: "Download YouTube song as document",
    category: "Search",
    use: ".song <song name>"
}, async (msg, zk, { args }) => {
    const query = args.join(" ");
    if (!query) return zk.sendMessage(msg.chat, { text: "Please provide a song name or keyword." }, { quoted: msg });

    try {
        const search = await yts(query);
        const video = search.videos[0];
        if (!video) return zk.sendMessage(msg.chat, { text: "No results found." }, { quoted: msg });

        const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.videoId)}&format=mp3`;
        const { data } = await axios.get(apiURL);

        if (!data.downloadLink) return zk.sendMessage(msg.chat, { text: "Failed to fetch download link." }, { quoted: msg });

        await zk.sendMessage(msg.chat, {
            image: { url: video.thumbnail },
            caption: buildCaption("song", video)
        }, { quoted: msg });

        await zk.sendMessage(msg.chat, {
            document: { url: data.downloadLink },
            mimetype: 'audio/mpeg',
            fileName: `${video.title}.mp3`
        }, { quoted: msg });

    } catch (e) {
        console.error("SONG ERROR:", e);
        zk.sendMessage(msg.chat, { text: "An error occurred while processing your request." }, { quoted: msg });
    }
});

// ======================= VIDEO (mp4) =======================
cmd({
    pattern: "video",
    alias: ["mp4"],
    react: '🎬',
    desc: "Download YouTube video",
    category: "Search",
    use: ".video <video name>"
}, async (msg, zk, { args }) => {
    const query = args.join(" ");
    if (!query) return zk.sendMessage(msg.chat, { text: "Please provide a video name or keyword." }, { quoted: msg });

    try {
        const search = await yts(query);
        const video = search.videos[0];
        if (!video) return zk.sendMessage(msg.chat, { text: "No results found." }, { quoted: msg });

        const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.videoId)}&format=mp4`;
        const { data } = await axios.get(apiURL);

        if (!data.downloadLink) return zk.sendMessage(msg.chat, { text: "Failed to fetch download link." }, { quoted: msg });

        await zk.sendMessage(msg.chat, {
            image: { url: video.thumbnail },
            caption: buildCaption("video", video)
        }, { quoted: msg });

        await zk.sendMessage(msg.chat, {
            video: { url: data.downloadLink },
            mimetype: 'video/mp4',
            fileName: `${video.title}.mp4`
        }, { quoted: msg });

    } catch (e) {
        console.error("VIDEO ERROR:", e);
        zk.sendMessage(msg.chat, { text: "An error occurred while processing your request." }, { quoted: msg });
    }
});
