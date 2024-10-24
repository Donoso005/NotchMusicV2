const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

// -- Import Files And Languages Required --
const emoji = require(`${process.cwd()}/botconfig/emoji`);
const embedTemplate = require(`${process.cwd()}/botconfig/embedTemplate`);
const loadLanguages = require(`${process.cwd()}/src/index.js`);

lang = loadLanguages();

const {
    embedCreator,
    msgConverter,
  } = require(`${process.cwd()}/src/functions/functions`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setNameLocalizations({
        'en-US': lang['en'].cmds.admin.ban.name,
        'es-ES': lang['es'].cmds.admin.ban.name,
    })
    .setDescription("Bans a user from the guild")
    .setDescriptionLocalizations({
        'en-US': lang['en'].cmds.admin.ban.description,
        'es-ES': lang['es'].cmds.admin.ban.description,
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    category: "Admin",
    cooldown: 5,
    async execute() {

    }
}