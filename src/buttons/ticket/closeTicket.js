const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: {
        name: 'closeTicket'
    },

    async execute(interaction, client) {

        const check = await db.get(`ticketUser_${interaction.channel.id}`);
        if (!check) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription('❌・The ticket is already closed')
                        .setFooter({ text: '❤️ Made by Azurioh', iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp()
                        .setColor('Red'),
                ], ephemeral: true 
            });
        };

        const embed = new EmbedBuilder()
            .setDescription('🔒・Are you sure you would like to close the ticket ?')
            .setFooter({ text: '❤️ Made by Azurioh', iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .setColor('Yellow');

        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('closeTicketConfirm')
                    .setLabel('Close')
                    .setEmoji('🔒')
                    .setStyle(ButtonStyle.Danger)
            )

        return interaction.reply({ embeds: [embed], components: [button], ephemeral: true });
    }
}