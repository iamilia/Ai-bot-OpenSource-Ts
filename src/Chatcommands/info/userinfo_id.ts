import { Client, EmbedBuilder, Message } from "discord.js";

export default {
    name : "userinfoid",
    alia : ["infoid", "userid"],
    run : async (client : Client, message : Message, args : string[])=> {
        if (!args[1]) return message.reply({content : `pleas enter a number`})
        const targets = args[1];
        client.users.fetch(targets.toString()).then((target) => {
            const iconur = `https://cdn.discordapp.com/avatars/${target.id}/${target.avatar}.png?size=4096`
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${target.username}#${target.discriminator}`, iconURL: `${iconur}` })
                .setTitle(`Information about ${target.username}:`)
                .setColor('Red')
                .setThumbnail(`${iconur}`)
                .addFields(
                    { name: '► Name:', value: `${target.username}`, inline: true },
                    { name: '► ID:', value: `${target.id}`, inline: true },
                    { name: '► Bot', value: `${target.bot ? '✅' : '❌'}`, inline: true },
                );
            message.reply({ embeds: [embed] });
        }).catch(() => {
            const embed = new EmbedBuilder()
            .setColor('Blue')
            .setDescription("eror to get user")
            message.reply({ embeds: [embed] });
        });             
    }
}