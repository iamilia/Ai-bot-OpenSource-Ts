import {
  Client,
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  ChatInputCommandInteraction,
  ButtonBuilder,
} from "discord.js";
import ping from "../../buttons/ping";

export default {
  data: new SlashCommandBuilder().setName("ping").setDescription("ping test"),

  run: async (client: Client, interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const btn = new ActionRowBuilder<ButtonBuilder>().addComponents(ping.data);
    const embed = new EmbedBuilder()
      .setColor("#FF0000")
      .setTitle("🏓 Pong")
      .setDescription(`Ping : ${client.ws.ping}ms`)
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
      });
    interaction.followUp({ embeds: [embed], components: [btn] });
  },
};
