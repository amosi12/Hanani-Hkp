const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

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

// 🎵 PLAY COMMAND (send audio directly)
cmd({
    pattern: "play",
    alias: ["ytplay", "music"],
    react: "🎵",
    desc: "Download YouTube audio",
    category: "download",
    use: ".play <song name>"
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Please provide a song name!");

        const search = await yts(q);
        const video = search.videos[0];
        if (!video) return reply("❌ No results found!");

        const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.videoId)}&format=mp3`;
        const response = await axios.get(apiURL);
        const data = response.data;

        if (!data.downloadLink) return reply("❌ Failed to get audio link!");

        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: buildCaption('audio', video)
        }, { quoted: mek });

        await conn.sendMessage(from, {
            audio: { url: data.downloadLink },
            mimetype: 'audio/mpeg',
            fileName: `${video.title}.mp3`
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("❌ Error while processing!");
    }
});

// 🎶 SONG COMMAND (send audio as document)
cmd({
    pattern: "song",
    alias: ["ytsong"],
    react: "🎶",
    desc: "Download YouTube song as document",
    category: "download",
    use: ".song <song name>"
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Please provide a song name!");

        const search = await yts(q);
        const video = search.videos[0];
        if (!video) return reply("❌ No results found!");

        const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.videoId)}&format=mp3`;
        const response = await axios.get(apiURL);
        const data = response.data;

        if (!data.downloadLink) return reply("❌ Failed to get song link!");

        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: buildCaption('song', video)
        }, { quoted: mek });

        await conn.sendMessage(from, {
            document: { url: data.downloadLink },
            mimetype: 'audio/mpeg',
            fileName: `${video.title}.mp3`
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("❌ Error while processing!");
    }
});

// 🎬 VIDEO COMMAND
cmd({
    pattern: "video",
    alias: ["ytvideo"],
    react: "🎬",
    desc: "Download YouTube video",
    category: "download",
    use: ".video <video name>"
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Please provide a video name!");

        const search = await yts(q);
        const video = search.videos[0];
        if (!video) return reply("❌ No results found!");

        const apiURL = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(video.videoId)}&format=mp4`;
        const response = await axios.get(apiURL);
        const data = response.data;

        if (!data.downloadLink) return reply("❌ Failed to get video link!");

        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: buildCaption('video', video)
        }, { quoted: mek });

        await conn.sendMessage(from, {
            video: { url: data.downloadLink },
            mimetype: 'video/mp4',
            fileName: `${video.title}.mp4`
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("❌ Error while processing!");
    }
});
