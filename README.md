# startup-website-grabber

Provides for an easy way to grab URLs of startup companies. Currently scrapes 500 Startups to facilitate this.

# Interface

```
s = new StartupWebsiteGrabber( );
s.availableProviders( ) // [ "500" ]
s.grab( howMany = 100, whatProvider = "500", function( err ){ }
s.stop() // Stops grabbing links. 
```

# Examples

Default behaviour yields ~100 results.
```
const StartupWebsiteGrabber = require( "startup-website-grabber" );

const inst = new StartupWebsiteGrabber( );

inst.on( "link", function( link ){
	console.log( link ); // http://somestartupsite.tld
} );

inst.grab( function( err ){
	if( err ){
		 // Handle error
	}
	// done the grab.
} );
```

Specifying a provider (only '500' is available right now)
```
const StartupWebsiteGrabber = require( "startup-website-grabber" );

const inst = new StartupWebsiteGrabber( );

inst.on( "link", function( link ){
	console.log( link ); // http://somestartupsite.tld
} );

inst.grab( "500", function( err ){
	if( err ){
		 // Handle error
	}
	// done the grab.
} );
```

Alternative limit on the maximum number of results returned; Default is 100.
```
const StartupWebsiteGrabber = require( "startup-website-grabber" );

const inst = new StartupWebsiteGrabber( );

inst.on( "link", function( link ){
	console.log( link ); // http://somestartupsite.tld
} );

inst.grab( 1000, "500", function( err ){
	if( err ){
		 // Handle error
	}
	// done the grab.
} );
```
