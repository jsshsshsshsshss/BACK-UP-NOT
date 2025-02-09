const fs = require('fs');
const axios = require('axios');

module.exports = {
	config: {
		name: "bondhu",
		author: "Cliff", // API by bungdas
		version: "2.0",
		cooldowns: 0,
		role: 0,
		shortDescription: {
			bn: "তোর ভার্চুয়াল বেস্টি!"
		},
		longDescription: {
			bn: "তোর গোপন কথা শোনার জন্য আমি রেডি! কাওকে বলবো না, প্রমিস 😉"
		},
		category: "Talk",
		guide: {
			bn: "লিখ {p}bondhu <তোর কথা>"
		}
	},

	onStart: async function ({ api, event, args }) {
		const input = args.join(" ");
		const botID = api.getCurrentUserID();
		const botData = await api.getUserInfo(botID);
		const sender = event.type === "message_reply" ? event.messageReply.senderID : event.senderID;
		const userInfo = await api.getUserInfo(sender);
		const userName = userInfo[sender].name;
		const botName = botData[botID].name;
		const replyMessage = event.type === "message_reply" ? event.messageReply.body : "তুই কিছু বলবি না?";
		const userMessages = event.type === "message" ? input : `${userName}: ${replyMessage}\n${input}`;

		if (input.length < 2) {
			const responses = [
				"বলেন বন্ধু, কেমন আছেন? 😏",
				"আমি সবসময় তোদের জন্য রেডি! 😎",
				"কি রে, নতুন গসিপ আছে নাকি? 🤔",
				"আজকে দিন কেমন কাটলো? 😃",
				"কেউ কি তোর সাথে খারাপ ব্যবহার করেছে? 😤",
				"বলো বলো, গোপন কথা শুনতে আমার ভালো লাগে! 😉"
			];
			const randomResponse = responses[Math.floor(Math.random() * responses.length)];
			api.sendMessage(randomResponse, event.threadID, event.messageID);
		} else {
			try {
				const prompt = `তুই এখন থেকে আমার সাথে বাংলায় কথা বলবি, যেন মনে হয় তুই আমার প্রিয় বন্ধু। মাঝে মাঝে একটু ফান করবি, মজার কথা বলবি। তোর নাম হলো ${botName}, আর আমার সাথে একটু বেশি এক্সপ্রেসিভ হতে পারিস! 😉`;

				const response = await axios.get(`https://jeromeee.onrender.com/api/bes?question=${encodeURIComponent(prompt + input)}`);
				const message = response.data.reply;
				api.sendMessage(message, event.threadID, event.messageID);
			} catch (error) {
				if (error.response) {
					console.log(error.response.status);
					console.log(error.response.data);
					if (error.response.status === 401 && error.response.data.error.message.startsWith("You didn't provide an API key")) {
						api.sendMessage("ওই! API-Key দেয়নি কেন? দে, জলদি দে! 😤", event.threadID, event.messageID);
					}
				} else {
					console.log(error.message);
					api.sendMessage("বাহ! সমস্যা হয়ে গেলো! 🤦‍♂️: " + error.message, event.threadID);
				}
			}
		}
	}
};
