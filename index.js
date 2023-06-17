// main.js

const TelegramBot = require('node-telegram-bot-api');
const request = require('request');

const TOKEN = '6109622345:AAHoTVHfcVY11ImFbUqjvSwehfWNodAmEUc';
const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to the Bot! Please send me the vehicle registration number.');
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const registrationNumber = msg.text;
  const url = `https://api.royalsundaram.in/Services/CommonLookup/VehicleDetails?regn_no=${registrationNumber}`;

  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      try {
        // Print the XML content to the Telegram bot
        bot.sendMessage(chatId, body, { parse_mode: 'HTML' });
      } catch (parseError) {
        console.error('Error parsing XML:', parseError);
        bot.sendMessage(chatId, 'Failed to retrieve vehicle details.');
      }
    } else {
      bot.sendMessage(chatId, 'Failed to retrieve vehicle details.');
    }
  });
});
