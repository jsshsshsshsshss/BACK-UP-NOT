module.exports = {
  config: {
    name: "inbox",
    aliases: ["in"],
    version: "1.0",
    author: "ArYan",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "hello goatbot inbox no prefix file enjoy the command @ArYan"
    },
    longDescription: {
      en: ""
    },
    category: "fun",
    guide: {
      en: ""
    }
  },
  langs: {
    en: {
      gg: ""
    },
    id: {
      gg: ""
    }
  },
  onStart: async function({ api, event, args, message }) {
    try {
      const query = encodeURIComponent(args.join(' '));
      message.reply("✅ **মেসেজ পাঠানো হলো!**\n\n🔰 **তোর ইনবক্স চেক কর, ধইরা ধইরা গালি দিছি!** 🐸🤝", event.threadID);
      api.sendMessage("✅ **তোর নামে কেস ফাইল খোলা হলো!**\n🔰 **কিরে বোকাচোদা! তোর মনে কি লুল্লা নাচতেছে? ক্যান ইনবক্সে ডাকলি? এখন যা বলার বল!** 🤡", event.senderID);
    } catch (error) {
      console.error("Error bro: " + error);
    }
  }
}