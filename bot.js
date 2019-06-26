const Discord = require('discord.js');

const reducer = (accumulator, currentValue) => accumulator + currentValue;

//Configure script variables
var feasts = [{name:'Family',dish:'',user:'',confirmed:0,notColors:[0,0,0]},
{name:'Imperial Main',dish:'',user:'',confirmed:0,notColors:[0,0,0]},
{name:'Imperial Side',dish:'',user:'',confirmed:0,notColors:[0,0,0]}];
const colors = ["Silver","Brown","Gold"];
var schedule = [{name:"Sunday",members:["Raconar"]}];
var display = '';
var contributors = [];

function reverseValue(currentValue){
	return !currentValue;
}

// Initialize Discord client
const client = new Discord.Client();
client.on('ready', (evt) => {
    console.log(`Logged in as ${client.user.tag}!`);
	//console.log("\u{270D}");
	
});

client.on('message', message => {
	console.log("Contributors" + contributors)
	console.log(message.author.bot);
	//Stop running if the user posting is a bot
	if(message.author.bot) return;
	else message.channel.startTyping(100);
	
	
    // Our client needs to know if it will execute a command
    // It will listen for messages that will start with `!`
	
	if(message.content.substring(0, 1) === '!') {
		var args = message.content.substring(1).toLowerCase().split(' ');
        console.log("started - " + message.author.tag + " - " + message.content);
		var c = Math.floor(args.length / 3);
		var i = 0;
		do{
			var cmd = args[i*3];
			var takeAction = null;
			console.log(args.length);//
			switch(true) {
				// identify if getting help, changing, config, etc.
				case (cmd === 'h' || cmd === 'help' || cmd === 'commands' || cmd === '?' || cmd === 'cmds' || cmd === 'cmd'):
			console.log(`help requested by ${message.author.tag} (${message.author.username})`);
					message.author.send("Help Text blah blah blah");
					message.delete();
					takeAction = 0;
					break;
				case (args.length >= 3 && (cmd === 'f' || cmd === 'family')):
					console.log('f enterred');
					takeAction = 1;
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
				 var dish = 4;
				 switch(args[i*3+2].substring(0,1).toLowerCase()){
					 case 's': dish = 0;break;
					 case 'b': dish = 1;break;
					 case 'g': dish = 2;break;
					 default: takeAction = 1;
				 }
				 takeAction--;
				 if(dish <= colors.length){
					 switch(args[i*3+1].substring(0,1).toLowerCase()){
						case 'i':
						case '=':
						case 'e':
							if(feasts[takeAction].dish !== colors[dish]){
								feasts[takeAction].dish = colors[dish];
								feasts[takeAction].user = message.author.username
							} else if (feasts[takeAction].user !== message.author.username && !feasts[takeAction].confirmed){
								feasts[takeAction].confirmed = 1;
							}
							console.log(message.author.tag + " - " + message.content);
							console.log(message.author.tag + ((feasts[takeAction].confirmed) ? " confirms " : " indicates ") + `${colors[dish]} is the color for ${feasts[takeAction].name}.`);
							break;
						case 'n':
							if(feasts[takeAction].dish === colors[dish] && !feasts[takeAction].confirmed) {
								feasts[takeAction].dish = '';
								feasts[takeAction].confirmed = 0;
							}
							if(!feasts[takeAction].notColors[dish]){
								feasts[takeAction].notColors[dish] = 1;
								let solutionByElimination = feasts[takeAction].notColors.findIndex(reverseValue);
								console.log(solutionByElimination);
								if(feasts[takeAction].notColors.reduce(reducer)===2 && (solutionByElimination !== -1) && feasts[takeAction].dish !== colors[solutionByElimination]){
									feasts[takeAction].dish = colors[solutionByElimination];
									feasts[takeAction].user = message.author.username
									console.log(feasts[takeAction].name + " color (" + colors[solutionByElimination] + ") found by process of elimination");
								}
							}
							break;
						default: takeAction = -1;
					}
				 }
				if(takeAction !== -1){
					// Delete User initiated command and post updated changes
					if(c === 1 || i === 1) {message.delete() .catch(console.error);}
					if(!(contributors.toString().includes(message.author.username))) contributors.push(message.author.username);
					console.log(contributors);
					console.log(feasts);
				}
			 }
			 console.log(++i + " of " + c);//
		}while(i < c);
    } else message.react('✍🏼')
				.catch(console.error);
	message.channel.stopTyping(true);
});
client.login(process.env.token);