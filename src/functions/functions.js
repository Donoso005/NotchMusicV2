const { EmbedBuilder } = require("discord.js");
const emoji = require(`${process.cwd()}/botconfig/emoji`);
const embedTemplate = require(`${process.cwd()}/botconfig/embedTemplate`);

function embedCreator(title, url, author, description, thumbnail, fields, image, timestamp, footer) {
    author = author ? author : null;
    thumbnail = thumbnail ? String(thumbnail) : null;
    fields = fields ? Array.isArray(fields) ? fields : [fields] : [];
    timestamp = Boolean(timestamp);

    const embed = new EmbedBuilder()
    if (title) embed.setTitle(title);
    if (url && typeof url === 'string' && url.length > 0) {embed.setURL(url)};
    if (author != "" || author != null) embed.setAuthor(author);
    if (description) embed.setDescription(description);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (fields.length > 0) embed.addFields(fields);
    if (image) embed.setImage(image);
    if (timestamp) embed.setTimestamp();
    if (footer) embed.setFooter(footer);
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

module.exports.msgConverter = msgConverter;
module.exports.embedCreator = embedCreator;