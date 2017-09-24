const fs		= require( "fs" );
const async		= require( "async" );
const EventEmitter	= require( "events" );
const util		= require( "util" );
const merge		= require( "merge" );
const puppeteer		= require( "puppeteer" );

const Grabber = function( options, cb ){
	EventEmitter.call( this );

	// Allow options to not be specified; This
	// shifts the arguments so that we still have the
	// callback function.
	if( !cb && typeof( options ) == "function" ){
		cb = options;
		options = { };
	}

	// Instance wide default options; Things such as
	// screen size if we take a screenshot/video, etc.
	const defaultOptions = {
		browser: {
			viewport: {
				width: 1280,
				height: 800
			}
		}
	};

	// Set the options instance wide.
	this.options = merge( defaultOptions, options );

	this._providers = [ ];

	const self = this;
	async.waterfall( [ function( cb ){
		fs.readdir( __dirname + "/providers", cb );
	}, function( files, cb ){
		return cb( null, files.filter( function( file ){
			return file.match( new RegExp( /.js$/ ) );
		} ).map( function( file ){
			return file.replace(".js","");
		} ) );
	}, function( providers, cb ){

		self._providers = providers.map( function( providerName ){
			return { name: providerName, required: require( __dirname + "/providers/" + providerName ) };
		} );

		return cb( null );
	} ], function( err ){
		if( err ){ throw new Error( err ); }
		return cb( null, self );
	} );
};

util.inherits( Grabber, EventEmitter );

Grabber.prototype.availableProviders = function( ){
	return this._providers.map( function( p ){ return p.name; } );
};

Grabber.prototype.grab = function( options, cb ){

	// Allow only a callback to be specified; Shift the
	// arguments.
	if( !cb && typeof( options ) == "function" ){
		cb = options;
		options = { };
	}

	// Define the default options that are going to be used
	// if a particular option isn't specified.
	const defaultOptions = {
		howMany: 100,
		provider: this._providers[Math.floor(Math.random()*this._providers.length)].name,
		links: true,
		screenshots: false
	};

	// Create a new object by using the default options and the options
	// that were specified.
	const optionsToUse = merge( defaultOptions, options );

	// Bail if we already have a grab going.
	if( this.inst ){
		return cb( "Grab already happening. If you want concurrency use multiple instances of the grabber." );
	}

	// Bail if we couldn't find the provider.
	const _providersFound = this._providers.filter( function( _provider ){
		return _provider.name == optionsToUse.provider;
	} );
	if( _providersFound.length == 0 ){
		return cb( "Provider '" + optionsToUse.provider + "' not found." );
	}
	const providerToUse = _providersFound[0];

	const self	= this;
	this.inst	= providerToUse.required( );
	let _count	= 0;

	// When we get a link, start the process of whether or not
	// we emit it, and whether we should kick off a screenshot
	// process.
	this.inst.on( "link", function( link ){

		// Increment the count so that we can determine
		// if we've gone over.
		_count++;

		// If we've hit the limit; Stop.
		if( _count >= optionsToUse.howMany ){
			self.stop();
		}

		// If we should be emitting links, let's 
		// emit that link.
		if( optionsToUse.links ){
			self.emit( "link", link );
		}

		// If we're emitting a screenshot, let's get 
		// that subroutine going; It takes care of
		// emitting.
		if( optionsToUse.screenshots ){

			// Kick off the screenshot process; Note that
			// we only have a function here to handle the
			// callback for errors, so that if it dies,
			// we also stop the instance grabbing more.
			self.getScreenshot( link, function( err ){
				if( err ){
					cleanupInst( );
					return cb( err );
				}
			} );
		}
	} );

	// Helper function that is called when there is
	// an error or the 'done' event fires; It clears the instnace
	// of the provider from the instance of the grabber.
	const cleanupInst = function( ){
		self.inst = undefined;
	};

	// Translate from events in the instance to callbacks in the grabber
	// instance. Also note that we clean up the instance here so that we can
	// call grab() again.
	this.inst.on( "error", function( err ){ cleanupInst(); return cb( err ); } );
	this.inst.on( "done", function( ){ cleanupInst(); return cb( null ); } );
};

// Get a screenshot for a particular url.
Grabber.prototype.getScreenshot = function( link, cb ){

	const self = this;
	async.waterfall( [ function( cb ){

		// Let's get the instance of chrome headless going;
		// If we have created a browserOpen already, let's
		// use it. Otherwise create a new one.

		// Either call connect() or launch(); They have the
		// same signature so we're good.
		const funcToUse = self._browserOpen ? "connect" : "launch";

		puppeteer[funcToUse]( ).then( function( browser ){
			return cb( null, browser );
		}, cb );

	}, function( browser, cb ){

		console.log( "I have a browser!" );
		console.log( browser );
		return cb( null );

	} ], function( err ){
		if( err ){ return cb( err ); }

		self.emit( "screenshot", {
			url: link,
			browser: this.options.browser,
			date: new Date( )
		} );
	} );

};

// Stops the instance that is running; Note that it 
// doesn't clear anything that is currently going on, it simply
// stops more queries from going out. There will be a delay of a few
// events after this .stop() being called before all events stop from
// this grabber instance.
Grabber.prototype.stop = function( ){
	if( this.inst ){ this.inst.emit( "die" ); }
};

module.exports = Grabber;
