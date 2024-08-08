const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');

dotenv.config();

const token = process.env.TG_TOKEN;
const bot = new TelegramBot(token, {polling: true});
const targetGroupId = process.env.TG_TARGET_GROUP_ID;
const sourceGroupId = parseInt(process.env.SOURCE_GROUP_ID);

function sendMessageToTargetGroup(messageText) {
    return bot
        .sendMessage(targetGroupId, messageText)
        .then(() => {
            console.log(`[REQUESTS_BOT]: Message "${messageText}" sent to group ${targetGroupId}`);
        })
        .catch((error) => {
            console.error(`[REQUESTS_BOT]: Error sending message: ${error}`);
        });
}

function startRequestBot() {
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;

        if (chatId === sourceGroupId) {
            const messageText = msg.text || '';
            sendMessageToTargetGroup(messageText);
        }
    });

    console.log('[REQUESTS_BOT]: BOT_STARTED');
}

module.exports = {sendMessageToTargetGroup, startRequestBot};
