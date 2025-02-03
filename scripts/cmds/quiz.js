const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "quiz",
    aliases: ["qz"],
    version: "1.0",
    author: "Dipto",
    countDown: 0,
    role: 0,
    category: "game",
    guide: "{p}quiz \n{pn}quiz bn \n{p}quiz en",
  },

  onStart: async function ({ api, event, usersData, args }) {
    const input = args.join('').toLowerCase() || "bn";
    let timeout = 300;  // Timeout in seconds for the unsend message
    let category = "bangla";
    
    if (input === "bn" || input === "bangla") {
      category = "bangla";
    } else if (input === "en" || input === "english") {
      category = "english";
    }

    try {
      // Fetch the quiz data from the API
      const response = await axios.get(
        `${await baseApiUrl()}/quiz2?category=${category}&q=random`,
      );

      const quizData = response.data.question;
      const { question, correctAnswer, options } = quizData;
      const { a, b, c, d } = options;
      const namePlayerReact = await usersData.getName(event.senderID);

      // Prepare the quiz message
      const quizMsg = {
        body: `\n╭──✦ ${question}\n├‣ 𝗔) ${a}\n├‣ 𝗕) ${b}\n├‣ 𝗖) ${c}\n├‣ 𝗗) ${d}\n╰──────────────────‣\n𝚁𝚎𝚙𝚕𝚢 𝚝𝚘 𝚝𝚑𝚒𝚜 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚠𝚒𝚝𝚑 𝚢𝚘𝚞𝚛 𝚊𝚗𝚜𝚠𝚎𝚛.`,
      };

      // Send the quiz message
      api.sendMessage(
        quizMsg,
        event.threadID,
        (error, info) => {
          if (error) return console.error("Failed to send message:", error);

          // Store the reply context
          global.GoatBot.onReply.set(info.messageID, {
            type: "reply",
            commandName: this.config.name,
            author: event.senderID,
            messageID: info.messageID,
            dataGame: quizData,
            correctAnswer,
            nameUser: namePlayerReact,
          });
        },
        event.messageID,
      );
    } catch (error) {
      console.error("❌ | Error occurred:", error);
      api.sendMessage(error.message, event.threadID, event.messageID);
    }
  },

  onReply: async ({ event, api, Reply, usersData }) => {
    const { correctAnswer, nameUser, author } = Reply;

    // Ensure only the quiz author can reply
    if (event.senderID !== author) {
      return api.sendMessage(
        "Who are you bby🐸🦎",
        event.threadID,
        event.messageID
      );
    }

    // Fetch user data
    let userData = await usersData.get(author);
    let penaltyCoins = 250;  // Deduct 100 coins for wrong answers
    let penaltyExp = 50;     // Deduct 50 exp for wrong answers

    // Unsend the quiz message after the user replies
    api.unsendMessage(Reply.messageID).catch(console.error);

    switch (Reply.type) {
      case "reply": {
        let userReply = event.body.toLowerCase();

        // If the user gives the correct answer
        if (userReply === correctAnswer.toLowerCase()) {
          // Reward coins and experience points
          let rewardCoins = 400;
          let rewardExp = 150;
          await usersData.set(author, {
            money: userData.money + rewardCoins,
            exp: userData.exp + rewardExp,
            data: userData.data,
          });

          // Send a success message
          let correctMsg = `🎉 Congratulations, ${nameUser}!\n\nYou've answered correctly and earned ${rewardCoins} Coins 💰 and ${rewardExp} EXP 🌟\n\nKeep up the great work! 🚀`;
          api.sendMessage(correctMsg, event.threadID, event.messageID);
        } else {
          // Deduct penalty for wrong answer
          await usersData.set(author, {
            money: userData.money - penaltyCoins,
            exp: userData.exp - penaltyExp,
            data: userData.data,
          });

          // Send a message showing the penalty and correct answer
          let penaltyMsg = `❌ Wrong answer, ${nameUser}.\n\nYou've lost ${penaltyCoins} Coins 💰 and ${penaltyExp} EXP 🌟 for the wrong answer.\nThe correct answer was: ${correctAnswer}`;
          api.sendMessage(penaltyMsg, event.threadID, event.messageID);
        }
        break;
      }
      default:
        break;
    }
  },
};