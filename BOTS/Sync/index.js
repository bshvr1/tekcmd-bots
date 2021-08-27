const Discord = require("discord.js");
const fs = require("fs");
const { MessageEmbed } = require("discord.js");
const client = new Discord.Client();
const db = require("fera.db")
const system = require("../../_BOOT/system.json")
const tokens = require("../../_BOOT/tokens.json")
const roles = require("../../_BOOT/roles.json")
const channels = require("../../_BOOT/channels.json")
const extendss = require("../../_BOOT/extends.json")
const config = require("../../_BOOT/chatguard.json")
const whitelist = require("../../_DATABASE/whitelistchat.json")
const Owners = require("../../_BOOT/guards.json")


fs.readdir("./BOTS/Sync/Events", (err, files) => {
  if(err) return console.error(err);
  files.filter(file => file.endsWith(".js")).forEach(file => {
      let prop = require(`./Events/${file}`);
      if(!prop.configuration) return;
      client.on(prop.configuration.name, prop);
  });
});

client.on('ready', async () => {
  client.user.setPresence({ activity: { name: system.Bot_Type }, status: system.Bot_Status });
  console.log(`${client.user.tag} İsmi ile giriş yapıldı.Sync Bot Online`)
    let sesKanal = client.channels.cache.get(system.Bot_Voice_Channel);
    if(sesKanal) sesKanal.join().catch();    
});

function guvenli(kisiID) {
  let uye = client.guilds.cache.get(config.guildID).members.cache.get(kisiID);
  let guvenliler = whitelist.whitelist || [];
  if (!uye || uye.id === client.user.id || uye.id === uye.guild.owner.id || guvenliler.some(g => uye.id === g.slice(0) || uye.roles.cache.has(g.slice(0)))) return true
  else return false;
};

const usersMap = new Map();
const LIMIT = 6;
const TIME = 10000;
const DIFF = 2000;
//UYARIYA KARŞI DEVAM ETME
client.on("message" ,  message => {
if(message.author.bot || !message.guild) return;
if(message.member.hasPermission('ADMINISTRATOR') || guvenli(message.member.id)) return;
if(message.member.roles.cache.get(config.mutedRole)) return;

if(usersMap.has(message.author.id)) {
const userData = usersMap.get(message.author.id);
const {lastMessage, timer} = userData;
const difference = message.createdTimestamp - lastMessage.createdTimestamp;
let msgCount = userData.msgCount;

if(difference > DIFF) {
clearTimeout(timer);
userData.msgCount = 1;
userData.lastMessage = message;
userData.timer = setTimeout(() => {
 usersMap.delete(message.author.id);
}, TIME);
usersMap.set(message.author.id, userData)
}
else{
msgCount++;
if(parseInt(msgCount) === LIMIT) {
   const mutedRole = message.guild.roles.cache.get(config.mutedRole)
    if(message.member.roles.cache.get(config.mutedRole)) return;
    message.channel.send(`!mute ${message.member} 10m Spam Yapmak`)

setTimeout(() => {
 if(!message.member.roles.cache.get(config.mutedRole)) return;
 message.member.roles.remove(mutedRole);
}, 300000);
   }else {
 userData.msgCount = msgCount;
 usersMap.set(message.author.id, userData)
}}}
else{
let fn = setTimeout(() => {
 usersMap.delete(message.author.id)
}, TIME);
usersMap.set(message.author.id, {
msgCount: 1,
lastMessage: message,
timer: fn
})}});

client.login(tokens.Sync)