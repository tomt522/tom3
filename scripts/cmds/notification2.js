const { getStreamsFromAttachment } = global.utils;

module.exports = {
    config: {
        name: "notification2",
        aliases: ["notify2", "noti2"],
        version: "1.7",
        author: "NTKhang",
        countDown: 5,
        role: 2,
        description: {
            vi: "Gửi thông báo từ admin đến all box",
            en: "Send notification from admin to all box"
        },
        category: "owner",
        guide: {
            en: "{pn} <tin nhắn>"
        },
        envConfig: {
            delayPerGroup: 250
        }
    },

    langs: {
        en: {
            missingMessage: "Please enter the message you want to send to all groups",
            notification: "𝙉𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣 𝙛𝙧𝙤𝙢 𝓐𝓭𝓶𝓲𝓷 𝓐𝓷𝓪𝓼 𝓐𝓶𝓲𝓷 ",
            sendingNotification: "Start sending notification from admin bot to %1 chat groups",
            sentNotification: "✅ Sent notification to %1 groups successfully",
            errorSendingNotification: "An error occurred while sending to %1 groups:\n%2"
        }
    },

    onStart: async function ({ message, api, event, args, commandName, envCommands, threadsData, getLang }) {
        const allowedUIDs = ["100084690500330"]; // UIDs allowed to use commands
        if (!allowedUIDs.includes(event.senderID)) {
            return message.reply("You do not have permission to use this command.");
        }

        const { delayPerGroup } = envCommands[commandName];

        if (commandName === "noti2" && event.senderID !== "100084690500330") {
            return message.reply("You do not have permission to use the 'noti2' command.");
        }

        if (!args[0]) {
            return message.reply(getLang("missingMessage"));
        }

        const notificationTitle =
            commandName === "noti2"
                ? getLang("notificationSpecial")
                : getLang("notification");

        const formSend = {
            body: `${notificationTitle}\n────────────────\n${args.join(" ")}`,
            attachment: await getStreamsFromAttachment(
                [
                    ...event.attachments,
                    ...(event.messageReply?.attachments || [])
                ].filter(item => ["photo", "png", "animated_image", "video", "audio"].includes(item.type))
            )
        };

        const allThreadID = (await threadsData.getAll()).filter(t => t.isGroup && t.members.find(m => m.userID == api.getCurrentUserID())?.inGroup);
        message.reply(getLang("sendingNotification", allThreadID.length));

        let sendSucces = 0;
        const sendError = [];
        const wattingSend = [];

        for (const thread of allThreadID) {
            const tid = thread.threadID;
            try {
                wattingSend.push({
                    threadID: tid,
                    pending: api.sendMessage(formSend, tid)
                });
                await new Promise(resolve => setTimeout(resolve, delayPerGroup));
            } catch (e) {
                sendError.push(tid);
            }
        }

        for (const sended of wattingSend) {
            try {
                await sended.pending;
                sendSucces++;
            } catch (e) {
                const { errorDescription } = e;
                if (!sendError.some(item => item.errorDescription == errorDescription))
                    sendError.push({
                        threadIDs: [sended.threadID],
                        errorDescription
                    });
                else
                    sendError.find(item => item.errorDescription == errorDescription).threadIDs.push(sended.threadID);
            }
        }

        let msg = "";
        if (sendSucces > 0)
            msg += getLang("sentNotification", sendSucces) + "\n";
        if (sendError.length > 0)
            msg += getLang("errorSendingNotification", sendError.reduce((a, b) => a + b.threadIDs.length, 0), sendError.reduce((a, b) => a + `\n - ${b.errorDescription}\n  + ${b.threadIDs.join("\n  + ")}`, ""));
        message.reply(msg);
    }
};