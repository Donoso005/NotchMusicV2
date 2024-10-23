const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const emoji = require(`${process.cwd()}/botconfig/emoji`);
const embedTemplate = require(`${process.cwd()}/botconfig/embedTemplate`);

const {
  embedCreator,
  msgConverter,
} = require(`${process.cwd()}/src/functions/functions`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows the latency of the bot"),
  category: "Info",
  description: "Shows the latency of the bot",
  cooldown: 5,

  async execute(interaction, client) {
    let oldate = new Date().getMilliseconds()

    const startEmbed = embedCreator(msgConverter(
      client.lang.t("cmds.ping.text"), {
        emoji: emoji.latency 
      }
    ), null, null, null, embedTemplate.iconBot, null, null, true, null);

    await interaction.reply({ embeds: [startEmbed] });

    const editedEmbed = embedCreator(msgConverter(
        "Pong! \n" + client.lang.t("cmds.ping.text2"), {
          emoji_bot: emoji.bot ,
          emoji_host: emoji.host,
          emoji_api: emoji.api,
          botping: Math.floor(client.ws.ping + new Date().getMilliseconds() - oldate),
          ping: Math.floor(new Date().getMilliseconds() - oldate),
          wsping: Math.floor(client.ws.ping)
        }
      ), null, null, null, embedTemplate.iconBot, null, null, true, { text: "Developed by Don_oso005", iconURL: embedTemplate.iconBot});
      await interaction.editReply({ embeds: [editedEmbed]})

  },
};
