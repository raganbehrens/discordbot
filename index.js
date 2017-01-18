//console.log("hello world")
var Discord = require("discord.js");
var bot = new Discord.Client();
//var raffle = require("./raffle.js");
var prefix = "//";
var fs = require("fs");
var lotteries = require("./lotteries.json");

let lotteriesjson = JSON.parse(fs.readFileSync('./lotteries.json', 'utf8'));


bot.on("message", msg => {
    if (msg.content.startsWith("//test")) {
        //createRaffle("testraffle.json")
        msg.channel.sendMessage("success\nsuccess");
    }
    if (msg.content.startsWith(prefix + 'help lottery')){

    }
    if (msg.content.startsWith(prefix + 'about')){
    	msg.channel.sendMessage('This bot is a work in progress.\nSource code can be found at https:\/\/github.com/raganbehrens/discordbot');
    }
    if (msg.content.startsWith(prefix + 'create lottery')){
    	let args = msg.content.split(" ");
    	if (args.length != 3){
    		msg.channel.sendMessage("command arguments incorrect")
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
    		msg.channel.sendMessage('command arguments incorrect');
    	}
    	else{
    		var res = addPlayer(args[2], args[1]);
	    	msg.channel.sendMessage(res);

    	}
    }
    if (msg.content.startsWith('//draw')){
    	let args = msg.content.split(" ");
    	if (args.length != 2){
    		msg.channel.sendMessage('command arguments incorrect');
    	}
    	else{
    		let res = draw(args[1]);
    		msg.channel.sendMessage(res);
    		delete lotteriesjson.lotteries[args[1]];
			fs.writeFile('./lotteries.json', JSON.stringify(lotteriesjson), (err) => {if(err) console.error(err)});

    	}
    }
    if (msg.content.startsWith(prefix + 'list')){
    	console.log(lotteriesjson.lotteries);
    	var numLots = Object.keys(lotteriesjson.lotteries).length;
    	var amounts = Object.keys(lotteriesjson.lotteries)
    	console.log(numLots);
    	var list = ("--------------------\n  Active Lotteries  \n--------------------\n")
    	// console.log(numLots);
    	for (count = 0; count < numLots; count++){
    		list += (count + ': ' + amounts[count] + ': ' + lotteriesjson.lotteries[amounts[count]].players.length + " players\n");
    	}
    	msg.channel.sendMessage(list);
    	
    }
    if (msg.content.startsWith(prefix + 'clear all')){
    	clearAll();
    	msg.channel.sendMessage("All lotteries cleared!");
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
		var text = ('{"players" : []}');
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

function addPlayer(name, amount){
	//console.log(lotteriesjson.lotteries[amount].players[0]);
	if(lotteriesjson.lotteries[amount] == null){
		return ("This lottery doesn't exist");
	}
	if(lotteriesjson.lotteries[amount].players.includes(name) == false){
		console.log("player is not entered");
		console.log(lotteriesjson);
		// var text = ('["' + name + '"]');
		var text = ('"' + name + '"')
		var jsontext = JSON.parse(text);
		console.log(jsontext);
		lotteriesjson.lotteries[amount].players.push(jsontext);
		console.log(lotteriesjson.lotteries[amount].players)
		console.log(lotteriesjson);
		fs.writeFile('./lotteries.json', JSON.stringify(lotteriesjson), (err) => {if(err) console.error(err)});
		return (name + " has been added to the " + amount + " lottery");
		console.log('player entered');
	}
	else{
		console.log("player is already entered")
	}
}

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
// function createRaffle(raffleName){
// 	console.log("creating new raffle")
// 	this.name = raffleName
// 	var lotteryFile = fs.readFileSync('./lottery.json');
// 	var json = JSON.parse(lotteryFile)
// 	var txt = ('{"raffles" : [' + '{ "players" : [' + ']}]}');
// 	var obj = JSON.parse(txt);
// 	json.push(obj);
// 	console.log(json)
// 	fs.open(raffleName, 'w+', function(err, fd) {
// 		if (err) {
// 			return console.error(err);
// 		}
// 		console.log(raffleName, "opened");
// 	});


