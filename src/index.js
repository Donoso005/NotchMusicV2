/**********************************************************
 * 1  Import_Modules
 * 1.1 Validating script for advertisement
 * 2  CREATE_THE_DISCORD_BOT_CLIENT
 * 3  create_the_languages_objects
 * 4  Raise_the_Max_Listeners
 * 5  LOAD_the_BOT_Functions_and_events
 * 6  Login_to_the_Bot
 *
 *   BOT CODED BY: Don_oso005
 *********************************************************/

/**********************************************************
 * @param {1} Import_Modules for this File
 *********************************************************/
const Discord = require("discord.js");
const config = require("../botconfig/config.json");
const lang = require("i18next");
const fs = require("fs");

/**********************************************************
 * Create Discord Bot Client
 *********************************************************/

const client = new Discord.Client({
  disableEveryone: true,
  disableMentions: "everyone",
  shards: "auto",
  allowedMentions: {
    parse: ["users", "roles"],
    repliedUser: false,
  },
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildIntegrations,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.GuildMessages,
  ],
  presence: {
    afk: config.status.afk,
    status: config.status.status,
    activities: [
      {
        name: config.status.activity.name,
        type: config.status.activity.type,
      },
    ],
  },
});

/**********************************************************
 * Create languages
 *********************************************************/

client.la = {};

var langs = fs.readdirSync("./src/languages");

for (const langu of langs.filter((file) => file.endsWith(".json"))) {
  client.la[`${langu.split(".json").join("")}`] = require(`./languages/${langu}`);
}


lang.init({
  lng: "en",
  resources: {
    en: {
        translation: client.la['en']
    },
    es: {
        translation: client.la['es']
    }
  },
});

/**********************************************************
 * Login The Bot
*********************************************************/
client.login(config.bot.token);