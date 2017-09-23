const async		= require( "async" );
const request		= require( "request" );
const cheerio		= require( "cheerio" );
const EventEmitter	= require( "events" );

// blog has an api, but as far as I can see the data we're after doesn't.. https://500.co/wp-json/

const fiveHundred = function( ){

	const _emitter = new EventEmitter( );

	const grab_link = function( link ){
		request( link, function( err, response, body ){
			if( err ){ _emitter.emit( "error", err ); }
			const $ = cheerio.load( body );
			const _link = $(".outline").attr("href");
			if( _link ){
				_emitter.emit( "link", _link );
			}
		} );
	}
	
	let next = "https://500.co/startups";
	let _links = [ ];
	async.whilst( function( ){
		return next;
	}, function( cb ){
		request( {
			method: "GET",
			url: next
		}, function( err, res, body ){
			if( err ){ return cb( err ); }
			
			const $ = cheerio.load( body );

			$(".entry-image a").each( function( i, link ){
				grab_link( $(link).attr("href") );
			} );

			// If we don't have 'next' defined, we've
			// been told to stop; Don't set it again.
			if( next ){
				const _prevNext = $(".prev-next");
				if( _prevNext.length == 2 ){
					next = $(_prevNext[1]).attr("href");
				}else{
					next = $(".prev-next").attr( "href" );
				}
			}

			return cb( null );
		} );
	}, function( err ){
		if( err ){ _emitter.emit("error"); }
		_emitter.emit("done");
		_emitter.removeAllListeners();
	} );

	// If we get the die message we should just stop.
	_emitter.once("die", function( ){
		next = false;
	} );

	return _emitter;
};

module.exports = fiveHundred;
