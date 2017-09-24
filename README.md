# Startup Website Grabber

[![Travis CI](https://travis-ci.org/robertkeizer/startup-website-grabber.svg?branch=master)](https://travis-ci.org/robertkeizer/startup-website-grabber)


Provides for an easy way to grab URLs of startup companies. 

 - [x] Grabs startup website links.
 - [ ] Takes screenshot of main page.
 - [ ] Takes video of website scroll.
 - [ ] Gets performance metrics of website JS runtime.

## Usage

### constructor( callback )
`callback` takes the form of `( err, instance )` and is called when the initial loading of the module is done. Not using the callback results in a race condition when attempting to load and use providers.

### grab( *options*, callback )
Starts grabbing links and taking screenshots of websites based on the options specified. The `options` argument is optional, and defaults to the following:

```json
{
	howMany: 100,
	provider: randomProvider,
	links: true,
	screenshots: false
}
```

### availableProviders()
Returns a simple array of names of providers; Right now only 500 Startups is used.

### stop()
If you'd like to stop the grab that is currently going on.

## Examples
**Example**: Grab the first ~100 links from a random provider.
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

**Example**: Use an alternative limit on the maximum number of results returned from a specific provider.
```js
const StartupWebsiteGrabber = require( "startup-website-grabber" );
new StartupWebsiteGrabber( function( err, inst ){
	inst.on( "link", function( link ){
		console.log( link );
	} );

	inst.grab( { howMany: 1000, provider: "500" }, function( err ){
		// done the grab.
	} );
} );
```

## License
[2-Clause BSD](https://opensource.org/licenses/BSD-2-Clause)
