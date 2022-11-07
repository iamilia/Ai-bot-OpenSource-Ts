import { ButtonInteraction } from "discord.js";
import client from "../index.js"

export default {
  name: "interactionCreate",

  run: async (interaction: ButtonInteraction) => {
    if (!interaction.isButton()) return;
    const command = client.buttons.get(interaction.customId);

    await interaction.deferReply();

    if (!command) {
      return interaction.followUp({ content: "An error occured while running the button" });
    } else {
      try {
        await command.default.run(client, interaction);;
      } catch (error) {
        await interaction.reply({
          content: "There was an error while executing this button!",
          ephemeral: true,
        });
        console.error(error)
      }
    }
  },
}