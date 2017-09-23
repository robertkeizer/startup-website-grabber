# Startup Website Grabber

Provides for an easy way to grab URLs of startup companies. 

 - [x] Grabs startup website links.
 - [ ] Takes screenshot of main page.
 - [ ] Takes video of website scroll.
 - [ ] Gets performance metrics of website JS runtime.

## Usage

### constructor( callback )
`callback` takes the form of `( err, instance )` and is called when the initial loading of the module is done. Not using the callback results in a race condition when attempting to load and use providers.

### grab( *howMany=100*, *providerName="500"*, callback )
Start to grab links and emit them. Both *howMany* and *providerName* are optional. `callback` takes a single error as an argument.

### availableProviders()
Returns a simple array of names of providers; Right now only 500 Startups is used.

### stop()
If you'd like to stop the grab that is currently going on.

## Examples
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

## License
[2-Clause BSD](https://opensource.org/licenses/BSD-2-Clause)
