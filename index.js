//console.log("hello world")
var Discord = require("discord.js");
var bot = new Discord.Client();
//var raffle = require("./raffle.js");
var prefix = "//";
var fs = require("fs");
var lotteries = require("./lotteries.json");

let admin = ('256857380615225354')

let lotteriesjson = JSON.parse(fs.readFileSync('./lotteries.json', 'utf8'));

let command = "lottery"

bot.on("message", msg => {
    if (msg.content.startsWith(prefix + "test")) {
        //createRaffle("testraffle.json")
        //msg.channel.sendMessage("success\nsuccess");
        // console.log(msg.guild.roles.get("235173777351114752"));
		// console.log(myRole);
    }

    if (msg.content.startsWith(prefix + 'help')){
        msg.channel.sendMessage('Type //lottery help for lottery specific commands.');
    }

    if (msg.content.startsWith(prefix + command + ' help')){
    	var res = ('------------------------------------------\n            Lottery Commands             \n------------------------------------------\n');
    	var createCommand = ('Creating a lottery: //lottery create [amount]\n');
    	var listCommand = ('Retrieve list of active lotteries: //lottery list\n');
    	var entryCommand = ('Adding an entry: //lottery entry [amount] [# of entries] [player]\n');
    	var drawCommand = ('Draw from lottery: //lottery draw [amount]\n');
        var removeCommand = ('Remove player from lottery: //lottery remove [player] [amount]\n');
        var listPlayersCommand = ('Retrieve list of players in a lottery: //lottery players [amount]');
    	msg.channel.sendMessage(res + createCommand + listCommand + entryCommand + drawCommand + removeCommand + listPlayersCommand);
    	//var aboutCommand = ('Bot info and source code: //about');
    }

    if (msg.content.startsWith(prefix + 'about')){
    	msg.channel.sendMessage('This bot is a work in progress.\nSource code can be found at https:\/\/github.com/raganbehrens/discordbot');
    }

    if (msg.content.startsWith(prefix + command + ' create')){
    	let args = msg.content.split(" ");
    	if (args.length != 3){
    		msg.channel.sendMessage('Command arguments incorrect - Type "//lottery help" for usage');
    	}
    	else{
    		let res = createLottery(args[2]);
     		// msg.channel.sendMessage(args[2] + " lottery created");
     		msg.channel.sendMessage(res);
    	}
    }
    if (msg.content.startsWith(prefix + 'entry')){
    	let args = msg.content.split(" ");
    	if (args.length < 3){
    		msg.channel.sendMessage('Command arguments incorrect - Type "//lottery help" for usage');
        }
    }

    if (msg.content.startsWith(prefix + command + ' create')){
    	if (msg.member.roles.has('256857380615225354') || msg.member.roles.has('256857271051616266')){
	    	let args = msg.content.split(" ");
    		if (args.length != 3){
    			msg.channel.sendMessage('Command arguments incorrect - Type "//lottery help" for usage');
    		}
    		else{
    			let res = createLottery(args[2]);
     			// msg.channel.sendMessage(args[2] + " lottery created");
     			msg.channel.sendMessage(res);
    		}
        }
        else{
        	msg.channel.sendMessage('Fuck off pleb');
        }
    }
    if (msg.content.startsWith(prefix + command + ' entry')){
    	if (msg.member.roles.has('256857380615225354') || msg.member.roles.has('256857271051616266')){
    		let args = msg.content.split(" ");
    		if (args.length < 5){
    			msg.channel.sendMessage('Command arguments incorrect - Type "//lottery help" for usage');
    		}
    		else{
    			var res = addPlayer(args[4], args[3], args[2]);
	    		msg.channel.sendMessage(res);
    		}
    	}
    	else {
    		msg.channel.sendMessage('Fuck off pleb');
    	}
    }

        if (msg.content.startsWith(prefix + command + ' draw')){
            if (msg.member.roles.has('256857380615225354') || msg.member.roles.has('256857271051616266')){
                let args = msg.content.split(" ");
                if (args.length != 3){
                    msg.channel.sendMessage('Command arguments incorrect - Type "//lottery help" for usage');
                }
                else{
                    let res = draw(args[2]);
                    msg.channel.sendMessage(res);
                    delete lotteriesjson.lotteries[args[2]];
                    fs.writeFile('./lotteries.json', JSON.stringify(lotteriesjson), (err) => {if(err) console.error(err)});
                }
            }
            else{
                msg.channel.sendMessage('Fuck off pleb');
            }
        }
    
    if (msg.content.startsWith(prefix + 'list')){
    	console.log(lotteriesjson.lotteries);
    	var numLots = Object.keys(lotteriesjson.lotteries).length;
    	var amounts = Object.keys(lotteriesjson.lotteries)
    	console.log(numLots);
    	var list = ("--------------------\n  Active Lotteries  \n--------------------\n")
    	// console.log(numLots);
        var multiplier = ""
    	for (var count = 0; count < numLots; count++){
            if (isLetter(amounts[count].charAt(amounts[count].length-1))){
                multiplier = amounts[count].charAt(amounts[count].length-1);
            }
            numEntries = getPot(amounts[count]);
    		list += (count + ': ' + amounts[count] + ': ' + numEntries + " entries. Pot: " + numEntries * parseInt(amounts[count]) + multiplier);
    	}
    	msg.channel.sendMessage(list);
    	
    }

    if (msg.content.startsWith(prefix + 'clear all')){
    	if (msg.member.roles.has('256857380615225354') || msg.member.roles.has('256857271051616266')){
    		clearAll();
    		msg.channel.sendMessage("All lotteries cleared!");
    	}
    	else{
    		msg.channel.sendMessage("Fuck off pleb");
    	}
    }

    if (msg.content.startsWith(prefix + command + ' remove')){
        let args = msg.content.split(" ");
        res = removePlayer(args[2], args[3]);
        msg.channel.sendMessage(res);
    }

    if (msg.content.startsWith(prefix + command + ' players')){
        let args = msg.content.split(" ");
        res = listPlayers(args[2]);
        msg.channel.sendMessage(res);
    }
});

