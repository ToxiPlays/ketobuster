require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const token = process.env.BOT_TOKEN;
const linkRegex = /https?:\/\/x\.com\/([A-Za-z0-9_]{4,15})\/status\/([0-9]+)/;

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', message => {
    if (message.author.bot) {
        if (message.author.id.toString() == '1128948590467895396' && message.content.toLowerCase().includes("twitter")) {
            message.delete()
                .then(() => console.warn(`Deleted message from converter bot: ${message.id}`))
                .catch(console.error);
        } else {
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
            .then(() => message.suppressEmbeds(true))
            .catch(console.error);
        } else if (message.content.includes("||/sammyjrecho/||")) {
            message.channel.send(message.content.replaceAll("||/sammyjrecho/||",""))
            .then(() => message.delete())
            .then(() => console.warn(`Echo message from ${message.author.tag} sent: ${message.content}`))
            .catch(console.error);
        }
    }
});

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
});

server.listen(3000, () => {
    console.log('HTTP server listening on port 3000');
});

client.login(token);
