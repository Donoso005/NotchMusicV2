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
const settingsConsole = require("../botconfig/settingsConsole.json");
const fs = require("fs");
const path = require("path");
const winston = require("winston");
const colors = require("colors");
const moment = require("moment");
const { msgConverter } = require(`${process.cwd()}/src/functions/functions`);

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
 * Create Variables
 *********************************************************/
client.slashCommands = new Discord.Collection();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

/**********************************************************
 * Load languages
 *********************************************************/

function loadLanguages() {
  clientLang = {};

  var langs = fs.readdirSync("./src/languages");

  for (const langu of langs.filter((file) => file.endsWith(".json"))) {
    clientLang[
      `${langu.split(".json").join("")}`
    ] = require(`./languages/${langu}`);
  }

  return clientLang;
}

module.exports = loadLanguages;

/**********************************************************
 * Load Logger
 *********************************************************/

lang = loadLanguages();

client.logger = (data, status, type) => {
  if (status == null) status = "info";
  if(type == null) type = "log";

  switch (status) {
    case "error":
      logstring = `${
        `${msgConverter(`${lang[settingsConsole.lang].console.loggerHeader}`, {
          status: lang[settingsConsole.lang].console.status.error,
        })}`.brightRed
      }${`${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")}`.red}${
        ` [${lang[settingsConsole.lang].console.loggerInfo[type]}] `.magenta
      }`;
      break;
    case "warn":
      logstring = `${
        `${msgConverter(`${lang[settingsConsole.lang].console.loggerHeader}`, {
          status: lang[settingsConsole.lang].console.status.warn,
        })}`.brightYellow
      }${`${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")}`.yellow}${
        ` [${lang[settingsConsole.lang].console.loggerInfo[type]}] `.magenta
      }`;
      break;
    case "success":
      logstring = `${
        `${msgConverter(`${lang[settingsConsole.lang].console.loggerHeader}`, {
          status: lang[settingsConsole.lang].console.status.success,
        })}`.brightGreen
      }${`${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")}`.green}${
        ` [${lang[settingsConsole.lang].console.loggerInfo[type]}] `.magenta
      }`;
      break;
    default:
      logstring = `${
        `${msgConverter(`${lang[settingsConsole.lang].console.loggerHeader}`, {
          status: lang[settingsConsole.lang].console.status.info,
        })}`.brightBlue
      }${`${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")}`.cyan}${
        ` [${lang[settingsConsole.lang].console.loggerInfo[type]}] `.magenta
      }`;
  }

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

/**********************************************************
 * Load Handlers And Events
 *********************************************************/
//const handlers = fs.readdirSync("./src/handlers").filter((file) => file.endsWith("js"));

fs.readdirSync("./src/events/").forEach((dir) => {
  const eventsPath = path.join(__dirname, "events", dir);
  const events = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith("js"));

  for (const file of events) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args));
    }
    client.logger(`Loaded event ${file}`, "success", "event");
  }
});

/**********************************************************
 * Register Commands
 *********************************************************/
const { REST, Routes } = require("discord.js");

const commands = [];

fs.readdirSync("./src/commands/").forEach((dir) => {
  const commandsPath = path.join(__dirname, "commands", dir);
  const commandsFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith("js"));

  for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
      client.slashCommands.set(command.data.name, command);
      client.logger(`Loaded slash command ${file}`, "success", "command");
    } else {
      client.logger(
        `The command ${file} is missing a required "data" or "execute" property.`,
        "warn", "command"
      );
    }
  }
});

const rest = new REST().setToken(config.bot.token);

(async () => {
  try {
    client.logger(`Refreshing ${commands.length} Slash commands.`, "info", "command");

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(config.bot.clientId),
      {
        body: commands,
      }
    );

    client.logger(`Reloaded ${data.length} Slash commands.`, "success", "command");
  } catch (error) {
    client.logger(error, "error");
  }
})();

/**********************************************************
 * Login The Bot
 *********************************************************/
client.login(config.bot.token);
