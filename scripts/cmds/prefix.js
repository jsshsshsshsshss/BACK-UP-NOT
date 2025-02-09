const fs = require("fs-extra");
const { utils } = global;

module.exports = {
	config: {
		name: "prefix",
		version: "1.4",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: "Change the bot's prefix in your chat group or the entire system (admin only)",
		category: "config",
		guide: {
			en: "   {pn} <new prefix>: Change the prefix in your chat group"
				+ "\n   Example:"
				+ "\n    {pn} #"
				+ "\n\n   {pn} <new prefix> -g: Change the prefix for the entire system (admin only)"
				+ "\n   Example:"
				+ "\n    {pn} # -g"
				+ "\n\n   {pn} reset: Reset the prefix in your chat group to default"
		}
	},

	langs: {
		en: {
			reset: "Your prefix has been reset to default.",
			onlyAdmin: "Only admin can change the system prefix.",
			confirmGlobal: "Please react to this message to confirm the prefix change for the entire system.",
			confirmThisThread: "Please react to this message to confirm the prefix change in your chat group.",
			successGlobal: "Successfully changed the system prefix.",
			successThisThread: "Successfully changed the prefix in your chat group.",
			welcomeMessage: "🔥 WELCOME TO MUN BOT 🔥\n⚡ SYSTEM PREFIX: /\n👾 ENJOY OUR MESSENGER BOT 👾"
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		if (!args[0]) return message.SyntaxError();

		if (args[0] == 'reset') {
			await threadsData.set(event.threadID, null, "data.prefix");
			return message.reply(getLang("reset"));
		}

		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: event.senderID,
			newPrefix
		};

		if (args[1] === "-g") {
			if (role < 2) return message.reply(getLang("onlyAdmin"));
			formSet.setGlobal = true;
		} else {
			formSet.setGlobal = false;
		}

		return message.reply(args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"), (err, info) => {
			formSet.messageID = info.messageID;
			global.GoatBot.onReaction.set(info.messageID, formSet);
		});
	},

	onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
		const imageURL = "https://drive.google.com/u/0/uc?id=1dsK0HTRrzQ1nRSIgfNaQzslF_OdAVAe3&export=download";
		const { author, newPrefix, setGlobal } = Reaction;
		if (event.userID !== author) return;

		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			return message.reply({
				body: getLang("successGlobal"),
				attachment: await global.utils.getStreamFromURL(imageURL)
			});
		} else {
			await threadsData.set(event.threadID, newPrefix, "data.prefix");
			return message.reply({
				body: getLang("successThisThread"),
				attachment: await global.utils.getStreamFromURL(imageURL)
			});
		}
	},

	onChat: async function ({ event, message, getLang }) {
		const imageURL = "https://drive.google.com/u/0/uc?id=1dsK0HTRrzQ1nRSIgfNaQzslF_OdAVAe3&export=download";
		if (event.body && event.body.toLowerCase() === "prefix") {
			return message.reply({
				body: getLang("welcomeMessage"),
				attachment: await global.utils.getStreamFromURL(imageURL)
			});
		}
	}
};