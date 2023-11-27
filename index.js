// index.js

const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const xml2js = require('xml2js');

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
        // Parse the XML content
        xml2js.parseString(body, (parseError, result) => {
          if (!parseError) {
            // Beautify and send the JSON version of XML to the Telegram bot
            const beautifiedXml = JSON.stringify(result, null, 2);
            bot.sendMessage(chatId, `<pre>${beautifiedXml}</pre>`, { parse_mode: 'HTML' });
          } else {
            console.error('Error parsing XML:', parseError);
            bot.sendMessage(chatId, 'Failed to retrieve vehicle details.');
          }
        });
      } catch (parseError) {
        console.error('Error parsing XML:', parseError);
        bot.sendMessage(chatId, 'Failed to retrieve vehicle details.');
      }
    } else {
      try {
        // Try to parse the error response as JSON
        const errorResponse = JSON.parse(body);
        const { statusCode, status, description } = errorResponse;
        bot.sendMessage(chatId, `<b>Error:</b>\nStatus Code: ${statusCode}\nStatus: ${status}\nDescription: ${description}`, { parse_mode: 'HTML' });
      } catch (jsonParseError) {
        console.error('Error parsing JSON:', jsonParseError);
        bot.sendMessage(chatId, 'Failed to retrieve vehicle details.');
      }
    }
  });
});