bot.on('ready', () => {
  console.log('Ready');

});

bot.login("MjcwMjk1MTk5NzUyNzgxODI0.C13zrA.qdmQYNhmSm3IMl7zJ9tvMyVA-eY");

function createLottery(amount){
	//console.log(lotteriesjson);
	//console.log(lotteriesjson.lotteries["100k"]);
	if (lotteriesjson.lotteries[amount] == null){
		var text = ('{"players" : {}}');
		var jsontext = JSON.parse(text);
		lotteriesjson.lotteries[amount] = jsontext
		console.log(lotteriesjson.lotteries)
		// lotteriesjson.lotteries.push(jsontext)
		console.log('it was null');
		fs.writeFile('./lotteries.json', JSON.stringify(lotteriesjson), (err) => {if(err) console.error(err)});
		console.log('updated file');
		return (amount + " lottery created");
	}
	else{
		return ('There is already a ' + amount + ' lottery active');
	}
	var lottery = lotteriesjson[amount];
	var text = ('{"players" : []}');
	var jsontext = JSON.parse(text);
	console.log(lottery);
	if (lottery == null){
		console.log('no lottery found')
		lotteries["100k"] = jsontext;
	}

}

function addPlayer(name, entries, amount){
    //console.log(lotteriesjson.lotteries[amount].players[0]);
    if(lotteriesjson.lotteries[amount] == null){
        return ("This lottery doesn't exist");
    }
    if(lotteriesjson.lotteries[amount].players[name] == null){
        console.log("player is not entered");
        //console.log(lotteriesjson);
        // var text = ('["' + name + '"]');
        //var text = ('{"' + name + '" : 1}' );
        //var jsontext = JSON.parse(text);
        //console.log(jsontext);
        lotteriesjson.lotteries[amount].players[name] = parseInt(entries);
        //console.log(lotteriesjson.lotteries[amount].players)
        console.log(lotteriesjson);
        fs.writeFile('./lotteries.json', JSON.stringify(lotteriesjson), (err) => {if(err) console.error(err)});
        return (name + " now has " + entries + " entries in the " + amount + " lottery");
        console.log('player entered');
    }
    else{
        console.log("player is already entered")
        lotteriesjson.lotteries[amount].players[name] += parseInt(entries);
        fs.writeFile('./lotteries.json', JSON.stringify(lotteriesjson), (err) => {if(err) console.error(err)});
        return (name + " now has " + lotteriesjson.lotteries[amount].players[name] + " entries in the " + amount + " lottery")
    }
}

