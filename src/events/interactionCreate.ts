import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import client from "../index";

export default {
    name: "interactionCreate",
    run: async (interaction: ChatInputCommandInteraction) => {
        if (!interaction.isCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) {
            return interaction.followUp({
                content: "An error occured while running the command",
            });
        } else {
            try {
                await command.run(client, interaction);
            } catch (error) {
                console.log(error);
                await interaction[interaction.deferred ? 'editReply' : interaction.replied ? 'followUp' : 'reply']({
                    embeds: [new EmbedBuilder().setColor('Red').setDescription(`${error}` || 'Unexpected error')]
                });
            }
        }
    },
};