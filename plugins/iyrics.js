const { cmd } = require("../command");
const fetch = require("node-fetch");

const lyricsCmd = {
  pattern: "iyrics",
  alias: ["lyric"],
  desc: "Get song lyrics from Genius",
  category: "music",
  use: "<song title>"
};

cmd(lyricsCmd, async (_dest, _zk, _commandOptions, { text, prefix, command, reply }) => {
  if (!text) {
    return reply(
      "Please provide a song title.\nExample: *" + prefix + command + " robbery*"
    );
  }

  const query = encodeURIComponent(text);
  const apiUrl = "https://some-random-api.com/lyrics?title=${encodeURIComponent(songTitle)}" + query;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data.result || !data.result.lyrics || data.result.lyrics.length === 0) {
      return reply("❌ Lyrics not found.");
    }

    const { title, artist, album, url, lyrics } = data.result;

    let message = `🎵 *${title}*\n👤 Artist: ${artist}\n💿 Album: ${album}\n🔗 ${url}\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙾𝚅𝙰-𝚇𝙼𝙳*💫\n\n📄 *Lyrics:*\n`;

    for (const part of lyrics) {
      message += part.type === "header"
        ? `\n\n*${part.text}*\n`
        : part.text + "\n";
    }

    await reply(message.trim());
  } catch (err) {
    console.error(err);
    reply("❌ Failed to fetch lyrics. Try again later.");
  }
});
