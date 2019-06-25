const Discord = require('discord.js');

//Configure script variables
var feasts = [{name:'Family',dish:'',user:'',confirmed:0,notColors:[0,0,0]},
{name:'Imperial Main',dish:'',user:'',confirmed:0,notColors:[0,0,0]},
{name:'Imperial Side',dish:'',user:'',confirmed:0,notColors:[0,0,0]}];
const colors = ["Silver","Brown","Gold"];
var schedule = [{name:"Sunday",members:["Raconar"]}];
var display = '';
var contributors = [];

// Initialize Discord client
const client = new Discord.Client();
client.on('ready', (evt) => {
    console.log(`Logged in as ${client.user.tag}!"`);
	//console.log("\u{270D}");
	
});

client.on('message', message => {
	console.log("Contributors" + contributors)
	console.log(message.author.bot);
	//Stop running if the user posting is a bot
	if(message.author.bot) return;
	else message.channel.startTyping(100);
	
	//client.channels[channelID].SimulateTyping();
	
	console.log("started - " + message.author.tag);
    // Our client needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.content.substring(0, 1) === '!') {
        var args = message.content.substring(1).toLowerCase().split(' ');
		var c = Math.floor(args.length / 3);
		var i = 0;
		do{
			var cmd = args[0];
			var takeAction = 1;
			console.log(args.length);
			switch(true) {
				// identify if getting help, changing, config, etc.
				case (cmd === 'h' || cmd === 'help' || cmd === 'commands' || cmd === '?' || cmd === 'cmds' || cmd === 'cmd'):
					console.log(`help requested by ${message.author.tag}`);
					message.author.send("Help Text blah blah blah");
					message.delete();
					takeAction = 0;
					break;
				case (args.length >= 3 && (cmd === 'f' || cmd === 'family')):
					console.log('f enterred');
					break;
				case (args.length >= 3 && (cmd === 'im' || cmd === 'imperial main')):
					console.log('im enterred');
					takeAction = 2;
					break;
				case (args.length >= 3 && (cmd === 'is' || cmd === 'imperial side')):
					console.log('is enterred');
					takeAction = 3;
					break;
				default: message.react('✍🏼')
				.catch(console.error);
				takeAction = 0;
			 }
			 if(takeAction){
				 var dish = 4
				 switch(args[2].substring(0,1).toLowerCase()){
					 case 's': dish = 0;break;
					 case 'b': dish = 1;break;
					 case 'g': dish = 2;break;
					 default: takeAction = 0;
				 }
				 takeAction--;
				 if(dish <= colors.length){
					 switch(args[1].substring(0,1).toLowerCase()){
						case 'i':
						case '=':
						case 'e':
							feasts[takeAction].dish = colors[dish];
							feasts[takeAction].user = message.author.name
							contributors.push(message.author.name);
							console.log(message.author.tag + " - " + message.content);
							console.log(`${message.author.tag} indicates ${colors[dish]} is the color for ${feasts[takeAction].name}.`);
							break;
						case 'n':
							if(feasts[takeAction].dish === colors[dish]) feasts[takeAction].dish = '';
							if(!feasts[takeAction].notColors[dish]){
								feasts[takeAction].notColors[dish] = 1;
								contributors.push(message.author.name);
								var x = 0;
								var potential = -1;
								var elimnationFound = 0;
								while(x<feasts[takeAction].notColors.length-1){
									if(x != dish && feasts[takeAction].notColors[x]){
										// Found by process of elimination
										eliminationFound = 1;
									} else if (x != dish && !(feasts[takeAction].notColors[x])){
										potential = x;
									}
								}
								if(elimnationFound){
									feasts[takeAction].dish = colors[potential];
									feasts[takeAction].user = message.author.name
									console.log(feasts[takeAction].name + "color found by process of elimination");
									
								}
							}
							feasts[takeAction].notColors
							break;
						default: takeAction = -1;
					}
				 }
				if(takeAction !== -1){
					// Delete User initiated command and post updated changes
					message.delete();
					var testPatt = /${message.author.username}/
					if(!(testPatt.test(contributors.toString()))) contributors.push(message.author.name);
					console.log(contributors);
				}
			 }
			 console.log(i + " of " + c);
			i++;
		}while(i < c)
    } else message.react('✍🏼')
				.catch(console.error);
	message.channel.stopTyping(true);
});
client.login(process.env.token);