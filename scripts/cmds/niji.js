const axios = require('axios');

module.exports = {
  config: {
    name: "niji",
    version: "1.0",
    author: "Eijah Noah & Akash Xzh", // JARiF
    countDown: 5,
    role: 0,
    longDescription: {
      vi: "",
      en: "Get images from text.",
    },
    category: "araf",
    guide: {
      vi: "",
      en:
        "Usage Example:\n /niji cute girl -- ar 4:3",
    },
  },

  onStart: async function ({ api, args, message, event }) {
    try {
      const text = args.join(" ");
      if (!text) {
        return message.reply("Please provide a prompt.");
      }

      let prompt, ratio;
      if (text.includes("--")) {
        const [promptText, ratioText] = text
          .split("--")
          .map((str) => str.trim());
        prompt = promptText;
        ratio = ratioText;
      } else {
        prompt = text;
        ratio = "1:1";
      }

      api.setMessageReaction("⏳", event.messageID, () => {}, true);
      const waitingMessage = await message.reply("✅ | Creating your Imagination...");

      const b = 'com';

      const API = await axios.get(`https://api.vyturex.${b}/niji?text=${encodeURIComponent(prompt)}&ar=${encodeURIComponent(ratio)}`);
      const img = API.data.imageUrl;
      const imageStream = await global.utils.getStreamFromURL(img);

      await message.reply({
        attachment: imageStream,
      });
      api.setMessageReaction("✅", event.messageID, () => {}, true);
      await api.unsendMessage(waitingMessage.messageID);
    } catch (error) {
      console.log(error);
      message.reply("Failed.").then(() => {
      });
    }
  },
};
