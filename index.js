// main.js

const TelegramBot = require('node-telegram-bot-api');
const request = require('request');

const TOKEN = '5940303873:AAEq3kxtsDmOxmF4PEqqkjNMJVU-AcE8HuM';
const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to the Bot! Please send me the vehicle registration number.');
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const registrationNumber = msg.text;

  // Check if the registrationNumber is provided
  if (!registrationNumber || registrationNumber.trim() === "") {
    bot.sendMessage(chatId, 'Please provide a valid vehicle registration number.');
    return;
  }

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
const keepAlive = require('./server');
const Monitor = require('ping-monitor');

keepAlive();
const monitor = new Monitor({
    website: '',
    title: 'NAME',
    interval: 2
});

monitor.on('up', (res) => console.log(`${res.website} its on.`));
monitor.on('down', (res) => console.log(`${res.website} it has died - ${res.statusMessage}`));
monitor.on('stop', (website) => console.log(`${website} has stopped.`) );
monitor.on('error', (error) => console.log(error));
