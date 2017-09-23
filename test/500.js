describe( "500", function( ){
	const FiveHundred = require( "../src/providers/500" );
	
	it( "Can return a list of websites", function( cb ){

		const fiveHundred = FiveHundred( );
		
		fiveHundred.on( "link", function( link ){
			console.log( link );
		} );

		fiveHundred.on( "done", function( ){
			return cb( null );
		} );

		fiveHundred.on( "error", cb );
	} );
} );
