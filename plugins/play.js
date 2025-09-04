const { cmd } = require("../command");
const { ytsearch } = require("@dark-yasiya/yt-dl.js");

//=========== YOUTUBE VIDEO (MP4) ===========//
cmd({
  pattern: "mp4",
  alias: ["video"],
  react: '🎥',
  desc: "Download YouTube video",
  category: "main",
  use: ".mp4 < Yt url or Name >",
  filename: __filename
}, async (conn, m, store, { from, prefix, quoted, q, reply }) => {
  try {
    if (!q) return reply("Please provide a YouTube URL or song name.");

    const search = await ytsearch(q);
    if (search.results.length < 1) return reply("No results found!");

    let vid = search.results[0];
    let api = "https://apis.davidcyriltech.my.id/download/ytmp4?url=" + encodeURIComponent(vid.url);
    let res = await fetch(api);
    let data = await res.json();

    if (data.status !== 200 || !data.success || !data.result.download_url) {
      return reply("Failed to fetch the video. Please try again later.");
    }

    let caption = `📹 *Video Details*
🎬 *Title:* ${vid.title}
⏳ *Duration:* ${vid.timestamp}
👀 *Views:* ${vid.views}
👤 *Author:* ${vid.author.name}
🔗 *Link:* ${vid.url}

*Choose download format:*
1. 📄 Document (no preview)
2. ▶️ Normal Video (with preview)

_Reply to this message with 1 or 2 to download._`;

    let ctx = {
      mentionedJid: [store.sender],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363382023564830@newsletter',
        newsletterName: "NOVA TECH",
        serverMessageId: 143
      }
    };

    const sentMsg = await conn.sendMessage(from, {
      image: { url: vid.thumbnail },
      caption,
      contextInfo: ctx
    }, { quoted: m });

    conn.ev.on("messages.upsert", async update => {
      const msg = update.messages[0];
      if (!msg.message?.extendedTextMessage) return;

      const text = msg.message.extendedTextMessage.text.trim();
      if (msg.message.extendedTextMessage.contextInfo?.stanzaId === sentMsg.key.id) {
        await conn.sendMessage(from, { react: { text: '⬇️', key: msg.key } });

        switch (text) {
          case '1':
            await conn.sendMessage(from, {
              document: { url: data.result.download_url },
              mimetype: 'video/mp4',
              fileName: vid.title + ".mp4",
              contextInfo: ctx
            }, { quoted: msg });
            break;
          case '2':
            await conn.sendMessage(from, {
              video: { url: data.result.download_url },
              mimetype: "video/mp4",
              contextInfo: ctx
            }, { quoted: msg });
            break;
          default:
            await conn.sendMessage(from, {
              text: "*Please Reply with ( 1 or 2 ) ❤️*"
            }, { quoted: msg });
            break;
        }
      }
    });
  } catch (e) {
    console.log(e);
    reply("An error occurred. Please try again later.");
  }
});


//=========== YOUTUBE SONG (MP3) ===========//
cmd({
  pattern: "song",
  alias: ["ytdl3", "playy"],
  react: '🎶',
  desc: "Download YouTube song",
  category: "main",
  use: ".song < Yt url or Name >",
  filename: __filename
}, async (conn, m, store, { from, prefix, quoted, q, reply }) => {
  try {
    if (!q) return reply("Please provide a YouTube URL or song name.");

    const search = await ytsearch(q);
    if (search.results.length < 1) return reply("No results found!");

    let song = search.results[0];
    let api = "https://apis.davidcyriltech.my.id/youtube/mp3?url=" + encodeURIComponent(song.url);
    let res = await fetch(api);
    let data = await res.json();

    if (data.status !== 200 || !data.success || !data.result.downloadUrl) {
      return reply("Failed to fetch the audio. Please try again later.");
    }

    let caption = `🎵 *Song Details*
🎶 *Title:* ${song.title}
⏳ *Duration:* ${song.timestamp}
👀 *Views:* ${song.views}
👤 *Author:* ${song.author.name}
🔗 *Link:* ${song.url}

*Choose download format:*
1. 📄 MP3 as Document
2. 🎧 MP3 as Audio (Play)
3. 🎙️ MP3 as Voice Note (PTT)

_Reply with 1, 2 or 3 to this message to download the format you prefer._`;

    let ctx = {
      mentionedJid: [store.sender],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363382023564830@newsletter',
        newsletterName: "𝘕𝘖𝘝𝘈 𝘟𝘔𝘋",
        serverMessageId: 143
      }
    };

    const sentMsg = await conn.sendMessage(from, {
      image: { url: song.thumbnail },
      caption,
      contextInfo: ctx
    }, { quoted: m });

    conn.ev.on("messages.upsert", async update => {
      const msg = update.messages[0];
      if (!msg.message?.extendedTextMessage) return;

      const text = msg.message.extendedTextMessage.text.trim();
      if (msg.message.extendedTextMessage.contextInfo?.stanzaId === sentMsg.key.id) {
        await conn.sendMessage(from, { react: { text: '⬇️', key: msg.key } });

        switch (text) {
          case '1':
            await conn.sendMessage(from, {
              document: { url: data.result.downloadUrl },
              mimetype: "audio/mpeg",
              fileName: song.title + ".mp3",
              contextInfo: ctx
            }, { quoted: msg });
            break;
          case '2':
            await conn.sendMessage(from, {
              audio: { url: data.result.downloadUrl },
              mimetype: "audio/mpeg",
              contextInfo: ctx
            }, { quoted: msg });
            break;
          case '3':
            await conn.sendMessage(from, {
              audio: { url: data.result.downloadUrl },
              mimetype: "audio/mpeg",
              ptt: true,
              contextInfo: ctx
            }, { quoted: msg });
            break;
          default:
            await conn.sendMessage(from, {
              text: "*Invalid selection. Please select between (1, 2 or 3) 🔴*"
            }, { quoted: msg });
        }
      }
    });
  } catch (e) {
    console.log(e);
    reply("An error occurred. Please try again later.");
  }
});
