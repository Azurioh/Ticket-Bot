const { EmbedBuilder, ChannelType, PermissionsBitField, Embed, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: {
        name: 'createTicket'
    },

    async execute(interaction, client) {

        const user = interaction.guild.members.cache.get(interaction.member.id);
        const verification = await db.get(`ticketOpen_${user.id}`);
        if (verification) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription('❌・You have already open a ticket')
                            .setFooter({ text: `❤️ Made by Azurioh`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp()
                        .setColor('Red')
                ], ephemeral: true
            });
        };

        const perms = PermissionsBitField.Flags;
        const category = await db.get(`ticketCategoryId_${interaction.guild.id}`);
        const ticketChannel = await interaction.guild.channels.create(
            {
                name: 'new ticket',
                parent: category,
                type: ChannelType.GuildText,
                topic: `Ticket created by ${user.tag} at : ${new Date().toLocaleString()}`,
                permissionOverwrites: [
                    {
                        id: user.id,
                        allow: [perms.ViewChannel, perms.SendMessages, perms.AttachFiles]
                    },
                    {
                        id: interaction.guild.id,
                        deny: [perms.ViewChannel]
                    }
                ]
            }
        )
        
        await db.set(`ticketOpen_${user.id}`, true);
        await db.set(`ticketUser_${ticketChannel.id}`, user.id);
        
        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('closeTicket')
                    .setStyle(ButtonStyle.Danger)
                    .setLabel('Close')
                    .setEmoji('🔒')
            );

        const embed = new EmbedBuilder()
            .setTitle('A new ticket has created')
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setDescription('Thank you to contact us, explain your reason to contact us and a staff will be available as quickly as possible.')
            .setFooter({ text: `❤️ Made by Azurioh`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .setColor('DarkGreen');
        
        await interaction.reply({ content: `${ticketChannel}`, ephemeral: true });
        ticketChannel.send({ embeds: [embed], components: [button] });
        return ticketChannel.send({ content: `${interaction.member}` }).then((msg) => {
            msg.delete();
        })
    }
}