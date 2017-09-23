# Startup Website Grabber

Provides for an easy way to grab URLs of startup companies. 

 - [x] Grabs startup website links.
 - [ ] Takes screenshot of main page.
 - [ ] Takes video of website scroll.
 - [ ] Gets performance metrics of website JS runtime.

## Usage

### grab( *howMany=100*, *providerName="500"*, callback )
Start to grab links and emit them. Both *howMany* and *providerName* are optional. `callback` takes a single optional error as an argument.

### availableProviders()
Returns a simple array of names of providers; Right now only 500 Startups is used.

### stop()
If you'd like to stop the grab that is currently going on.

**Example**: Grab the first ~100 links.
```js
const StartupWebsiteGrabber = require( "startup-website-grabber" );

new StartupWebsiteGrabber( function( err, inst ){
	inst.on( "link", function( link ){
		console.log( link );
	} );

	inst.grab( function( err ){
		// done the grab.
	} );
} );
```

**Example**: Use an alternative limit on the maximum number of results returned.
```js
const StartupWebsiteGrabber = require( "startup-website-grabber" );
new StartupWebsiteGrabber( function( err, inst ){
	inst.on( "link", function( link ){
		console.log( link );
	} );

	inst.grab( 1000, "500", function( err ){
		// done the grab.
	} );
} );
```
