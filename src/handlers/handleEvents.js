const ascii = require('ascii-table');
const table = new ascii('Events');
table.setHeading('Name', 'Status');

module.exports = (client) => {
    client.handleEvents = async (eventFiles) => {
        for (const file of eventFiles) {
            const event = require(`../events/${file}`);
            if (event.name) {
                try {
                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(...args, client)); 
                    }
                    else {
                        client.on(event.name, (...args) => event.execute(...args, client));
                    }
                    table.addRow(file, '✅ -> Event loaded');
                }
                catch (error) {
                    console.error(error);
                    process.exit(1);
                }
            }
            else {
                table.addRow(file, '❌ -> Event not loaded');
            }
        }
        console.log(table.toString());
    }
}