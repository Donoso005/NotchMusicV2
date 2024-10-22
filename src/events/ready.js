const Discord = require('discord.js');
const config = require("../../botconfig/config.json")

module.exports = {
	name: Discord.Events.ClientReady,
	once: true,
	execute(client) {
        try {

        } catch(e) {
            
        }
		client.logger(
            `Bot User: `.brightBlue + `${client.user.tag}`.blue + `\n` +
            `Guild(s): `.brightBlue + `${client.guilds.cache.size} Servers`.blue + `\n` +
            `Watching: `.brightBlue + `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members`.blue + `\n` +
            `Prefix: `.brightBlue + `${config.prefix}`.blue + `\n` +
            //`Commands: `.brightBlue + `${client.commands.size}`.blue + `\n` +
            `Discord.js: `.brightBlue + `v${Discord.version}`.blue + `\n` +
            `Node.js: `.brightBlue + `${process.version}`.blue + `\n` +
            `Plattform: `.brightBlue + `${process.platform} ${process.arch}`.blue + `\n` +
            `Memory: `.brightBlue + `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`.blue
          );
	},
};
