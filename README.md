# Startup Website Grabber

Provides for an easy way to grab URLs of startup companies. 

 - [x] Grabs startup website links.
 - [ ] Takes screenshot of main page.
 - [ ] Takes video of website scroll.
 - [ ] Gets performance metrics of website JS runtime.

## Getting Started

### availableProviders()
Returns a simple array of names of providers; Right now only 500 Startups is used.

### grab( *howMany*, *providerName*, cb )
Both *howMany* and *providerName* are optional. Defaults to 100 and "500" for 500 Startups.

### stop()
If you'd like to stop the grab that is currently going on.

## Examples
```js
const StartupWebsiteGrabber	= require( "startup-website-grabber" );
const inst			= new StartupWebsiteGrabber( );

inst.on( "link", function( link ){
	console.log( link );
} );

inst.grab( function( err ){
	// done the grab.
} );
```

Alternative limit on the maximum number of results returned; Default is 100.
```
const StartupWebsiteGrabber	= require( "startup-website-grabber" );
const inst			= new StartupWebsiteGrabber( );

inst.on( "link", function( link ){
	console.log( link );
} );

inst.grab( 1000, "500", function( err ){
	// done the grab.
} );
```
