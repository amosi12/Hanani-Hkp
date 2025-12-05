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
        if (!igUrl) return reply("Please send an Instagram video link!");
        if (!igUrl.includes("https://") || !igUrl.includes("instagram.com"))
            return reply("Please send a valid Instagram link.");

        const apiUrl = `https://apis-keith.vercel.app/download/instagramdl?url=${encodeURIComponent(igUrl)}`;

        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data.status || !data.result || !data.result.downloadUrl)
            return reply("Failed to fetch video. The post might be private or unavailable.");

        const downloadUrl = data.result.downloadUrl;
        const isVideo = data.result.type === "mp4";

        const caption = `
*${config.BOT || 'Instagram Downloader'} Instagram Downloader*
|__________________________|
|       *MEDIA TYPE*
       ${isVideo ? 'Video' : 'Unknown'}
|_________________________|
| REPLY WITH A NUMBER BELOW
|_________________________|
|____  *VIDEO OPTIONS*  ____
|-᳆  1. Play Video
|-᳆  2. Download Video
|_________________________|
|____  *AUDIO OPTIONS*  ____
|-᳆  3. Audio Only
|-᳆  4. Audio Document
|__________________________|
`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: config.URL || "" },
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
                            video: { url: downloadUrl },
                            caption: `*${config.BOT || "Instagram Downloader"}* - Playing Video`
                        }, { quoted: msg });
                        break;

                    case "2":
                        await conn.sendMessage(from, {
                            document: { url: downloadUrl },
                            mimetype: "video/mp4",
                            fileName: `${config.BOT || "Instagram"}_${Date.now()}.mp4`,
                            caption: `*${config.BOT || "Instagram Downloader"}* - Download Video`
                        }, { quoted: msg });
                        break;

                    case "3":
                        await conn.sendMessage(from, {
                            audio: { url: downloadUrl },
                            mimetype: "audio/mpeg",
                            caption: `*${config.BOT || "Instagram Downloader"}* - Audio`
                        }, { quoted: msg });
                        break;

                    case "4":
                        await conn.sendMessage(from, {
                            document: { url: downloadUrl },
                            mimetype: "audio/mpeg",
                            fileName: `${config.BOT || "Instagram"}_${Date.now()}.mp3`,
                            caption: `*${config.BOT || "Instagram Downloader"}* - Audio Document`
                        }, { quoted: msg });
                        break;

                    default:
                        await conn.sendMessage(from, {
                            text: "Please choose a number between 1 - 4 only."
                        }, { quoted: msg });
                        break;
                }

                await conn.sendMessage(from, {
                    react: { text: "✅", key: msg.key }
                });
            }
        });

    } catch (error) {
        reply(`Failed to download media. Error: ${error.message}\nTry another link or ensure the post is public.`);
    }

});
