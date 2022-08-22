const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, EmbedAssertions } = require("discord.js");
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: {
        name: 'closeTicketConfirm'
    },

    async execute(interaction, client) {

        interaction.deferReply();
        interaction.deleteReply();

        const userId = await db.get(`ticketUser_${interaction.channel.id}`);
        const perms = PermissionsBitField.Flags;

        interaction.guild.channels.edit(interaction.channel.id, {
            permissionOverwrites: [
                {
                    id: userId,
                    deny: [perms.ViewChannel, perms.SendMessages, perms.AttachFiles]
                },
            ]
        });

        await db.delete(`ticketOpen_${userId}`);

        const embed = new EmbedBuilder()
            .setDescription(`🔰・Please select a button below`)
            .setFooter({ text: '❤️ Made by Azurioh', iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .setColor('DarkGreen');

        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('transcriptTicket')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📄')
                    .setLabel('Transcript')
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('openTicket')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('📨')
                    .setLabel('Open')
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('deleteTicket')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('⚠️')
                    .setLabel('Delete')
            );
        await interaction.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`🔒・Ticket closed by ${interaction.member}`)
                    .setColor('Red')
            ]
        })
        return interaction.channel.send({ embeds: [embed], components: [button] });
    }
}