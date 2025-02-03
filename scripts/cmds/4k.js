const axios = require('axios');
const tinyurl = require('tinyurl');

module.exports = {
  config: {
    name: "4k",
    aliases: ["4k", "remini"],
    version: "1.0",
    author: "JARiF",
    countDown: 15,
    role: 0,
    longDescription: "Upscale your image.",
    category: "image",
    guide: {
      en: "{pn} reply to an image"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    const getImageUrl = () => {
      if (event.type === "message_reply") {
        const replyAttachment = event.messageReply.attachments[0];
        if (["photo", "sticker"].includes(replyAttachment?.type)) {
          return replyAttachment.url;
        } else {
          throw new Error("");
        }
      } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g) || null) {
        return args[0];
      } else {
        throw new Error("(⁠┌⁠・⁠。⁠・⁠)⁠┌ | Reply to an image.");
      }
    };

    try {
      const imageUrl = await getImageUrl();
      const shortUrl = await tinyurl.shorten(imageUrl);

      message.reply("⏰ | ℙ𝕝𝕖𝕒𝕤𝕖 𝕨𝕒𝕚𝕥...");

      const response = await axios.get(`https://www.api.vyturex.com/upscale?imageUrl=${shortUrl}`);
      const resultUrl = response.data.resultUrl;

      message.reply({ body: "✅ | 𝕀𝕞𝕒𝕘𝕖 𝔼𝕟𝕙𝕒𝕟𝕔𝕖𝕕📷.", attachment: await global.utils.getStreamFromURL(resultUrl) });
    } catch (error) {
      message.reply("🥲 | 𝔼𝕣𝕣𝕠𝕣: " + error.message);
      // Log error for debugging: console.error(error);
    }
  }
};