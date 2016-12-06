import { Conversation } from './Conversation';

export * from './Conversation';

export class Goal {

	constructor( name ) {
		this.name = name;
	}

	resolve() {

	}

	reject() {

	}
}

function setConfigForAll( obj ) {
	Conversation.config( obj );
}

export const setToken = token => setConfigForAll( { token } );
export const setAgentID = agentId => setConfigForAll( { agentId } );
setConfigForAll( { graphQLURL: 'http://localhost:4444/graphql' } );

class Action {

}

class Response {

}

export class Event {

}

export class Message extends Event {}
