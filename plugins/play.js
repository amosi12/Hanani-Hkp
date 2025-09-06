const config = require('../config');
const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js'); 
const fetch = require('node-fetch');

const BASE_URL = 'https://noobs-api.top';

// 🎬 VIDEO COMMAND
cmd({ 
    pattern: "video", 
    alias: ["video", "ytv"], 
    react: "🎥", 
    desc: "Download Youtube video", 
    category: "main", 
    use: '.video < Yt url or Name >', 
    filename: __filename 
}, async (conn, mek, m, { from, q, reply }) => { 
    try { 
        if (!q) return await reply("*Please provide a YouTube URL or Video Name.*");
        
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("No results found!");
        
        let yts = yt.results[0];  
        let apiUrl = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(yts.url)}&format=mp4`;
        
        let response = await fetch(apiUrl);
        let data = await response.json();
        
        if (!data.downloadLink) {
            return reply("Failed to fetch the video. Please try again later.");
        }
        
        let ytmsg = `╔═══〔 *NOVA-XMD* 〕═══❒
║╭───────────────◆  
║│ *VIDEO DOWNLOADER*
║╰───────────────◆
╚══════════════════❒
╔══════════════════❒
║ ⿻ *Title:*  ${yts.title}
║ ⿻ *Duration:*  ${yts.timestamp}
║ ⿻ *Views:*  ${yts.views}
║ ⿻ *Author:*  ${yts.author.name}
║ ⿻ *Link:*  ${yts.url}
╚══════════════════❒`;

        // Send video details
        await conn.sendMessage(from, { image: { url: yts.image || '' }, caption: ytmsg }, { quoted: mek });
        
        // Send video file
        await conn.sendMessage(from, { video: { url: data.downloadLink }, mimetype: "video/mp4" }, { quoted: mek });
        
        // Send document file
        await conn.sendMessage(from, { 
            document: { url: data.downloadLink }, 
            mimetype: "video/mp4", 
            fileName: `${yts.title}.mp4`, 
            caption: `*${yts.title}*\n> *© Powered by NOVA-XMD 💙*`
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("An error occurred. Please try again later.");
    }
});  
       
// 🎵 MP3 / PLAY COMMAND
cmd({ 
     pattern: "mp3", 
     alias: ["yta", "play"], 
     react: "🎶", 
     desc: "Download Youtube song",
     category: "main", 
     use: '.mp3 < Yt url or Name >', 
     filename: __filename 
}, async (conn, mek, m, { from, q, reply }) => { 
    try { 
        if (!q) return await reply("*Please provide a YouTube URL or Song Name.*");

        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("No results found!");
    
        let yts = yt.results[0];  
        let apiUrl = `${BASE_URL}/dipto/ytDl3?link=${encodeURIComponent(yts.url)}&format=mp3`;
        
        let response = await fetch(apiUrl);
        let data = await response.json();
    
        if (!data.downloadLink) {
            return reply("Failed to fetch the audio. Please try again later.");
        }
    
        let ytmsg = `╔═══〔 *NOVA-XMD* 〕═══❒
║╭───────────────◆  
║│ *SONG DOWNLOADER*
║╰───────────────◆
╚══════════════════❒
╔══════════════════❒
║ ⿻ *Title:*  ${yts.title}
║ ⿻ *Duration:*  ${yts.timestamp}
║ ⿻ *Views:*  ${yts.views}
║ ⿻ *Author:*  ${yts.author.name}
║ ⿻ *Link:*  ${yts.url}
╚══════════════════❒`;

        // Send song details
        await conn.sendMessage(from, { image: { url: yts.image || '' }, caption: ytmsg }, { quoted: mek });
    
        // Send audio file
        await conn.sendMessage(from, { audio: { url: data.downloadLink }, mimetype: "audio/mpeg" }, { quoted: mek });
    
        // Send document file
        await conn.sendMessage(from, { 
            document: { url: data.downloadLink }, 
            mimetype: "audio/mpeg", 
            fileName: `${yts.title}.mp3`, 
            caption: `> *© Powered by NOVA-XMD 💙*`
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("An error occurred. Please try again later.");
    }
});
