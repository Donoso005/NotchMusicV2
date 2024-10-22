const Discord = require('discord.js');
const config = require("../../botconfig/config.json");

module.exports = {
    name: Discord.Events.ShardReady,
    execute(client, id) {
        client.info(`Shard #${id} Ready` ,"success");
    }
}