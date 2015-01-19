var fs = require('fs');
var nl = require('os').EOL;

var config = process.argv[2];
var id = process.argv[3];
var nodes = [];

var path = process.cwd() + '/' + config;


var nodes = fs.readFileSync(path).toString().split('\n');

var net = require('net');

// Get the node's own port, host set to localhost regardless of anything
var port = nodes[id-1].split(' ')[2];
var host = 'ukko177.hpc.cs.helsinki.fi';//'127.0.0.1';

// Remove the node itself from the config file
nodes.splice(id-1, 1);
notReadyNodes = nodes.slice(0);


var server = net.createServer();
console.log(port);
console.log(host);
net.createServer(function(sock) {

	console.log('CONNECTION: ' + sock.remoteAddress + ':' + sock.remotePort);

	sock.on('data', function(data) {
		console.log(data);
	});

}).listen(port, host);

//interval = setInterval(pingOtherNodes, 1000);

function pingOtherNodes() {
		
	for (var i = 0; i < notReadyNodes.length; i++) {
		if (notReadyNodes[i] != "") {
			var remoteHost = notReadyNodes[i].split(' ')[1];
			var remotePort = notReadyNodes[i].split(' ')[2];
			var client = new net.Socket();
			client.connect(remotePort, remoteHost, function() {

				client.write('PING');
				console.log('sent PING to ' + remoteHost + ':' + remotePort);
			});
			
		}
	}
}
