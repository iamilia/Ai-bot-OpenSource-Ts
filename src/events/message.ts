import { ChannelType, EmbedBuilder, Message } from "discord.js";
import client from "../index";
let prefix = "i!"
export default {
    name: "messageCreate",
    run: async (msg: Message) => {
        if (!msg.member || msg.member.user.bot) return;
        if (!msg.guild) return;
        if (!msg.content.startsWith(prefix)) return;
        if (msg.channel.type !== ChannelType.GuildText) return;                
        let args = msg.content.substring(prefix.length).split(" ")
        const command = await client.Chatcommands.get(args[0].toLowerCase()) || client.Chatcommands.find((c) => c?.alia.includes(args[0].toLowerCase()));
        let nocmd_embed = new EmbedBuilder()
            .setDescription(`:x: | No Command Found! Try Using  \`/help\``)
            .setColor("Red")
            .setTimestamp();
        if (!command) return await msg.reply({ embeds: [nocmd_embed] });
        try {
            await command.run(client, msg, args);
        } catch (error) {
            console.error(error);
        }
    }
}