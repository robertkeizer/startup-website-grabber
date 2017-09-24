describe( "Grabber", function( ){
	it( "Returns a new instance via a callback on constructor", function( cb ){
		const Grabber = require( "../src/grabber" );
		new Grabber( function( err, inst ){
			if( err ){ return cb( err ); }
			if( !(inst instanceof Grabber) ){ return cb( "Not instance" ); }
			return cb( null );
		} );
	} );

	it( "availableProviders works", function( cb ){
		const Grabber = require( "../src/grabber" );
		new Grabber( function( err, inst ){
			if( err ){ return cb( err ); }
			if( inst.availableProviders( ).length == 0 ){
				return cb( "No providers" );
			}

			return cb( null );
		} );
	} );

	it( "Grab works with default options", function( cb ){
		const Grabber = require( "../src/grabber" );
		new Grabber( function( err, inst ){
			if( err ){ return cb( err ); }
			
			let _links = [ ];
			inst.on( "link", function( link ){
				_links.push( link );
			} );
			inst.grab( function( err ){
				if( err ){ return cb( err ); }
				if( _links.length > 0 ){ return cb( null ); }
				return cb( "No results returned." );
			} );
		} );
	} );

	it( "Grab fails if provider not found", function( cb ){
		const Grabber = require( "../src/grabber" );
		new Grabber( function( err, inst ){
			if( err ){ return cb( err ); }
			
			inst.grab( { provider: "nope" }, function( err ){
				if( !err ){
					return cb( "no error came back" );
				}
				return cb( null );
			} );
		} );
	} );
} );
