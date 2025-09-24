require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const token = process.env.BOT_TOKEN;
const linkRegex = /https?:\/\/x\.com\/([A-Za-z0-9_]{4,15})\/status\/([0-9]+)/;

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', message => {
    if (message.author.bot) {
        console.log("Bot message!")
        if (message.author.id.toString() == '1128948590467895396') {
            message.delete()
                .then(() => console.warn(`Deleted message from converter bot: ${message.id}`))
                .catch(console.error);
        } else {
            console.log("Not the right bot, ignoring.")
            return;
        }
    } else {
        const match = message.content.match(linkRegex);
        if (match) {
            console.warn("Matched a link!")
            const username = match[1];
            const statusId = match[2];
            const langs = ['en','pt','es','fr','de','it','ja','ko','ru','zh'];
            const lang = langs[Math.floor(Math.random() * langs.length)];
            const newLink = `https://fixupx.com/${username}/status/${statusId}/${lang}`;
            message.reply(`[@${username} on Twitter](${newLink})`)
            .then(() => console.warn(`Replied with fixed link for message: ${message.id}\nLink: ${newLink}, Lang: ${lang}, User: ${message.author.tag}`))
            .catch(console.error);
        }
    }
});

client.login(token);
