const Discord = require("discord.js");//
const { MessageEmbed } = require('discord.js')
const roles = require("../../../_BOOT/roles.json")
module.exports.execute = (client, message, args) => {//
  
  if(![(roles.BotCommands)].some(role => message.member.roles.cache.get(role)) && (!message.member.hasPermission("ADMINISTRATOR"))) 
    return message.channel.send(new MessageEmbed().setDescription(`${message.author} Komutu kullanmak için yetkin bulunmamakta.`).setFooter(ayarlar.Footer).setColor('0x800d0d').setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setTimestamp()).then(x => x.delete({timeout: 5000}));
    
  
  let kanal = args[1];
          let kullanici = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
          if (!kullanici) return message.channel.send(new MessageEmbed().setDescription("Taşıyacağın kişiyi etiketlemelisin!").setFooter(ayarlar.Footer)).then(x => x.delete({timeout: 5000}))
    if (!kanal) return message.channel.send(new MessageEmbed().setDescription("Taşıyacağın kanalın İD'sini belirtmeyi unuttun.").setFooter(ayarlar.Footer)).then(x => x.delete({timeout: 5000}))
   
    kullanici.voice.setChannel(`${kanal}`)
        .then(() =>
            message.channel.send(new MessageEmbed().setDescription(`${kullanici} **<#${kanal}>** adlı kanala taşındı.`).setFooter(ayarlar.Footer))).then(x => x.delete({timeout: 5000}))
        .catch(console.error);
}

module.exports.configuration = {
  name: "taşı",
  aliases: [],
  usage: "",
  description: ""
};