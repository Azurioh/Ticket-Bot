const { Client, Collection, IntentsBitField } = require('discord.js');
const fs = require('node:fs');
const config = require('./config.json');
const client = new Client({ intents: new IntentsBitField(3276799) });

console.clear();

if (!config.token) {
    console.log('[ERROR] Please provide your token in "config.json"');
    console.log('Shutdown...');
    process.exit(1);
}
else if (!config.clientID) {
    console.log('[ERROR] Please provide the ID of your bot in "config.json"');
    console.log('Shutdown...');
    process.exit(1);
}

client.commands = new Collection();
client.buttons = new Collection();

const handlerFiles = fs.readdirSync('./src/handlers').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
const buttonFolders = fs.readdirSync('./src/buttons');

(async () => {
    for (const file of handlerFiles) {
        require(`./src/handlers/${file}`)(client);
    }
    client.handleCommands(commandFiles);
    client.handleButtons(buttonFolders, './src/buttons');
    client.handleEvents(eventFiles);
    client.login(config.token);
})();