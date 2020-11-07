const Discord = require('discord.js');
const { log } = require('console');
const { isContext } = require('vm');
const AntiSpam = require('discord-anti-spam');
const { cpuUsage } = require('process');
const config = require('./config.json');
const AS = new AntiSpam({
    warnThreshold: 3,
    kickThrehsold: 7,
    banThreshhold: 7,
    maxInterval: 2000,
    maxDuplicationWarning: 7,
    maxDuplicationKick: 10,
    maxDuplicationban: 12,
    exemptPermissions: [ 'ADMINISTRATOR' ],
    ignoreBots: true,
    verbose: true,
    ignoredUsers: []
});

const bot = new Discord.Client();
// Anti spam

AS.on("spamThresholdWarn", (member) => console.log(`${member.user.tag} has reached the warn threshold.`));

bot.on('message', (message) => AS.message(message));


// Main Bot
bot.on ('message', (message) => {

    const parts = message.content.split(' ');
    const user = message.mentions.users.first();

    // Report command
    // TODO: Update to give reason and better formated report.
    if(parts[0] == '-report' && parts[1] == user){
        message.reply('Please input valid arugments. `-report (member)`');
    }else if(parts[0] == '-report' && parts[1] != user){
        bot.channels.cache.get('732449908161773579').send(user.tag + ' has been reported by ' + message.author.tag);
        message.channel.send('The report has been sent to the staff team.');
    }

    // 726288762077708308 735843792778952714
    const staff = '735843792778952714';

    // Warn command

    if(parts[0] == '-warn'){
        if(user){
            if(message.member.hasPermission('VIEW_AUDIT_LOG')){
                const member = message.guild.member(user);
                if(member){
                    member.send(user.username + ' you have been warned by ' + message.author.tag)
                    .then(() => {
                        bot.channels.cache.get('732449908161773579').send(user.tag + ' has been warned by ' + message.author.tag);
                    })
                    .catch(err => {
                        message.reply('I was not able to warn this memeber.');
                    });
                }else{
                    message.reply('please mention the member you would like to warn');
                }
            }else{
                message.reply('you do not have permissions to warn this user');
            }
        }
    }
    
    // Kick command
    if(parts[0] == '-kick'){
        if(!user){
            message.reply('Please input valid arugments. `-kick (member)`');
        }
        if(user){
            if(message.member.hasPermission('KICK_MEMBERS')){
                const member = message.guild.member(user);
                if(member){
                    member.kick('Option reason')
                    .then(() => {
                         message.reply(user.username + ' has successfully been kicked');
                    })
                    .catch(err => {
                        message.reply('I was not able to kick this member.');
                        console.error(err);
                    });
                }else{
                    message.reply("please mention the use that you'd like to kick");
                }
            }else{
                message.reply('You do not have permission to use this command');
            }
        }
    }

    // Ban command
    // TOGO: Add reasons
    if(parts[0] == '-ban'){
        if(user){
            if(message.member.hasPermission('BAN_MEMBERS')){
                const member = message.guild.member(user);
                if(member){
                    member.send(user.username + ' you have been banned by ' + message.author.tag)
                    member.ban('reason')
                    .then(() => {
                        bot.channels.cache.get('732449908161773579').send(user.tag + ' has been banned from the server by ' + message.author.tag);
                        message.channel.send(user.tag + ' has been banned by ' + message.author.tag);

                    }) 
                    .catch(err => {
                        message.reply('I was unable to ban this member');
                        console.error(err);
                    });
                }else{
                    message.reply('please mention the user you would like to ban');
                }
            }
        }
    }

    // Commands


    if(message.content.startsWith('-online')){
        message.channel.send('Bot is ready');
    }


/*

    if(parts[0] == '-night'){
        if(user){
            if(message.author.bot) return;
                const member = message.guild.member(user);
                if(member){
                    message.channel.send(`${message.member} got pinged`);
                }
        }
    }
});

*/

// Blocked Words

bot.on("message", message => {
        // Banned Word List
        const blocked = config.BANNED_WORDS;

        const user = message.mentions.users.first();
        const member = message.guild.member(user);


        if(blocked.some(word => message.content.includes(word))){
            message.delete()
            .then(msg => message.reply(" You have been warned for saying a inappropriate word"))
            .then(bot.channels.cache.get('732449908161773579').send(message.author.username + ' has been warned for using a banned word'))
            .catch(console.error);
        }
})

// Suggestions
// TODO: WORK ON VALID REASON OUTPUT

bot.on("message", (message) => {

    const user = message.mentions.users.first();
    const parts = message.content.split(' ');
    const command = parts.shift().toLowerCase();

/*
    if(command === '-suggest'){
        const suggest = bot.channels.cache.get('740591681434419261').send('Suggestions from ' + message.member.user.username + ': \n' + parts.join(' '));
        message.channel.send('Suggestion:\n' + parts.join(' '))
        .catch(err)
    }
*/
})



bot.login(config.BOT_TOKEN);