const { SlashCommandBuilder } = require("discord.js");

// -- Import Files And Languages Required --
const emoji = require(`${process.cwd()}/botconfig/emoji`);
const embedTemplate = require(`${process.cwd()}/botconfig/embedTemplate`);
const loadLanguages = require(`${process.cwd()}/src/index.js`);

lang = loadLanguages();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setNameLocalizations({
        'en-US': lang['en'].cmds.admin.ban.name,
        'es-ES': lang['es'].cmds.admin.ban.name,
    })
    .setDescription('Bans a player')
}