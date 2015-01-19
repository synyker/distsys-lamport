var fs = require('fs');
var nl = require('os').EOL;

var config = process.argv[2];
var id = process.argv[3];
var nodes = [];

var path = process.cwd() + '/' + config;

var nodes = fs.readFileSync(path).toString().split('\n');

var dgram = require('dgram');
server = dgram.createSocket('udp4');

// Get the node's own port, host set to localhost regardless of anything
var port = nodes[id-1].split(' ')[2];
var host = nodes[id-1].split(' ')[1];

// Remove the node itself from the config file
nodes.splice(id-1, 1);
notReadyNodes = nodes.slice(0);

var events = 0
var clock = 0;

server.on('listening', function() {
	var address = server.address();
	console.log('listening on ' + address.address + ":" + address.port);

	setup = setInterval(pingOtherNodes, 100);
});



server.on('message', function(message, remote) {

	var messageContent = message.toString('utf8').trim();
	if (messageContent == 'PING') {

		var reply = new Buffer('PONG ' + host);
		server.send(reply, 0, reply.length, remote.port, remote.address, function (err, bytes) {
			if (err) throw err;
			console.log('Message sent to ' + remote.address + ':' + remote.port);
			
		});
	}

	// Receiving a reply to PING, thus the replying node is up and running
	if (messageContent.split(' ')[0] == 'PONG') {
		for (var i = 0; i < notReadyNodes.length; i++) {
			var remoteHost = notReadyNodes[i].split(' ')[1];
			var remotePort = notReadyNodes[i].split(' ')[2];
			
			if (remoteHost ==  messageContent.split(' ')[1] && remotePort == remote.port) {
				console.log('removing ' + remote.address+':'+remote.port);
				notReadyNodes.splice(i, 1)
			}
		}

		if (notReadyNodes.length == 1 && notReadyNodes[0] == '') {
			clearInterval(setup);
			console.log('READY TO RUN');
			running = setInterval(runProcess, 100);
		}
	}

	// Receiving message
	if (messageContent.split(' ')[0] == 's') {
		var senderId = messageContent.split(' ')[1].trim();
		var senderClock = messageContent.split(' ')[2].trim();

		clock = senderClock > clock ? senderClock+1 : clock + 1;

		console.log('r ' + senderId + ' ' + senderClock + ' ' + clock)
	}

});

// Listen to the port on localhost
server.bind(port, host);

function runProcess() {

	var localOrSend = randomInteger(1,2);

	// Local event
	if (localOrSend === 1) {
		var increase = randomInteger(1,5);
		clock += increase;
		events += 1;
		console.log('l ' + increase)
	}
	// Send message to other node
	else if (localOrSend === 2) {
		var receivingNode = nodes[randomInteger(0,nodes.length-1)].split(' ');
		var receivingId = receivingNode[0];
		var receivingHost = receivingNode[1];
		var receivingPort = receivingNode[2];

		var msg = new Buffer('s ' + id + ' ' + clock);
		server.send(msg, msg.length, receivingPort, receivingHost, function (err, bytes) {
			if (err) throw err;
		});
		console.log('s ' + receivingId + ' ' + clock);
	}

	if (events === 100) {
		clearInterval(running);
		process.exit();
	}
}

function pingOtherNodes() {
	
	for (var i = 0; i < notReadyNodes.length; i++) {
		if (notReadyNodes[i] != "") {
			var pingHost = notReadyNodes[i].split(' ')[1];
			var pingPort = notReadyNodes[i].split(' ')[2];
			var msg = new Buffer('PING');
			server.send(msg, 0, msg.length, pingPort, pingHost, function (err, bytes) {
				if (err) throw err;
			});
		}
	}
}

function randomInteger(min, max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}