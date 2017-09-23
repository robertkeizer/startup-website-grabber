describe( "500", function( ){
	const FiveHundred = require( "../src/providers/500" );
	
	it.skip( "Can return a list of websites (long)", function( cb ){

		const fiveHundred = FiveHundred( );
		let _links = [ ];
		fiveHundred.on( "link", function( link ){ _links.push(link); } );

		fiveHundred.on( "done", function( ){
			if( _links.length == 0 ){ return cb( "no links" ); }
			return cb( null );
		} );

		fiveHundred.on( "error", cb );
	} );
} );
