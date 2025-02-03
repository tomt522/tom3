const axios = require('axios'); 

const aApi = async () => {
  const a = await axios.get(
    "https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json"
  );
  return a.data.api;
};

module.exports.config = {
  name: "ai",
  version: "1.0.0",
  author: "♡ Nazrul ♡",
  role: 0,
  category: "ai",
  description: "talk with ai assistant",
  guide: {
      en: "   {pn} your question"
    }
}

module.exports.onStart = async ({ api, event, args, usersData }) => { 
  const prompt = args.join(" ");
  if (!prompt) {
    return api.sendMessage("Please Provide a Prompt!", event.threadID, event.messageID);
  }
  const data = await usersData.get(event.senderID);
  const name = data.name || "Darling";
  
  try {
    const res = await axios.get(`${await aApi()}/nazrul/hercai?query=${encodeURIComponent(prompt)}`);
    const replyMessage = `${name},🪄\n${res.data.answer}`;
    
    api.sendMessage(replyMessage, event.threadID, (error, info) => {
      if (error) return api.sendMessage("An error occurred!", event.threadID, event.messageID);
      
      global.GoatBot.onReply.set(info.messageID, {
        commandName: module.exports.config.name,
        type: "reply",
        messageID: info.messageID,
        author: event.senderID,
        msg: replyMessage,
      });
    }, event.messageID);
  } catch (err) {
    api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
}

module.exports.onReply = async ({ api, event, args }) => {
  const xPrompt = args.join(" ");
  if (!xPrompt) return;
  
  try {
    const res = await axios.get(`${await aApi()}/nazrul/hercai?query=${encodeURIComponent(xPrompt)}`);
    const xReply = res.data.answer;
    
    api.sendMessage(xReply, event.threadID, (error, info) => {
      if (error) return api.sendMessage("An error occurred!", event.threadID, event.messageID);
      
      global.GoatBot.onReply.set(info.messageID, {
        commandName: module.exports.config.name,
        type: "reply",
        messageID: info.messageID,
        author: event.senderID,
        msg: xReply,
      });
    }, event.messageID);
  } catch (err) {
    api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
}