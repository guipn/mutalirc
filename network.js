var net = require('net'),
    irc = require('./irc.js'),
    nwk = exports,
    server;

nwk.send = function (text) {
    
    if (text.match(/\r\n$/) == null) {
	text += '\r\n';
    }

    server.write(text);

};


nwk.connect = function (opt, callback) {

    console.log('Connecting to ' + opt.server + ' on port ' +
		opt.port + '...');

    server = net.connect(opt.port, opt.server, function () {

	console.log('Connected.');

	nwk.send(irc.outbound.nick(opt.nick));
	nwk.send(irc.outbound.profile(opt.nick, opt.owner));

	opt.channels.forEach(function (channel) {
	    console.log('Joining channel ' + channel);
	    nwk.send(irc.outbound.join(channel));
	});

    });

    server.on('data', callback);
}
