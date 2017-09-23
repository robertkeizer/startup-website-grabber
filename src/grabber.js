const fs		= require( "fs" );
const async		= require( "async" );
const EventEmitter	= require( "events" );
const util		= require( "util" );

const Grabber = function( cb ){

	EventEmitter.call( this );

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

Grabber.prototype.grab = function( howMany, provider, cb ){

	// Both provider and howMany are optional; These just
	// allow us to mangle the arguments coming in.

	if( !cb && typeof( provider ) == "function" ){
		cb = provider;
		provider = this._providers[Math.floor(Math.random()*this._providers.length)].name;
	}else if( !cb && !provider && typeof( howMany ) == "function" ){
		cb = howMany;
		howMany = 100;
		provider = this._providers[Math.floor(Math.random()*this._providers.length)].name;
	}
	
	if( this.inst ){
		return cb( "Grab already happening. If you want concurrency use multiple instances of the grabber." );
	}

	const _providersFound = this._providers.filter( function( _provider ){
		return _provider.name == provider;
	} );

	if( _providersFound.length == 0 ){
		return cb( "Provider " + provider + " not found." );
	}

	const self	= this;
	this.inst	= _providersFound[0].required( );
	let _count	= 0;
	this.inst.on( "link", function( link ){
		_count++;

		// If we've hit the limit; Stop.
		if( _count >= howMany ){
			self.stop();
		}

		self.emit( "link", link );
	} );

	const cleanupInst = function( ){
		self.inst = undefined;
	};

	this.inst.on( "error", function( err ){ cleanupInst(); return cb( err ); } );
	this.inst.on( "done", function( ){ cleanupInst(); return cb( null ); } );
};

Grabber.prototype.stop = function( ){
	if( this.inst ){ this.inst.emit( "die" ); }
};

module.exports = Grabber;
