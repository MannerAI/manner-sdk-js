const Lokka = require( 'lokka' )
	.Lokka;
const Transport = require( 'lokka-transport-http' )
	.Transport;
const chalk = require( 'chalk' );
const Promise = require( 'bluebird' );

const seqNum = Symbol( 'Sequence Number' );
const midFlow = Symbol( 'Is partway through sequence?' );
const sequenceName = Symbol( 'Sequence Name' );
const agentId = Symbol( 'Manner Agent ID' );
const chatUsers = Symbol( 'Conversation users' );
const conversationId = Symbol( 'Manner Conversation ID' );
const client = Symbol( 'Lokka Client' )

let config = {};

//  TODO: delete this - the server should do its own entity injection
function entityReplace( string, entities ) {
	let result = string;
	Object.keys( entities )
		.forEach( ( entityName ) => {
			result = result.replace( `@{${entityName}}`, entities[ entityName ] );
		} );
	return result;
}

export class Conversation {

	constructor( { chatUsers: _chatUsers, chatUser: _chatUser = null } ) {

		if ( config.agentId === undefined ) throw new Error( 'agentId must be provided' );
		if ( config.token === undefined ) throw new Error( 'setToken must be called before constructing a Conversation.' );
		if ( config.graphQLURL === undefined ) throw new Error( 'setToken must be called before constructing a Conversation.' );

		this.client = new Lokka( {
			transport: new Transport( config.graphQLURL, { headers: { token: config.token } } )
		} );

		// TODO (maybe): make 'User' objecs instead of just retaining strings
		if ( _chatUsers === null && _chatUser !== null ) {
			this[ chatUsers ] = [ _chatUser ];
		} else {
			this[ chatUsers ] = _chatUsers;
		}

		// TODO: post conversation to Manner and get ID

		// private properties
		this[ midFlow ] = false;
		this[ sequenceName ] = null;
		this[ agentId ] = config.agentId;
		this[ chatUsers ] = _chatUsers;
		this[ conversationId ] = '...';
	}

	static config( obj ) {
		config = Object.assign( config, obj );
	}

	get isMidFlow() {
		return this[ midFlow ];
	}

	getAction( name ) {
		console.log( chalk.bgWhite.black( 'Started a test' ) );

		// TODO: un-dummy this
		// Currently assuming just one, multi-part test has been created
		const result = {
			maxSeq: 2,
			seq: 0,
			action: 'toppings'
		};

		if ( result.seq < result.maxSeq ) {
			this[ midFlow ] = true;
			this[ sequenceName ] = name;
			this[ seqNum ] = 0;
		}

		return Promise.resolve( result.action );
	}

	nextAction() {
		console.log( chalk.bgWhite.black( 'Fetched an action in a sequence' ) );

		// TODO: un-dummy this, using multipartName to get the next action
		// Currently assuming just one, multi-part test has been created
		this[ seqNum ] += 1;
		const result = {
			maxSeq: 2,
			seq: this[ seqNum ],
			action: [ 'toppings', 'size', 'quantity' ][ this[ seqNum ] ]
		};

		if ( result.seq <= result.maxSeq ) {
			return new Promise( resolve => resolve( {
				action: result.action,
				finished: false,
				testName: this[ sequenceName ]
			} ) );
		}

		const retVal = Promise.resolve( {
			action: null,
			finished: true,
			testName: this[ sequenceName ]
		} );

		this[ sequenceName ] = null;
		this[ seqNum ] = 0;
		this[ midFlow ] = false;

		return retVal;
	}

	getResponse( name, defaultResponse, entities ) {
		console.log( chalk.bgWhite.black( 'Fetched a response!' ) );

		let response;
		if ( this[ conversationId ] !== '...' ) {
			// TODO: fetch things from Manner
		} else {
			response = `${defaultResponse} :) `;
		}

		// TODO: I think Manner will do its own entity injection
		return Promise.resolve( entityReplace( response, entities ) );
	}

	log() {
		console.log( chalk.bgWhite.black( `Event tracked to ${this[ conversationId ]}!` ) );
	}

	submitContext() {
		console.log( chalk.bgWhite.black( `Received context information for ${this[ conversationId ]}!` ) );
	}

}
