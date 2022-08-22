const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: {
        name: 'openTicket'
    },
    
    async execute(interaction, client) {
        
        interaction.message.delete();
        interaction.deferReply();
        interaction.deleteReply();

        const embed = new EmbedBuilder();

        const userId = await db.get(`ticketUser_${interaction.channel.id}`);
        const perms = PermissionsBitField.Flags;

        interaction.guild.channels.edit(interaction.channel.id, {
            permissionOverwrites: [
                {
                    id: userId,
                    allow: [perms.ViewChannel, perms.SendMessages, perms.AttachFiles]
                },
            ]
        }).catch((error) => {
            console.error(error);
            embed
                .setDescription('❌・An error has occured')
                .setColor('Red');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        });

        embed
            .setDescription(`📨・Ticket open by ${interaction.member}`)
            .setColor('Green');

        await db.set(`ticketOpen_${userId}`, true);

        return interaction.channel.send({ embeds: [embed] });
    }
}