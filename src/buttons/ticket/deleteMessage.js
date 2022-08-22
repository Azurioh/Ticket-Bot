const { EmbedBuilder } = require("discord.js");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: {
        name: 'deleteMessage'
    },

    async execute(interaction, client) {
        return interaction.message.delete();
    }
}