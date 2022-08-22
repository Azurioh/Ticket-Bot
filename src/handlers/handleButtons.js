const fs = require('node:fs');
const ascii = require('ascii-table');
const table = new ascii('Buttons');
table.setHeading('Name', 'Status');

module.exports = (client) => {
    client.handleButtons = async (buttonFolders, path) => {
        for (const folder of buttonFolders) {
            const buttonFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of buttonFiles) {
                const button = require(`../buttons/${folder}/${file}`);
                if (button.data.name) {
                    try {
                        client.buttons.set(button.data.name, button);
                        table.addRow(file, '✅ -> Button loaded');
                    }
                    catch (error) {
                        console.error(error);
                        process.exit(1);
                    }
                }
                else {
                    table.addRow(file, '❌ -> Button not loaded');
                }
            }
        }
        console.log(table.toString());
    }
}