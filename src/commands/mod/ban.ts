import { Client, SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, GuildMember, EmbedBuilder, time, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ComponentBuilder, ComponentData, } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("ban member from discord")
        .setDMPermission(false)
        .addUserOption((option) =>
            option.setName("user").setDescription("Target to ban").setRequired(true)
        )
        .addStringOption((option) =>
            option.setRequired(true).setName("reason").setDescription("reason to ban")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const Target = interaction.options.getMember("user")
        const member = Target as unknown as GuildMember
        const reason = interaction.options.getString("reason")
        if (!member.bannable)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`I don't have permissions to ban ${member}.`),
                ],
            });
        if (member.id === interaction.user.id)
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`You cannot ban yourself.`),
                ],
            });






        let interaction_message = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Pending Conformation")
                    .setColor("Blurple")
                    .setDescription(
                        `Are you sure you want to ban ${member} for reason: \`${reason}\`?`
                    )
                    .setFooter({ text: "You have 60 seconds." })
            ],
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
        const collector = interaction_message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: (w: any) => w,
        });
        collector.on("collect", async (but: any ) => {
            if (but.user.id !== interaction.user.id)
                return await but.reply({
                    content: `These buttons are not for you.`,
                    ephemeral: true,
                });
            if (but.customId === "proceed") {
                await but.deferUpdate();
                const embed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setDescription(`**${member.user.tag}** was banned for \`${reason}\`.`);

                try {
                    await member.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("You were banned")
                                .setColor("Blurple")
                                .addFields(
                                    { name: `Reason`, value: `${reason}` },
                                    { name: `ServerName : `, value: `${interaction.guild?.name}` },
                                    { name: `time :`, value: time(new Date(), "F") }
                                ),
                        ],
                    });
                } catch (err) {
                    embed.setFooter({
                        text: `I was not able to DM inform them`,
                    });
                }
                await interaction.editReply({
                    embeds: [embed],
                    components: [],
                });
                return await member.ban({ reason: `${reason}` });
            } else if (but.customId === "cancel") {
                await but.deferUpdate();
                const embed = new EmbedBuilder()
                    .setTitle("Process Cancelled")
                    .setColor("Blurple")
                    .setDescription(`${member} was not banned.`);
                embed.setFooter({ text: `${reason}` });
                await interaction.followUp({
                    embeds: [embed],
                    components: [],
                });
            }
        });
    },
};