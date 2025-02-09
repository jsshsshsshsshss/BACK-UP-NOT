const { getTime } = global.utils;
const axios = require("axios");
const fs = require("fs");
const path = require("path");

if (!global.temp.welcomeEvent) global.temp.welcomeEvent = {};

module.exports = {
	config: {
		name: "welcome",
		version: "1.7",
		author: "NTKhang",
		category: "events"
	},

	langs: {
		en: {
			session1: "𝗺𝗼𝗿𝗻𝗶𝗻𝗴",
			session2: "𝗻𝗼𝗼𝗻",
			session3: "𝗮𝗳𝘁𝗲𝗿𝗻𝗼𝗼𝗻",
			session4: "𝗲𝘃𝗲𝗻𝗶𝗻𝗴",
			welcomeMessage: "𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂 𝗮𝗹𝗮𝗶𝗸𝘂𝗺 😘\n\n আপনাদের গ্রুপে আমাকে এড করার জন্য অনেক ধন্যবাদ!\n 𝗕𝗼𝘁 𝗽𝗿𝗲𝗳𝗶𝘅: %1\nআমার সব কমান্ড দেখতে টাইপ করুন 💬 : %1𝗵𝗲𝗹𝗽",
			multiple1: "𝘆𝗼𝘂",
			multiple2: "𝘆𝗼𝘂 𝗴𝘂𝘆𝘀",
			defaultWelcomeMessage: `𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂 𝗮𝗹𝗮𝗶𝗸𝘂𝗺🌺\n\n 𝗛𝗲𝗹𝗹𝗼 {userName}.\n𝗪𝗲𝗹𝗰𝗼𝗺𝗲 {multiple} আমাদের  : {boxName} গ্রুপে!\n 𝗛𝗮𝘃𝗲 𝗮 𝗻𝗶𝗰𝗲 {session} 😊`
		}
	},

	onStart: async ({ threadsData, message, event, api, getLang }) => {
		if (event.logMessageType == "log:subscribe") {
			const hours = getTime("HH");
			const { threadID } = event;
			const { nickNameBot } = global.GoatBot.config;
			const prefix = global.utils.getPrefix(threadID);
			const dataAddedParticipants = event.logMessageData.addedParticipants;

			// যদি বটকে কেউ গ্রুপে যোগ করে
			if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
				if (nickNameBot) api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
				return message.send(getLang("welcomeMessage", prefix));
			}

			// নতুন মেম্বার যোগ হলে সেট করা
			if (!global.temp.welcomeEvent[threadID]) {
				global.temp.welcomeEvent[threadID] = {
					joinTimeout: null,
					dataAddedParticipants: []
				};
			}

			global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
			clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

			global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
				const threadData = await threadsData.get(threadID);
				if (threadData.settings.sendWelcomeMessage == false) return;

				const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
				const threadName = threadData.threadName;
				const userName = [], mentions = [];
				let multiple = false;

				if (dataAddedParticipants.length > 1) multiple = true;

				for (const user of dataAddedParticipants) {
					userName.push(user.fullName);
					mentions.push({ tag: user.fullName, id: user.userFbId });
				}

				if (userName.length == 0) return;

				let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;
				const form = { mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null };

				welcomeMessage = welcomeMessage
					.replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
					.replace(/\{boxName\}|\{threadName\}/g, threadName)
					.replace(/\{multiple\}/g, multiple ? getLang("multiple2") : getLang("multiple1"))
					.replace(/\{session\}/g,
						hours <= 10 ? getLang("session1") :
						hours <= 12 ? getLang("session2") :
						hours <= 18 ? getLang("session3") : getLang("session4")
					);

				form.body = welcomeMessage;

				// **📌 Google Drive ইমেজ ডাউনলোড এবং সেট করা**
				const imageUrl = "https://drive.google.com/uc?id=1Rq-7rHuGQDG6GBYacbo1VcEl947A6Djg&export=download";
				const imagePath = path.join(__dirname, "welcome.jpg");

				async function downloadImage() {
					const response = await axios({ url: imageUrl, method: "GET", responseType: "stream" });
					return new Promise((resolve, reject) => {
						const writer = fs.createWriteStream(imagePath);
						response.data.pipe(writer);
						writer.on("finish", resolve);
						writer.on("error", reject);
					});
				}

				await downloadImage();
				form.attachment = fs.createReadStream(imagePath);

				// মেসেজ পাঠানো
				message.send(form);
				delete global.temp.welcomeEvent[threadID];
			}, 1500);
		}
	}
};