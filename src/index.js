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
const path = require("path");
const winston = require("winston");
const colors = require("colors");
const moment = require("moment");

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
  client.la[
    `${langu.split(".json").join("")}`
  ] = require(`./languages/${langu}`);
}

client.lang = lang;
client.lang.init({
  lng: "en",
  resources: {
    en: {
      translation: client.la["en"],
    },
    es: {
      translation: client.la["es"],
    },
  },
});

/**********************************************************
 * Load Handlers And Events
 *********************************************************/
const handlers = fs
  .readdirSync("./src/handlers")
  .filter((file) => file.endsWith("js"));
const eventsPath = path.join(__dirname, "events");
const events = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith("js"));

for (const file of events) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

/**********************************************************
 * Load Logger
 *********************************************************/
client.logger.info = (data) => {
  let logstring = `${String(`NotchMusic Logs`).brightGreen}${` | `.grey}${
    `${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")}`.cyan
  }${` [::] `.magenta}`;
  if (typeof data == "string") {
    console.log(
      logstring,
      data
        .split("\n")
        .map((d) => `${d}`.green)
        .join(`\n${logstring} `)
    );
  } else if (typeof data == "object") {
    console.log(logstring, JSON.stringify(data, null, 3).green);
  } else if (typeof data == "boolean") {
    console.log(logstring, String(data).cyan);
  } else {
    console.log(logstring, data);
  }
};

client.logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

/**********************************************************
 * Login The Bot
 *********************************************************/
client.login(config.bot.token);
