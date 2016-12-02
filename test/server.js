const inquirer = require('inquirer');
const Rx = require('rx');

console.log('Hi, welcome to Node Pizza');

const questions = require('./questions.js');

const prompts = new Rx.Subject();

const actions = ['toBeDelivered', 'size'];
let actionNum = 0;

function getNextAction() {
	if (actionNum >= actions.length) return null;
	console.log(' -- Receive an action suggestion from Manner');
	// TODO
	const initialAction = actions[actionNum];
	actionNum += 1;

	console.log(' -- Receive a response suggestion from Manner');
	// TODO: Actually get a response suggestion from Manner
	const initialResponse = questions[initialAction].message;
	return Object.assign({}, questions[initialAction], {
		message: initialResponse
	});
}

inquirer
	.prompt(prompts)
	.ui.process.subscribe(
		(answers) => {
			console.log(answers);
			console.log(' -- Submit an event to Manner');

			const a = getNextAction();
			if (a !== null) {
				prompts.onNext(a);
			} else {
				prompts.onCompleted();
			}
		},

		() => console.log(' -- Submit an error to Manner'),

		() => {
			console.log(' -- Submit a goal achieved to Manner');
		}
	);

// conversation starts here
console.log(' -- Submit a goal target to Manner');
// TODO

prompts.onNext(getNextAction());
