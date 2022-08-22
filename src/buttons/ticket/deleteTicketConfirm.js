const { EmbedBuilder } = require("discord.js");
const wait = require('node:timers/promises').setTimeout;
const { QuickDB } = require('quick.db');
const db = new QuickDB()

module.exports = {
    data: {
        name: 'deleteTicketConfirm'
    },

    async execute(interaction, client) {
        
        const userTicket = await db.get(`ticketUser_${interaction.channel.id}`);
        await db.delete(`ticketUser_${interaction.channel.id}`);
        await db.delete(`ticketTranscript_${userTicket}_${interaction.channel.id}`);
        
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription('Deleting the ticket...')
                    .setFooter({ text: '❤️ Made by Azurioh', iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()
                    .setColor('DarkGreen'),
            ]
        });
        await wait(3000);
        return interaction.channel.delete();
    }
}