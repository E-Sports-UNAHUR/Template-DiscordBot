import Discord from 'discord.js';
import { ValidateMember } from './servicios/validations.js';

const client = new Discord.Client({ intents: 33539 });
client.login(process.env.DS_TOKEN);
client.once('ready', async () => { // Usar 'once' para una única ejecución
    if (client.user) {
        console.log(`El bot está listo como ${client.user.tag}`);
        const guilds = client.guilds.cache.map(guild => guild.name);
        console.log('Guilds: '+ guilds);
        //const googleCredentials = await import('./configs/taller-unahur-e-sports-credentials.json', { assert: { type: 'json' } });

    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith('!')) {
        try{
            const command = message.content.toLowerCase().slice(1);
            console.log('Comando: '+ command);
        }
        catch(error){
            console.error(error);
        }
    }
});
// cuando un usuario ingresa al servidor
client.on('guildMemberAdd', async (member) => {
    console.log('Nuevo miembro: '+ member.user.tag);
    await ValidateMember(member);
});