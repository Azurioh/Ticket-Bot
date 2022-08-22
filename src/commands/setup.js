const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup the bot on the server')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction, client) {

        const embed = new EmbedBuilder()
            .setDescription('⚙️・Setup the bot...')
            .setFooter({ text: '❤️ Made by Azurioh', iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .setColor('DarkGreen')

        await interaction.reply({ embeds: [embed] });

        const ticketCategory = await interaction.guild.channels.create({
            name: 'Ticket',
            type: ChannelType.GuildCategory,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.SendMessages]
                }
            ]
        }).catch((error) => {
            console.error(error);
            embed.setDescription('❌・An error has occured during setup of the bot, the setup has been canceled').setColor('Red');
        })

        db.set(`ticketCategoryId_${interaction.guild.id}`, ticketCategory.id);

        const ticketChannel = await interaction.guild.channels.create({
            name: 'contact us',
            parent: ticketCategory.id,
            type: ChannelType.GuildText,
            permissionOverwrites: [{
                id: interaction.guild.id,
                deny: [PermissionsBitField.Flags.SendMessages]
            }]
        }).catch((error) => {
            console.error(error);
            embed.setDescription('❌・An error has occured during setup of the bot, the setup has been canceled').setColor('Red');
        });

        const transcriptChannel = await interaction.guild.channels.create({
            name: 'transcript',
            parent: ticketCategory.id,
            type: ChannelType.GuildText,
            permissionOverwrites: [{
                id: interaction.guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel]
            }]
        }).catch((error) => {
            console.error(error);
            embed.setDescription('❌・An error has occured during setup of the bot, the setup has been canceled').setColor('Red');
        });

        await db.set(`transcriptChannel_${interaction.guild.id}`, transcriptChannel.id);

        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('createTicket')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('📨')
                    .setLabel('Open Ticket')
            );
        const ticketEmbed = new EmbedBuilder()
            .setTitle('Contact us')
            .setDescription('📩・Click on the button for open a ticket')
            .setFooter({ text: '❤️ Made by Azurioh', iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .setColor('Blurple');

        await ticketChannel.send({ embeds: [ticketEmbed], components: [button] })
            .catch((error) => {
                console.error(error);
                embed.setDescription('❌・An error has occured during setup of the bot, the setup has been canceled').setColor('Red');
            });

        await embed.setDescription(`✅・Setup successfully on : ${ticketChannel}`).setColor('Green');
        return interaction.editReply({ embeds: [embed] });
    }
}