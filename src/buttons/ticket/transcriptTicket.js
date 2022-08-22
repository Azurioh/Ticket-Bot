const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const transcript = require("discord-html-transcripts")

module.exports = {
    data: {
        name: 'transcriptTicket'
    },

    async execute(interaction, client) {

        const userTicket = await db.get(`ticketUser_${interaction.channel.id}`);
        const transcriptChannel = await db.get(`transcriptChannel_${interaction.guild.id}`);

        interaction.guild.channels.cache.get(transcriptChannel).send({ content: `<@${userTicket}>'s ticket`, files: [await transcript.createTranscript(interaction.channel)] });

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('The ticket has been transcript')
                    .setDescription(`Transcript send at : <#${transcriptChannel}>`)
                    .addFields(
                        {
                            name: 'Requested by',
                            value: `${interaction.member}`,
                            inline: true,
                        },
                        {
                            name: 'Ticket author',
                            value: `<@${userTicket}>`,
                            inline: true
                        }
                    )
                    .setFooter({ text: '❤️ Made by Azurioh', iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()
                    .setColor('DarkGreen')
            ],
        });
    }
}