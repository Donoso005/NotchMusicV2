const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

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
    .setName("botinfo")
    .setNameLocalizations({
      "en-US": lang["en"].cmds.info.botinfo.name,
      "es-ES": lang["es"].cmds.info.botinfo.name,
    })
    .setDescription("Shows information about the bot")
    .setDescriptionLocalizations({
      "en-US": lang["en"].cmds.info.botinfo.description,
      "es-ES": lang["es"].cmds.info.botinfo.description,
    }),
  category: "Info",
  cooldown: 10,

  async execute(interaction) {
    const embed = embedCreator({
      title: lang[interaction.locale].cmds.info.botinfo.title,
    })
  }
};
