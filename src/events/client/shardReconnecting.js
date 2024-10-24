const Discord = require('discord.js');
const config = require("../../../botconfig/config.json");

module.exports = {
    name: Discord.Events.ShardError,
    execute(client, id) {
        client.logger(`Trying to reconnect shard ${id}`, "warn");
    }
}