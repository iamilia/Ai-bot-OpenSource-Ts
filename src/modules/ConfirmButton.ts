import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";

export async function ConfirmButton(
  interaction: ChatInputCommandInteraction,
  embed: EmbedBuilder
) {
  const msg = await interaction.reply({
    embeds: [embed],
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("proceed")
          .setStyle(ButtonStyle.Success)
          .setEmoji("✔️")
          .setLabel("Proceed"),
          new ButtonBuilder()
          .setCustomId("cancel")
          .setEmoji("❌")
          .setStyle(ButtonStyle.Danger)
          .setLabel("Cancel")
      ),
    ],
    fetchReply : true
  });
  const i : any = await msg
    .awaitMessageComponent({
      time: 1000 * 60,
      filter: (w: any) => w.user.id === interaction.user.id,
    })
    .catch(() => null);
  if (!i)
    return {
      proceed: false,
      reason: "Reason: Inactivity Timeout",
      i: null,
    };
  return {
    proceed: i.customId == "proceed", // true/false
    i,
  };
}
