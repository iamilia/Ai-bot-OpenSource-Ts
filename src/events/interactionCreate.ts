import { ChatInputCommandInteraction } from "discord.js";
import client from "../index.js"

export default {
  name: "interactionCreate",
  run: async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) {
      return interaction.followUp({ content: "An error occured while running the command" });
    } else {
      try {
        await command.run(client, interaction);
      } catch (error) {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
        console.error(error)
      }
    }
  },
}