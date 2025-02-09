const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "Adrita",
        version: "1.0",
        author: "AceGun",
        countDown: 5,
        role: 0,
        shortDescription: "no prefix",
        longDescription: "no prefix",
        category: "no prefix",
    },

    onStart: async function () {},

    onChat: async function ({ event, message }) {
        if (event.body && event.body.toLowerCase().includes("adrita")) {  
            try {
                const imgPath = path.join(__dirname, "temp.jpg");
                const response = await axios.get("https://i.imgur.com/EGvVyxV.jpeg", { responseType: "arraybuffer" });
                fs.writeFileSync(imgPath, response.data);

                return message.reply({
                    body: `🤭 「 ~ ওরে ডেকো না ভাই! আদ্রিতা মুরগি চোর 😹🍗  
                    কাল মুরগি চুরি করতে গিয়ে ধরা খেয়ে গণধোলাইয়ের শিকার! 🤣😭  
                    একটু আগে পোস্টার দেখলাম! 😡📜  
                    জানতাম বিশ্বাস করবা না, নাক পিক সহ দিলাম! 📸👀  
                    এই মুরগি চোরকে ধরতে পারলে পুরস্কার ০.০০০০০০১ টাকা! 🤑👾」`,
                    attachment: fs.createReadStream(imgPath)
                });
            } catch (error) {
                console.error("Image fetch error:", error);
                return message.reply("❌ ছবি লোড করতে সমস্যা হয়েছে! পরে আবার চেষ্টা করুন।");
            }
        }
    }
};