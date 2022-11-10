import { Client, SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, WebhookClient, ComponentType, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
export default {
    data: new SlashCommandBuilder()
        .setName("announce")
        .setDescription("announce to server")
        .addStringOption((option) =>
            option.setRequired(true)
                .setName("titel")
                .setDescription("titel of announce embed")
        )
        .addStringOption((op) =>
            op.setRequired(true)
                .setName("desc")
                .setDescription("Description of announce embed")
        )
        .addStringOption(option =>
            option.setRequired(true)
                .setName('tag')
                .setDescription(" tag everyone or here or nothing")
                .addChoices(
                    { name: 'everyone', value: '@everyone' },
                    { name: 'here', value: '@here' },
                    { name: 'nothing', value: 'New Announce' },
                )
        )
        .addAttachmentOption((option) =>
            option.setName("attachment")
                .setDescription("file")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const attachment = interaction.options.getAttachment("attachment");
        const titel = interaction.options.getString("titel");
        const desc = interaction.options.getString("desc");
        const tag = interaction.options.getString("tag");
        const webhook = new WebhookClient({ url: String(process.env.WebHookAnnounce) })
        const em = new EmbedBuilder()
        em.setTitle(titel)
        em.setDescription(desc)
        if (attachment) {
            if (attachment && attachment.url && attachment.url.endsWith(".gif") || attachment.url.endsWith(".png") || attachment.url.endsWith(".jpg") || attachment.url.endsWith(".jpeg")) {
                em.setImage(attachment.url)
            }
        }
        em.setColor("DarkGrey")
        em.setTimestamp()
        let interaction_message = await interaction.reply({
            embeds: [
                em
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents([
                    new ButtonBuilder()
                        .setCustomId("proceed")
                        .setStyle(ButtonStyle.Success)
                        .setLabel("Proceed"),
                    new ButtonBuilder()
                        .setCustomId("cancel")
                        .setStyle(ButtonStyle.Danger)
                        .setLabel("Cancel")
                ]),
            ],
            ephemeral: true,
            fetchReply: true,
        });
        const collector = await interaction_message.createMessageComponentCollector(
            {
                componentType: ComponentType.Button,
                filter: (fn: any) => fn,
            }
        );
        collector.on("collect", async (i : any) => {
            if (i.customId === "proceed") {
                await webhook.send({
                    content: tag,
                    username: 'Announcement',
                    avatarURL: 'https://cdn.discordapp.com/attachments/993017479129469040/1029513625888620554/unknown.png',
                    embeds: [em],
                });
                i.update({
                    embeds: [
                        new EmbedBuilder()
                        .setColor("Green")
                        .setDescription("Done")
                    ],
                    components: [],
                });
            } else if (i.customId === "cancel") {
                i.update({
                    embeds: [
                        new EmbedBuilder()
                        .setColor("Green")
                        .setDescription("Cancelled")
                    ],
                    components: [],
                });
            }
        })
    },
};