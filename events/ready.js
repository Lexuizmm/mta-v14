const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { TOKEN } = require("../config.json");
const { Client, GatewayIntentBits, Partials, ActivityType } = require("discord.js");

const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);

const client = new Client({
    intents: INTENTS,
    allowedMentions: {
        parse: ["users"]
    },
    partials: PARTIALS,
    retryLimit: 3
});

        

module.exports = async (client) => {

    const rest = new REST({ version: "10" }).setToken(TOKEN || process.env.token);

    try {
        await rest.put(Routes.applicationCommands(client.user.id), {
            body: client.commands,
        });
    } catch (error) {
        console.error("Komutlar yüklenirken bir hata oluştu:", error);
    }

    console.log(`${client.user.tag} Ow yeah midi denyo`);

   
    client.user.setStatus('dnd'); // 
    client.user.setActivity({
        name: 'Lexuizm MTA Connection', // 
        type: ActivityType.Streaming, // 
        url: 'https://www.twitch.tv/lexuizmshu' 
    });
};