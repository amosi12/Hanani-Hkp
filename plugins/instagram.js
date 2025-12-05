const { cmd } = require("../command");
const axios = require("axios");
const config = require("../config");

cmd({
    pattern: "ig",
    alias: ["instagram", "igdl", "insta"],
    desc: "Download Instagram videos/audios",
    category: "download",
    react: "📸",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {

    try {
        const igUrl = q && q.trim();
        if (!igUrl) return reply("Please send an Instagram link!");
        if (!igUrl.includes("https://"))
            return reply("Send a valid Instagram URL.");

        // API MPYA (Stable)
        const apiUrl = `https://bk9.fun/download/ig?url=${encodeURIComponent(igUrl)}`;

        const { data } = await axios.get(apiUrl);

        if (!data || !data.result || !data.result.video)
            return reply("Failed to fetch Instagram media. Try another link.");

        const video = data.result.video;
        const audio = data.result.audio;

        const caption = `
*${config.BOT || 'Instagram Downloader'} IG Downloader*
|__________________________|
|       *MEDIA FOUND*
|_________________________|
| REPLY WITH A NUMBER BELOW
|_________________________|
|____  *VIDEO OPTIONS*  ____
|-᳆  1. Play Video
|-᳆  2. Video File
|_________________________|
|____  *AUDIO OPTIONS*  ____
|-᳆  3. Audio Only
|-᳆  4. Audio Document
|__________________________|
`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: video.thumb || "" },
            caption,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363382023564830@newsletter",
                    newsletterName: "BMB TECH UPDATES",
                    serverMessageId: Math.floor(100000 + Math.random() * 900000),
                }
            }
        }, { quoted: mek });

        // LISTENER
        conn.ev.on("messages.upsert", async update => {
            const msg = update.messages[0];
            if (!msg.message?.extendedTextMessage) return;

            const text = msg.message.extendedTextMessage.text.trim();
            const repliedTo = msg.message.extendedTextMessage.contextInfo?.stanzaId;

            if (repliedTo === sentMsg.key.id) {

                await conn.sendMessage(from, {
                    react: { text: "⬇️", key: msg.key }
                });

                switch (text) {
                    case "1":
                        await conn.sendMessage(from, {
                            video: { url: video.url },
                            caption: `*${config.BOT || "IG"}* - Playing Video`
                        }, { quoted: msg });
                        break;

                    case "2":
                        await conn.sendMessage(from, {
                            document: { url: video.url },
                            mimetype: "video/mp4",
                            fileName: `IG_${Date.now()}.mp4`
                        }, { quoted: msg });
                        break;

                    case "3":
                        await conn.sendMessage(from, {
                            audio: { url: audio },
                            mimetype: "audio/mpeg",
                            caption: `*Instagram Audio*`
                        }, { quoted: msg });
                        break;

                    case "4":
                        await conn.sendMessage(from, {
                            document: { url: audio },
                            mimetype: "audio/mpeg",
                            fileName: `IG_${Date.now()}.mp3`
                        }, { quoted: msg });
                        break;

                    default:
                        await conn.sendMessage(from, {
                            text: "Choose a number between 1 - 4 only."
                        }, { quoted: msg });
                        break;
                }

                await conn.sendMessage(from, {
                    react: { text: "✅", key: msg.key }
                });
            }
        });

    } catch (error) {
        reply("Instagram download failed: " + error.message);
    }

});
