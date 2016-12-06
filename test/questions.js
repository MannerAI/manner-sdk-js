module.exports = {
	toBeDelivered: {
		type: 'input',
		name: 'toBeDelivered',
		message: 'Is this for delivery?',
	},

	phone: {
		type: 'input',
		name: 'phone',
		message: 'What\'s your phone number?',
		validate( value ) {
			const pass = value.match( /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i );
			if ( pass ) {
				return true;
			}

			return 'Please enter a valid phone number';
		}
	},

	size: {
		type: 'list',
		name: 'size',
		message: 'What size do you need?',
		choices: [ 'Large', 'Medium', 'Small' ],
	},

	quantity: {
		type: 'input',
		name: 'quantity',
		message: 'How many do you need?',
	},

	toppings: {
		type: 'list',
		name: 'toppings',
		message: 'What about the toppings?',
		choices: [ {
			name: 'Pepperoni and cheese',
			value: 'PepperoniCheese'
		}, {
			name: 'All dressed',
			value: 'alldressed'
		}, {
			name: 'Hawaiian',
			value: 'hawaiian'
		} ]
	},

	beverage: {
		type: 'list',
		name: 'beverage',
		message: 'You also get a free 2L beverage',
		choices: [ 'Pepsi', '7up', 'Coke' ]
	},

	comments: {
		type: 'input',
		name: 'comments',
		message: 'Any comments on your purchase experience?',
		default: 'Nope, all good!'
	},

	prize: {
		type: 'list',
		name: 'prize',
		message: 'For leaving a comment, you get a freebie',
		choices: [ 'cake', 'fries' ]
	}
};
