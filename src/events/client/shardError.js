const Discord = require('discord.js');
const config = require("../../../botconfig/config.json");

module.exports = {
    name: Discord.Events.ShardError,
    execute(client, id) {
        setTimeout(() => {
            client.logger(`Shard #${id} Errored` ,"error");
        }, 5000);
    }
}