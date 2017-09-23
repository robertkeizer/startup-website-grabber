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

	it( "grab works with all arguments specified", function( cb ){
		const Grabber = require( "../src/grabber" );
		new Grabber( function( err, inst ){
			if( err ){ return cb( err ); }
			
			let _links = [ ];
			inst.on( "link", function( link ){
				_links.push( link );
			} );
			inst.grab( 1, "500", function( err ){
				if( err ){ return cb( err ); }
				if( _links.length > 0 ){ return cb( null ); }
				return cb( "No results returned." );
			} );
		} );
	} );

	it( "grab works with optional provider", function( cb ){
		const Grabber = require( "../src/grabber" );
		new Grabber( function( err, inst ){
			if( err ){ return cb( err ); }
			
			let _links = [ ];
			inst.on( "link", function( link ){
				_links.push( link );
			} );
			inst.grab( 1, function( err ){
				if( err ){ return cb( err ); }
				if( _links.length > 0 ){ return cb( null ); }
				return cb( "No results returned." );
			} );
		} );
	} );

	it( "grab works with only a callback", function( cb ){
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
} );
