const Discord = require("discord.js");
const config = require("../../../botconfig/config.json");
const { MessageEmbed } = require("discord.js");
const { embedCreator, msgConverter } = require("../../functions/functions");

// -- Import Files And Languages Required --
const emoji = require(`${process.cwd()}/botconfig/emoji`);
const embedTemplate = require(`${process.cwd()}/botconfig/embedTemplate`);
const loadLanguages = require(`${process.cwd()}/src/index.js`);

lang = loadLanguages();

module.exports = {
  name: Discord.Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isCommand()) return;

    const command = interaction.client.slashCommands.get(
      interaction.commandName
    );

    if (!command) {
      client.logger(
        `No command matching ${interaction.commandName} was found.`,
        "error"
      );
    }

    const { cooldowns } = interaction.client;

    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldownDuration = 3;
    const cooldownAmount =
      (command.cooldown ?? defaultCooldownDuration) * 1_000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime =
        timestamps.get(interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1_000);
        const cooldownEmbed = embedCreator({
            title: lang["es"].cmds.cooldown.title,
            description: msgConverter(lang["es"].cmds.cooldown.description, {
                cooldownTime: `<t:${expiredTimestamp}:R>`,
                thumbnail: embedTemplate.iconBot
            }),
            timestamp: true  
        })
        if (interaction.replied || interaction.deferred) {
          return interaction.followUp({
            embeds: [cooldownEmbed],
            ephemeral: true,
          });
        } else {
          return interaction.reply({
            embeds: [cooldownEmbed],
            ephemeral: true,
          });
        }
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      await command.execute(interaction, client);
    } catch (error) {
      client.logger(error.toString(), "error");
      console.log(error);

      const embedInt = embedCreator({
        title: "ERROR",
        description: msgConverter(lang["es"].cmds.errorCommand, {
          emoji: emoji.error,
        }),
        timestamp: true,
      });

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [embedInt], ephemeral: true });
      } else {
        await interaction.reply({ embeds: [embedInt], ephemeral: true });
      }
    }
  },
};
