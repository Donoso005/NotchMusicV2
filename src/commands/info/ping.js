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
    .setName("ping")
    .setDescription("Shows the latency of the bot"),
  category: "Info",
  description: "Shows the latency of the bot",
  cooldown: 5,

  async execute(interaction, client) {
    let oldate = new Date().getMilliseconds();

    const startEmbed = embedCreator({
      title: msgConverter(lang["en"].cmds.info.ping.text, {
        emoji: emoji.latency,
      }),
      thumbnail: embedTemplate.iconBot,
      timestamp: true,
    });

    const editedEmbed = embedCreator({
      title: msgConverter("Pong! \n" + lang["en"].cmds.info.ping.text2, {
        emoji_bot: emoji.bot,
        emoji_host: emoji.host,
        emoji_api: emoji.api,
        botping: Math.floor(
          client.ws.ping + new Date().getMilliseconds() - oldate
        ),
        ping: Math.floor(new Date().getMilliseconds() - oldate),
        wsping: Math.floor(client.ws.ping),
      }),
      thumbnail: embedTemplate.iconBot,
      timestamp: true,
      footer: {
        text: "Developed by Don_oso005",
        iconURL: embedTemplate.iconBot,
      },
    });

    await interaction.reply({ embeds: [startEmbed] });
    await interaction.editReply({ embeds: [editedEmbed] });
  },
};
