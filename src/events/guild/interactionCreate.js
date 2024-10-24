const Discord = require('discord.js');
const config = require("../../../botconfig/config.json");
const { MessageEmbed } = require('discord.js');
const emoji = require(`${process.cwd()}/botconfig/emoji`);
const embedTemplate = require(`${process.cwd()}/botconfig/embedTemplate`);
const { embedCreator, msgConverter } = require(`${process.cwd()}/src/functions/functions`);

module.exports = {
    name: Discord.Events.InteractionCreate,
    async execute(client, interaction) {
        if (!interaction.isCommand()) return;

        const command = interaction.client.slashCommands.get(interaction.commandName);

        if(!command) {
            client.logger(`No command matching ${interaction.commandName} was found.`, "error");
        }

        try {
            await command.execute(interaction, client);
        } catch(error) {
            client.logger(error.toString(), "error");
            console.log(error);
            const embedInt = embedCreator("ERROR", null, null, msgConverter(
                client.lang.cmds.errorCommand, {
                    emoji: emoji.error
                }
            ), embedTemplate.iconBot, null, null, true, null);
            if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ embeds: [embedInt], ephemeral: true });
			} else {
				await interaction.reply({ embeds: [embedInt], ephemeral: true });
			}
        }
    }
}