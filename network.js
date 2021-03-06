var net = require('net'),
    irc = require('./irc.js'),
    utl = require('./util.js'),
    log = require('./log.js'),
    nwk = exports,
    server;

nwk.send = function (text) {
    
    if (text.match(/\r\n$/) == null) {
	text += '\r\n';
    }

    server.write(text);

};


nwk.connect = function (opt, callback) {

    log.debug({
	message: utl.interp('Connecting to {srv} on port {prt}',
			   {
			       srv: opt.server,
			       prt: opt.port
			   })
    });

    server = net.connect(opt.port, opt.server, function () {

	log.debug({ message: 'Connected.' });

	nwk.send(irc.outbound.pass(opt.pass));
	nwk.send(irc.outbound.nick(opt.nick));
	nwk.send(irc.outbound.user(opt.nick, opt.owner));

	opt.channels.forEach(function (channel) {
	    log.debug({ message: 'Joining channel ' + channel });
	    nwk.send(irc.outbound.join(channel));
	});

    });

    server.on('data', callback);
}
