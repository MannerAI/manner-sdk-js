/**
 * Pizza delivery example (based on inquirer.js standard example)
 */

const inquirer = require( 'inquirer' );
const Manner = require( '../out/manner.js' );
const Rx = require( 'rx' );
const Promise = require( 'bluebird' );

const questions = require( './questions.js' );

Manner.setToken( 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDNlN2E0OTUtZWE3Mi00MjRlLThiM2UtYzdlYjgzMTQ0MTM0In0.lEMyiGzmjRNqX_0tm9gkpzpdHVPFsW3XN5gLeOipUO0' );
Manner.setAgentID( 'PizzaBot' );

const prompts = new Rx.Subject();
const regularFlow = {
	// start point
	0: 'toBeDelivered',
	// after toBeDelivered, we now run a Manner test instead of specifying order
	// toBeDelivered: 'size',
	toBeDelivered: 'size',
	pizzaOrder: 'beverage',
	beverage: 'comments',
	comments: 'prize',
	// unused flow thanks to Manner:
	size: 'quantity',
	quantity: 'toppings',
	toppings: 'beverage',
};

/*
 * Function Definitions
 ************************/

// determine the next action to take according to regular conversation flow
function getAction( lastAnswer ) {
	switch ( lastAnswer.name ) {
		case 'comments':
			// end the conversation if no comment is left
			if ( lastAnswer.answer !== 'Nope, all good!' ) {
				return regularFlow[ lastAnswer.name ];
			}
			return null;
		case 'prize':
			return null;
		default:
			return regularFlow[ lastAnswer.name ];
	}
}

// modify the regular flow according to Manner's suggestions
function mannerModify( nextAction, conversation ) {
	// if we are in the middle of a multipart section, we relinquish the usual controlflow
	if ( conversation.isMidFlow ) {

		// let Manner choose the next action
		return conversation.nextAction()
			.then( ( { action, done, testName } ) => (
				// when the multipart section is over, resume normal flow
				done ? regularFlow[ testName ] : action
			) )
	}

	// start Manner tests where appropriate
	switch ( nextAction ) {
		// get an action from Manner instead of usual flow for pizzaOrder
		case 'pizzaOrder':
			return conversation.getAction( nextAction );
		default:
			return Promise.resolve( nextAction );
	}
}

function getQuestion( action, conversation ) {
	if ( action === null ) return null;

	// always use Manner's suggestions
	// (it will fall back to the default if necessary)
	const fallback = {
		message: questions[ action ].message,
		quickReplies: questions[ action ].choices
	}
	return conversation.getResponse( action, fallback, [] )
		// convert Manner responses into inquirer questions
		.then( ( { message, quickReplies } ) => {
			let qr = quickReplies || [];
			switch ( qr.length ) {
				case 0:
					return {
						type: 'input',
						name: action,
						message
					}
				case 1:
					return {
						type: 'input',
						name: action,
						default: quickReplies[ 0 ],
						message
					}
				default:
					return {
						type: 'list',
						name: action,
						choices: quickReplies,
						message
					}
			}
		} );
}

function main() {

	// construct prompt
	const p = inquirer.prompt( prompts );

	// setup Manner objects
	const conversation = new Manner.Conversation( { chatUsers: [ 'sample-user' ] } )
	const orderGoal = new Manner.Goal( 'pizza-order' );

	// attach appropriate listeners to handle event after each message
	p.ui.process.subscribe(
		( lastAnswer ) => {
			// Let Manner know what the user is saying
			// TODO: morph lastAnswer into a a Manner "Event"
			conversation.log( lastAnswer );

			// NB could also attach context to a user (if we had users)
			conversation.submitContext( {
				name: lastAnswer.name,
				value: lastAnswer.answer
			} );

			let action = getAction( lastAnswer );
			mannerModify( action, conversation )
				.then( action => getQuestion( action, conversation ) )
				.then( question => {
					if ( question === null ) {
						prompts.onCompleted();
					} else {
						prompts.onNext( question );
					}
				} );
		},
		// error handler
		() => {
			console.log( 'Error' );
			orderGoal.reject();
		}
	);

	// attach a handler for when the conversation is over
	p.then( ( allAnswers ) => {

		orderGoal.resolve();
		console.log( allAnswers );
	} );

	// finally start the conversation
	console.log( 'Hi, welcome to Node Pizza' );
	mannerModify( getAction( { name: 0 } ), conversation )
		.then( action => getQuestion( action, conversation ) )
		.then( question => prompts.onNext( question ) );
}


// kick things off
main();