function getPot(amount){
    let target = lotteriesjson.lotteries[amount].players
    var numEntries = 0
    for (var key in target){
        numEntries += parseInt(target[key]);
    }
    return numEntries
}

// function addPlayer(name, amount){
// 	//console.log(lotteriesjson.lotteries[amount].players[0]);
// 	if(lotteriesjson.lotteries[amount] == null){
// 		return ("This lottery doesn't exist");
// 	}
// 	if(lotteriesjson.lotteries[amount].players.includes(name) == false){
// 		console.log("player is not entered");
// 		console.log(lotteriesjson);
// 		// var text = ('["' + name + '"]');
// 		var text = ('"' + name + '"' );
// 		var jsontext = JSON.parse(text);
// 		console.log(jsontext);
// 		lotteriesjson.lotteries[amount].players.push(jsontext);
// 		console.log(lotteriesjson.lotteries[amount].players)
// 		console.log(lotteriesjson);
// 		fs.writeFile('./lotteries.json', JSON.stringify(lotteriesjson), (err) => {if(err) console.error(err)});
// 		return (name + " has been added to the " + amount + " lottery");
// 		console.log('player entered');
// 	}
// 	else{
// 		console.log("player is already entered")
//         lotteriesjson.lotteries[amount].players[name]++;
//         fs.writeFile('./lotteries.json', JSON.stringify(lotteriesjson), (err) => {if(err) console.error(err)});
//         return (name + "has been entered again")
// 	}
// }

function draw(amount){
	console.log("about to draw")
	numEntries = lotteriesjson.lotteries[amount].players.length
	var winner = Math.floor((Math.random() * numEntries));
	var intAmount = parseInt(amount);
	// var lotteryArr = Object.keys(lotteriesjson.lotteries)
	// var lotteryNumber = lotteryArr.indexOf('amount');
	var multiplier = ""
	if (isLetter(amount.charAt(amount.length-1))){
		multiplier = amount.charAt(amount.length-1);
	}
	var pot = numEntries * intAmount;
	return(lotteriesjson.lotteries[amount].players[winner] + ' has won ' + pot + multiplier + ' gp!');
}

function clearAll(){
	// console.log(lotteriesjson.lotteries);
	var numLots = Object.keys(lotteriesjson.lotteries).length;
	var amounts = Object.keys(lotteriesjson.lotteries)
	// console.log(numLots);
	var list = ("--------------------\n  Active Lotteries  \n--------------------\n")
	// console.log(numLots);
	for (count = 0; count < numLots; count++){
		list += (amounts[count] + ': ' + lotteriesjson.lotteries[amounts[count]].players.length + " players\n");
		delete lotteriesjson.lotteries[amounts[count]];
	}
	fs.writeFile('./lotteries.json', JSON.stringify(lotteriesjson), (err) => {if(err) console.error(err)});
	console.log(lotteriesjson);

}

function isLetter(c){
	return c.toLowerCase() != c.toUpperCase();
}

function removePlayer(name, amount){
    let target = lotteriesjson.lotteries[amount].players
    if (target[name] == null){
        return (name + ' is not in this lottery.');
    }
    else{
        delete target[name];
        fs.writeFile('./lotteries.json', JSON.stringify(lotteriesjson), (err) => {if(err) console.error(err)});
        console.log(target);
        return (name + ' has been removed this lottery');
    }
}

function listPlayers(amount){
    let target = lotteriesjson.lotteries[amount].players;
    var res = '---------- 100k ----------\n';
    for (var key in target){
        res += (key + ': ' + target[key] + ' entries\n');
    }
    console.log(res);
    return res
}