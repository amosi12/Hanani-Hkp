const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

const BASE_URL = 'https://noobs-api.top';
const BOT_NAME = 'B.M.B-TECH';

// Helper to build caption
const buildCaption = (type, video) => {
    const banner = type === "video" ? `${BOT_NAME} VIDEO PLAYER` : `${BOT_NAME} SONG PLAYER`;
    return `
╭━〔 ${banner} 〕━⬣
┃
┃ ❖ Title: ${video.title}
┃ ❖ Channel: ${video.author.name}
┃ ❖ Duration: ${video.timestamp}
┃ ❖ Views: ${video.views}
┃ ❖ Uploaded: ${video.ago}
┃
╰───────────────⬣`;
};

// PLAY (Search & Send First Song as MP3)
cmd({
    pattern: "play",
    alias: ["music"],
    react: "🎶",
    desc: "Play a song from YouTube",
    category: "download",
    use: ".play <song name>"
}, async (conn, mek, m, { from, q }) => {
    if (!q) return conn.sendMessage(from, { text: "Please provide a song name." }, { quoted: mek });

    try {
        const search = await yts(q);
        const video = search.videos[0];
        if (!video) return conn.sendMessage(from, { text: "No results found." }, { quoted: mek });

        const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.url)}&format=mp3`;
        const response = await axios.get(apiURL);
        const audioUrl = response.data.result.downloadUrl;

        await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            ptt: false,
            caption: buildCaption("song", video)
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        conn.sendMessage(from, { text: "❌ Error: Something went wrong." }, { quoted: mek });
    }
});

// SONG (Alias for Play)
cmd({
    pattern: "song",
    react: "🎵",
    desc: "Download a song from YouTube",
    category: "download",
    use: ".song <song name>"
}, async (conn, mek, m, { from, q }) => {
    if (!q) return conn.sendMessage(from, { text: "Please provide a song name." }, { quoted: mek });

    try {
        const search = await yts(q);
        const video = search.videos[0];
        if (!video) return conn.sendMessage(from, { text: "No results found." }, { quoted: mek });

        const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.url)}&format=mp3`;
        const response = await axios.get(apiURL);
        const audioUrl = response.data.result.downloadUrl;

        await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            ptt: false,
            caption: buildCaption("song", video)
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        conn.sendMessage(from, { text: "❌ Error: Something went wrong." }, { quoted: mek });
    }
});

// VIDEO (Download YouTube Video)
cmd({
    pattern: "video",
    react: "🎬",
    desc: "Download a video from YouTube",
    category: "download",
    use: ".video <video name>"
}, async (conn, mek, m, { from, q }) => {
    if (!q) return conn.sendMessage(from, { text: "Please provide a video name." }, { quoted: mek });

    try {
        const search = await yts(q);
        const video = search.videos[0];
        if (!video) return conn.sendMessage(from, { text: "No results found." }, { quoted: mek });

        const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.url)}&format=mp4`;
        const response = await axios.get(apiURL);
        const videoUrl = response.data.result.downloadUrl;

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption: buildCaption("video", video)
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        conn.sendMessage(from, { text: "❌ Error: Something went wrong." }, { quoted: mek });
    }
});
