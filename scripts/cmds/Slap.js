const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "slap",
    version: "1.0.1",
    hasPermission: 0,
    credits: "Priyansh Rajput (Fixed by ChatGPT)",
    description: "Slap a tagged user 🖐️",
    commandCategory: "fun",
    usages: "slap @user",
    cooldowns: 5
  },

  onStart: async function ({ api, event }) {
    try {
      const mentions = Object.keys(event.mentions);
      if (mentions.length === 0) {
        return api.sendMessage("❌ দয়া করে কাউকে ট্যাগ করুন যাকে স্ল্যাপ দিতে চান!", event.threadID, event.messageID);
      }

      const targetID = mentions[0];
      const targetName = event.mentions[targetID];

      const response = await axios.get("https://api.waifu.pics/sfw/slap");
      const imageURL = response.data.url;
      const ext = path.extname(imageURL);
      const imagePath = path.join(__dirname, "cache", `slap_${targetID}${ext}`);

      // Download the image
      await downloadImage(imageURL, imagePath);

      // Send the slap message
      return api.sendMessage({
        body: `👋 *স্ল্যাপ দিলাম!* ${targetName}\n\n*আরে ভাই, মশা ছিলো, তাই...* 😆`,
        mentions: [{ tag: targetName, id: targetID }],
        attachment: fs.createReadStream(imagePath)
      }, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);

    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ স্ল্যাপ দিতে সমস্যা হচ্ছে! পরে আবার চেষ্টা করুন।", event.threadID, event.messageID);
    }
  }
};

// Helper function to download image
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    request(url)
      .pipe(fs.createWriteStream(filepath))
      .on("close", resolve)
      .on("error", reject);
  });
}
