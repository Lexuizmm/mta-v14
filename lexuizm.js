const {PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder } = require("discord.js");
const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);
const Discord = require("discord.js")
const config = require('./config.json')
const allowedMentions = { parse: ['users', 'roles', 'everyone'] };
const client = new Client({
    intents: INTENTS,
    allowedMentions: {
        parse: ["users"]
    },
    partials: PARTIALS,
    retryLimit: 3
});

global.client = client;
client.commands = new Discord.Collection();

const { readdirSync } = require("fs")
const { TOKEN } = require("./config.json");
const { channel } = require("diagnostics_channel");
const { set } = require("croxydb");


readdirSync('./commands').forEach(f => {
  if(!f.endsWith(".js")) return;
 const props = require(`./commands/${f}`);
    client.commands.set(props.name, props);
    console.log(`[COMMAND] ${props.name} komutu yüklendi.`);
});


client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith('.')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        command.run(client, message, args);
    } catch (error) {
        console.error(error);
        message.reply('Komut çalıştırılırken bir hata oluştu!').catch(console.error);
    }
});

readdirSync('./events').forEach(e => {
  const eve = require(`./events/${e}`);
  const name = e.split(".")[0];
  client.on(name, (...args) => {
            eve(client, ...args)
        });
console.log(`[EVENT] ${name} eventi yüklendi.`)
}); 

client.login(TOKEN)