var qry = exports,
    irc = require('../irc.js'),
    rfc = require('./modules/ietf.js');



qry.load = function (tokens, context) {

    context.cmd.load(tokens[1], context);

    context.network.send(
	irc.outbound.say(context.sender,
			 'Dispatcher loaded.')
    );

};

qry.load.restricted = true;



qry.auth = function (tokens, context) {

    var correctPass = context.options.operators[context.sender];
    
    if (typeof context.options.
	    operators[context.sender] === 'undefined') {
	return;
    }
    
    if (tokens[1] !== correctPass) {
	context.network.send(
	    irc.outbound.say(context.sender, 'Invalid password.')
	);
    }
    else {
	context.authd[context.hostmask] = true;

	context.network.send(
	    irc.outbound.say(context.sender, 'You are now authentified.')
	);
    }
};

qry.auth.restricted = false;



qry.rfc = function(tokens, context) {
    
    tokens.shift();
    rfc.search(tokens.join(' '), function (link) {
	context.network.send(
	    irc.outbound.say(context.sender, link)
	);
    });
};

qry.rfc.restricted = false;



qry.join = function (tokens, context) {

    context.network.send(irc.outbound.join(tokens[1]));

};

qry.join.restricted = true;



qry.part = function (tokens, context) {

    if (tokens[1]) {
	context.network.send(irc.outbound.part(tokens[1]));
    }
    else if (context.channel) {
	context.network.send(irc.outbound.part(context.channel));
    }
};

qry.part.restricted = true;



qry.quit = function (tokens, context) {

    var quitmsg = tokens[1] || "";

    console.log('Quitting by order of ' + context.sender);
    context.network.send(irc.outbound.quit(quitmsg));
    process.exit();
    console.log(e.message);
};

qry.quit.restricted = true;



qry.ignore = function (tokens, context) {

    context.ignored[tokens[1]] = true;
    context.network.send(irc.outbound.say(context.sender, 'Ignoring ' + 
					 tokens[1] + '.'));
};

qry.ignore.restricted = true;



qry.unignore = function (tokens, context) {
    delete(context.ignored[tokens[1]]);

    context.network.send(
	    irc.outbound.say(
		context.sender, 
    		tokens[1] + ' is no longer being ignored.'
	    )
    );
};

qry.unignore.restricted = true;



qry.say = function (tokens, context) {

    var where = tokens[1],
	what  = tokens[2];

    context.network.send(irc.outbound.say(where, what));

};

qry.say.restricted = true;
