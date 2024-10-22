/**********************************************************
 * 1  Import_Modules
 * 2  Create Discord Bot Client
 * 3  Create languages
 * 4  Login The Bot
 *
 *   BOT CODED BY: Don_oso005
 *********************************************************/


/**********************************************************
 * Import Modules
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