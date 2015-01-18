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
var host = '127.0.0.1';

// Remove the node itself from the config file
nodes.splice(id-1, 1);
notReadyNodes = nodes.slice(0);

server.on('listening', function() {
	var address = server.address();
	console.log('listening on ' + address.address + ":" + address.port);

	interval = setInterval(pingOtherNodes, 1000);
});



server.on('message', function(message, remote) {
	console.log(remote.address + ':' + remote.port + ' - ' + message);

	var messageContent = message.toString('utf8').trim();
	if (messageContent == 'PING') {

		var reply = new Buffer('PONG');
		server.send(reply, 0, reply.length, remote.port, remote.address, function(err, bytes) {
			if (err) throw err;
			console.log('Message sent to ' + remote.address + ':' + remote.port);
			
		});
	}

	if (messageContent == 'PONG') {
		for (var i = 0; i < notReadyNodes.length; i++) {
			var remoteHost = notReadyNodes[i].split(' ')[1];
			var remotePort = notReadyNodes[i].split(' ')[2];
			if (remoteHost == remote.address && remotePort == remotePort) {
				console.log('removing ' + remote.address+':'+remote.port);
				notReadyNodes.splice(i, 1)
			}
		}

		if (notReadyNodes.length == 0) {
			clearInterval(interval);
			console.log('JAHUUU');
		}
	}

});

// Listen to the port on localhost
server.bind(port, host);

function pingOtherNodes() {

	console.log(notReadyNodes);
		
	for (var i = 0; i < notReadyNodes.length; i++) {
		if (notReadyNodes[i] != "") {
			var remoteHost = notReadyNodes[i].split(' ')[1];
			var remotePort = notReadyNodes[i].split(' ')[2];
			var msg = new Buffer('PING');
			server.send(msg, 0, msg.length, remotePort, remoteHost, function(err, bytes) {
				if (err) throw err;
				console.log('sent PING to ' + remoteHost + ':' + remotePort);
			});
		}
	}
}
