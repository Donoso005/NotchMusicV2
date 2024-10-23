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
 * Create Variables
 *********************************************************/
client.slashCommands = new Discord.Collection();
client.commands = new Discord.Collection();

/**********************************************************
 * Create languages
 *********************************************************/

la = {};

var langs = fs.readdirSync("./src/languages");

for (const langu of langs.filter((file) => file.endsWith(".json"))) {
  la[
    `${langu.split(".json").join("")}`
  ] = require(`./languages/${langu}`);
}

client.lang = lang;
client.lang.init({
  lng: "en",
  resources: {
    en: {
      translation: la["en"],
    },
    es: {
      translation: la["es"],
    },
  },
});

/**********************************************************
 * Load Logger
 *********************************************************/
client.logger = (data, status) => {
  let logstring;
  switch (status) {
    case "error":
      logstring = `${String(`NotchMusic Error`).brightRed}${` | `.grey}${
        `${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")}`.red
      }${` [::] `.magenta}`;
      break;
    case "warn":
      logstring = `${String(`NotchMusic Warn`).brightYellow}${` | `.grey}${
        `${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")}`.yellow
      }${` [::] `.magenta}`;
      break;
    case "success":
      logstring = `${String(`NotchMusic Success`).brightGreen}${` | `.grey}${
        `${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")}`.green
      }${` [::] `.magenta}`;
      break;
    default:
      logstring = `${String(`NotchMusic Info`).brightBlue}${` | `.grey}${
        `${moment().format("ddd DD-MM-YYYY HH:mm:ss.SSSS")}`.cyan
      }${` [::] `.magenta}`;
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
const eventsPath = path.join(__dirname, "events");
const events = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith("js"));

for (const file of events) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, ...args));
  } else {
    client.on(event.name, (...args) => event.execute(client, ...args));
  }
}


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
    } else {
      client.logger(
        `The command at ${filePath} is missing a required "data" or "execute" property.`,
        "warn"
      );
    }
    client.logger(`Loaded slash command ${file}`, "success")
  }
});

const rest = new REST().setToken(config.bot.token);

(async () => {
  try {
    client.logger(
      `Refreshing ${commands.length} Slash commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationCommands(config.bot.clientId), {
      body: commands,
    });

    client.logger(
      `Reloaded ${data.length} Slash commands.`,
      "success"
    );
  } catch (error) {
    client.logger(error, "error");
  }
})();


/**********************************************************
 * Login The Bot
 *********************************************************/
client.login(config.bot.token);
