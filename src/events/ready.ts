export default {
  name: "ready",

  run: async (client: any) => {
    console.log(`${client.user.tag} is up and ready to go!`);
    console.log(`${client.guilds.cache.size} servers, ${client.users.cache.size} members`);
  },
}
