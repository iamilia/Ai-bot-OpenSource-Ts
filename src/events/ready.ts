// ActivityType.Competing = 5
// ActivityType.Listening = 2
// ActivityType.Playing = 0 
// ActivityType.Watching = 3
let lastst: string;
function Setst(client: any) :void {
    const st = ["dnd", "idle", "online"]
    const sta = st[Math.floor(Math.random() * st.length)]
    if (lastst == sta) return;
    lastst = sta
    client.user.setStatus(`${sta}`)
}
function SetAt(client: any) :void {
    const statusArray = ['Playing WIth Ts, 0', `Watching GithubSorce, 3`];
    const random = statusArray[Math.floor(Math.random() * statusArray.length)].split(', ')
    const status = random[0];
    const mode = parseInt(random[1]);
    client.user?.setActivity({ name: status, type: mode })
}
export default {
    name: "ready",
    run: async (client: any) => {
        console.log(`${client.user.tag} is up and ready to go!`);
        console.log(`${client.guilds.cache.size} servers, ${client.users.cache.size} members`);
        setInterval(() => {
            Setst(client)
            SetAt(client)
        }, 35000);
    },
}
