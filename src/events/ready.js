const config = require('../../config.json');

module.exports = {
    name: 'ready',
    once: true,

    async execute(client) {

        if (config.clientID !== client.user.id) {
            console.clear();
            console.log('[ERROR] The ID provide in "config.json" doesn\'t match with the bot ID');
            console.log('Shutdown...');
            process.exit(1);
        }

        console.log(`"${client.user.tag}" is ready to use !`);
    }
}