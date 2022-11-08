import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
export async function ConfirmButton(interaction : ChatInputCommandInteraction, embed : EmbedBuilder) {
    const msg = await interaction.reply({
        embeds: [embed],
        components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId("proceed")
                    .setStyle(ButtonStyle.Success)
                    .setLabel("Proceed"),
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setStyle(ButtonStyle.Danger)
                    .setLabel("Cancel")
            ),
        ],
        fetchReply: true,
    });

    const i = await msg
        .awaitMessageComponent({
            time: 1000 * 60,
            filter: (i) => i.user.id === interaction.user.id,
        })
        .catch(() => null);
    if (!i)
        return {
            proceed: false,
            reason: "Reason: Inactivity Timeout",
            i : null,
        };

    if (i.customId === "proceed")
        return {
            proceed: true,
            i,
        };
    return {
        proceed: false,
        i,
    };
}