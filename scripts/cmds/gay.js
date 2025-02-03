const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "gay",
    version: "1.0",
    author: "@tas33n",
    countDown: 1,
    role: 0,
    shortDescription: "find gay",
    longDescription: "",
    category: "box chat",
    guide: "{pn} {{[on | off]}}",
    envConfig: {
      deltaNext: 5
    }
  },

  langs: {
    vi: {
      noTag: "Bạn phải tag người bạn muốn tát"
    },
    en: {
      noTag: "You must tag the person you want to "
    }
  },

  onStart: async function ({ event, message, usersData, args, getLang }) {

    let mention = Object.keys(event.mentions);
    let uid;

    if (event.type == "message_reply") {
      uid = event.messageReply.senderID;
    } else {
      if (mention[0]) {
        uid = mention[0];
      } else {
        uid = event.senderID;
      }
    }

    // Prevent the user with ID 100078140834638 from being targeted
    if (uid === "100078140834638", "100084690500330" ) {
      return message.reply("Did you check yourself..? 🤏🏻");
    }

    let url = await usersData.getAvatarUrl(uid);
    let avt = await new DIG.Gay().getImage(url);

    const pathSave = `${__dirname}/tmp/gay.png`;
    fs.writeFileSync(pathSave, Buffer.from(avt));
    let body = "Look... I found a gay";
    if (!mention[0]) body = "Baka, you're gay\nForgot to reply or mention someone";
    message.reply({
      body: body,
      attachment: fs.createReadStream(pathSave)
    }, () => fs.unlinkSync(pathSave));
  }
};