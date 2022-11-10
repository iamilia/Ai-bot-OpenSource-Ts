import {
    Client,
    ButtonInteraction,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js";

export default {
    data: new ButtonBuilder()
        .setCustomId("ping")
        .setEmoji("🧪")
        .setLabel("Testing Button!")
        .setStyle(ButtonStyle.Primary),

    run: async (client: Client, interaction: ButtonInteraction) => {
        const embed = new EmbedBuilder()
            .setColor("#123456")
            .setTitle("Button worked!")
            .setDescription("You can use button like this")
            .setTimestamp()
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: `${interaction.user.displayAvatarURL()}`,
            });
        interaction.followUp({ embeds: [embed] });
    },
};
