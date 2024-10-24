const { EmbedBuilder } = require("discord.js");
const emoji = require(`${process.cwd()}/botconfig/emoji`);
const embedTemplate = require(`${process.cwd()}/botconfig/embedTemplate`);

function embedCreator(data) {
    author = data.autor ? data.autor : null;
    thumbnail = data.thumbnail ? String(data.thumbnail) : null;
    fields = data.fields ? Array.isArray(data.fields) ? data.fields : [data.fields] : [];
    if(data.timestamp == null) timestamp == false
    timestamp = Boolean(data.timestamp);

    const embed = new EmbedBuilder()
    if (data.title) embed.setTitle(data.title);
    if (data.url && typeof data.url === 'string' && data.url.length > 0) {embed.setURL(data.url)};
    if (author != "" || author != null) embed.setAuthor(author);
    if (data.description) embed.setDescription(data.description);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (fields.length > 0) embed.addFields(fields);
    if (data.image) embed.setImage(data.image);
    if (timestamp) embed.setTimestamp();
    if (data.footer) embed.setFooter(data.footer);
    embed.setColor(embedTemplate.color);

    return embed;
}

function msgConverter(text, options) {
    text = String(text);
    for (const option in options) {
        const toreplace = new RegExp(`{${option.toLowerCase()}}`, "ig");
        text = text.replace(toreplace, String(options[option]));
    }
    return text;
}

function checkBotPerms(interaction) {
    var missingPerm = null;




    return missingPerm;
}

module.exports.msgConverter = msgConverter;
module.exports.embedCreator = embedCreator;