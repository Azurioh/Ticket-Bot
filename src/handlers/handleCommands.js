const config = require('../../config.json');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const ascii = require('ascii-table');
const table = new ascii('Commands');
table.setHeading('Name', 'Status');

module.exports = (client) => {
    client.handleCommands = async (commandFiles) => {
        client.commandArray = [];
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            if (command.data.name) {
                try {
                    client.commands.set(command.data.name, command);
                    client.commandArray.push(command.data.toJSON());
                    table.addRow(file, '✅ -> Command loaded');
                }
                catch (error) {
                    console.error(error);
                    process.exit(1);
                }
            }
            else {
                table.addRow(file, '❌ -> Command not loaded');
            }
        }

        const rest = new REST({ version: 10}).setToken(config.token);
        (async () => {
            try {
                rest.put(Routes.applicationCommands(config.clientID), { body: client.commandArray })
                    .catch(console.error);
            }
            catch (error) {
                console.error(error);
                process.exit(1);
            }
        })();
        console.log(table.toString());
    }
}