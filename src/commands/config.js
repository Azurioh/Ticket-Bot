const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Config settings of the bot')
        .addSubcommand(subcommand =>
            subcommand
                .setName('category')
                .setDescription('Edit the category used to create ticket')
                .addStringOption(option =>
                    option
                        .setName('id')
                        .setDescription('ID of the category')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('channel')
                .setDescription('Channel where you want to post the message for create ticket')
                .addChannelOption(option =>
                    option
                        .setName('channel')
                        .setDescription('Channel that you want use')
                        .setRequired(true)))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction, client) {

        const embed = new EmbedBuilder()
            .setFooter({ text: '❤️ Made by Azurioh', iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .setColor('Red');

        switch (interaction.options.getSubcommand()) {
            case "category":
                const categoryId = interaction.options.getString('id');
                const category = interaction.guild.channels.cache.get(categoryId);

                if (!category || category.type !== 4) {
                    embed.setDescription('❌ An error has occured, the id provided is invalid')
                    return interaction.reply({ embeds: [embed], ephemeral: true })
                }

                await db.set(`ticketCategoryId_${interaction.guild.id}`, categoryId);
                embed.setDescription('✅ The category id has been changed');
                return interaction.reply({ embeds: [embed] });

            case "channel":
                const channel = interaction.options.getChannel('channel');

                if (channel.type !== 0) {
                    embed.setDescription('❌ An error has occured, the channel provided is not a text channel');
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('createTicket')
                            .setStyle(ButtonStyle.Success)
                            .setEmoji('📨')
                            .setLabel('Open Ticket')
                    );
                embed.setTitle('Contact us').setDescription('📩・Click on the button for open a ticket')
                await channel.send({ embeds: [embed], components: [button] });
                return interaction.reply(`Message send to : ${channel}`);
        }           
    }
}