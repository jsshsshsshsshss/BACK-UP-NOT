module.exports = {
  config: {
    name: "sorry",
    version: "1.0",
    author: "Jaychris Garcia",
    countDown: 5,
    role: 0,
    shortDescription: "sarcasm",
    longDescription: "sarcasm",
    category: "reply",
  },
  onStart: async function () { },
  onChat: async function ({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() == "sorry") {
      return message.reply("তোর ‘sorry’ শুনে মনে হচ্ছে আমার ভেতর কিছু চিরকাল পুড়ে যাচ্ছে। 😔💔 \nশুধু স্যরি বললে কি হবে? তুই কি কখনও বুঝবি, আমি কত কষ্ট পেয়েছি? 😞\nপরিস্কার করে বল, আসলেই তুই কি জানিস, কতটা ব্যথা আমাকে দিয়েছিস? 💔");
    }
  }
};