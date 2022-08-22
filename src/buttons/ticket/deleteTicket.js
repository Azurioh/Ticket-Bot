const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: {
        name: 'deleteTicket'
    },

    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setDescription('⚠️・Are you sure you would like to delete the ticket ?')
            .setFooter({ text: '❤️ Made by Azurioh', iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .setColor('Yellow');

        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('deleteTicketConfirm')
                    .setLabel('Delete')
                    .setEmoji('⚠️')
                    .setStyle(ButtonStyle.Danger)
            )
        return interaction.reply({ embeds: [embed], components: [button], ephemeral: true });
    }
}