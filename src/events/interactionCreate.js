module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client) {

        if (interaction.guildId == null) {
            return interaction.reply({ content: '❌・Commands are only available in a guild', ephemeral: true });
        }

        let fileToLoad;

        switch (interaction.type) {
            case 2:
                fileToLoad = client.commands.get(interaction.commandName);
                break;
            case 3:
                fileToLoad = client.buttons.get(interaction.customId);
                break;
            case 5:
                fileToLoad = client.modals.get(interaction.customId);
                break;
        }

        if (!fileToLoad) return;
        try {
            fileToLoad.execute(interaction, client);
        }
        catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌・An error has occured', ephemeral: true });
        }
    }
}