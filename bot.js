const Discord = require('discord.js');

const reducer = (accumulator, currentValue) => accumulator + currentValue;

//Configure script variables
var feasts = [{name:'Family',dish:'',user:'',confirmed:0,notColors:[0,0,0]},
{name:'Imperial Main',dish:'',user:'',confirmed:0,notColors:[0,0,0]},
{name:'Imperial Side',dish:'',user:'',confirmed:0,notColors:[0,0,0]}];
var date = new Date();
const colors = ["Silver","Brown","Gold"];
var schedule = [{name:"Sunday",members:[{name:"Raconar",snowflake:"",notify:0,tag:0}]},
{name:"Monday",members:[{name:"Raconar",snowflake:"",notify:0,tag:0}]},
{name:"Tuesday",members:[{name:"Raconar",snowflake:"",notify:0,tag:0}]},
{name:"Wednesday",members:[{name:"Raconar",snowflake:"",notify:0,tag:0}]},
{name:"Thursday",members:[{name:"Raconar",snowflake:"",notify:0,tag:0}]},
{name:"Friday",members:[{name:"Raconar",snowflake:"",notify:0,tag:0}]},
{name:"Saturday",members:[{name:"Raconar",snowflake:"",notify:0,tag:0}]}];
var contributors = [];

function reverseValue(currentValue){
	return !currentValue;
}
function clearDataForToday(){
	let f
	for(f in feast){
		feasts[f].dish = '';
		feasts[f].confirmed = 0;
		feasts[f].notColors = [0,0,0];
	}
	contributors = [];
}
function updateFeastData(repost = 0,channel){
	if(channel === undefined) throw "No Channel was provided. This is a required field for this method."
	
	let currentDate = new Date();
	let currentWeekday = currentDate.getDay();
	
	let todaysMembersForFeasts = []
	for(let memb in schedule[currentWeekday].members){
		todaysMembersForFeasts.push(schedule[currentWeekday].members[memb].name);
	}
	let displayColors = "";
	for(let f in feasts){
		let displayNot = "";
		for(let color in colors){
			if(feasts[f].notColors[color]) displayNot = `Not ${colors[color]}`;
		}
		displayColors += `\n${feasts[f].name} - ${(feasts[f].dish) ? (feasts[f].dish + ((feasts[f].confirmed) ? ' ✅ Confirmed':'')) : ((displayNot) ? displayNot : "?")}`;
	}
	
let displayMessage = `${schedule[currentWeekday].name} ${currentDate.getMonth()+1}/${currentDate.getDate()}\nFeast Day for:  ${todaysMembersForFeasts + displayColors}`;
	//.replace("<Day>",).replace("<MemberList>",todaysFeasts);
	if(repost){
		channel.send(displayMessage);
	}else{
		//find and edit pinned message
	}
}
// Initialize Discord client
const client = new Discord.Client();
client.on('ready', (evt) => {
    console.log(`Logged in as ${client.user.tag}!`);
	//console.log("\u{270D}");
	
});

client.on('message', message => {
	//Stop running if the user posting is a bot
	if(message.author.bot) return;
	else message.channel.startTyping(100);
	
	
    // Our client needs to know if it will execute a command
    // It will listen for messages that will start with `!`
	
	if(message.content.substring(0, 1) === '!') {
		var args = message.content.substring(1).toLowerCase().split(' ');
        console.log("command processing started on " + message.channel + "by" + message.author.tag + " - " + message.content);
		var c = Math.floor(args.length / 3);
		var i = 0;
		var actionTaken = 0;
		do{
			var cmd = args[i*3];
			var takeAction = null;
			switch(true) {
				// identify if getting help, changing, config, etc.
				case (cmd === 'h' || cmd === 'help' || cmd === 'commands' || cmd === '?' || cmd === 'cmds' || cmd === 'cmd'):
			console.log(`help requested on ${message.channel} by ${message.author.tag} (${message.author.username})`);
					message.author.send("Help Text blah blah blah");
					message.delete();
					takeAction = 0;
					break;
				case (args.length >= 3 && (cmd === 'f' || cmd === 'family')):
					takeAction = 1;
					break;
				case (args.length >= 3 && (cmd === 'im' || cmd === 'imperial main')):
					takeAction = 2;
					break;
				case (args.length >= 3 && (cmd === 'is' || cmd === 'imperial side')):
					takeAction = 3;
					break;
				case ((cmd === 'clear')):
					takeAction = 4;
					break;
				default: message.react('✍🏼')
				.catch(console.error);
				takeAction = 0;
			 }
			 if(takeAction > 0 && takeAction < 4){
				 var dish = 4;
				 switch(args[i*3+2].substring(0,1).toLowerCase()){
					 case 's': dish = 0;break;
					 case 'b': dish = 1;break;
					 case 'g': dish = 2;break;
					 default: takeAction = 0;
				 }
				 takeAction--;
				 if(dish <= colors.length){
					 switch(args[i*3+1].substring(0,1).toLowerCase()){
						case 'i':
						case '=':
						case 'e':
							feasts[takeAction].notColors[dish] = 0;
							if(feasts[takeAction].dish !== colors[dish]){
								feasts[takeAction].dish = colors[dish];
								feasts[takeAction].user = message.author.username
							} else if (feasts[takeAction].user !== message.author.username && !feasts[takeAction].confirmed){
								feasts[takeAction].confirmed = 1;
							}
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
								if(feasts[takeAction].notColors.reduce(reducer)===2 && (solutionByElimination !== -1) && feasts[takeAction].dish !== colors[solutionByElimination]){
									feasts[takeAction].dish = colors[solutionByElimination];
									feasts[takeAction].user = message.author.username
									console.log(feasts[takeAction].name + " color (" + colors[solutionByElimination] + ") found by process of elimination");
								}
							}
							break;
						case 'c':
							if(!feasts[takeAction].confirmed) {
								if(feasts[takeAction].dish === colors[dish]){
									feasts[takeAction].dish = '';
								}
								feasts[takeAction].notColors[dish] = 0;
							}
							break;
						default: takeAction = -1;
					}
				 }
				if(takeAction !== -1){
					// Delete User initiated command and post updated changes
					if(c === 1 || i === 1) {message.delete() .catch(console.error);}
					if(!(contributors.toString().includes(message.author.username))) contributors.push(message.author.username);
					actionTaken = 1;
				} //else message.react(?);
			 }
			 i++;//
		}while(i < c);
    } else message.react('✍🏼')//
				.catch(console.error);//
	if(actionTaken) try{updateFeastData(1,message.channel)}catch(e){console.error(e)};
	message.channel.stopTyping(true);
});
client.login(process.env.token);