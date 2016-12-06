'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Lokka = require('lokka').Lokka;
var Transport = require('lokka-transport-http').Transport;
var chalk = require('chalk');
var Promise = require('bluebird');

var seqNum = Symbol('Sequence Number');
var midFlow = Symbol('Is partway through sequence?');
var sequenceName = Symbol('Sequence Name');
var agentId = Symbol('Manner Agent ID');
var chatUsers = Symbol('Conversation users');
var conversationId = Symbol('Manner Conversation ID');
var client = Symbol('Lokka Client');

var _config = {};

//  TODO: delete this - the server should do its own entity injection
function entityReplace(string, entities) {
	var result = string;
	Object.keys(entities).forEach(function (entityName) {
		result = result.replace('@{' + entityName + '}', entities[entityName]);
	});
	return result;
}

var Conversation = exports.Conversation = function () {
	function Conversation(_ref) {
		var _chatUsers = _ref.chatUsers,
		    _ref$chatUser = _ref.chatUser,
		    _chatUser = _ref$chatUser === undefined ? null : _ref$chatUser;

		_classCallCheck(this, Conversation);

		if (_config.agentId === undefined) throw new Error('agentId must be provided');
		if (_config.token === undefined) throw new Error('setToken must be called before constructing a Conversation.');
		if (_config.graphQLURL === undefined) throw new Error('setToken must be called before constructing a Conversation.');

		this.client = new Lokka({
			transport: new Transport(_config.graphQLURL, { headers: { token: _config.token } })
		});

		// TODO (maybe): make 'User' objecs instead of just retaining strings
		if (_chatUsers === null && _chatUser !== null) {
			this[chatUsers] = [_chatUser];
		} else {
			this[chatUsers] = _chatUsers;
		}

		// TODO: post conversation to Manner and get ID

		// private properties
		this[midFlow] = false;
		this[sequenceName] = null;
		this[agentId] = _config.agentId;
		this[chatUsers] = _chatUsers;
		this[conversationId] = '...';
	}

	_createClass(Conversation, [{
		key: 'getAction',
		value: function getAction(name) {
			console.log(chalk.bgWhite.black('Started a test'));

			// TODO: un-dummy this
			// Currently assuming just one, multi-part test has been created
			var result = {
				maxSeq: 2,
				seq: 0,
				action: 'toppings'
			};

			if (result.seq < result.maxSeq) {
				this[midFlow] = true;
				this[sequenceName] = name;
				this[seqNum] = 0;
			}

			return Promise.resolve(result.action);
		}
	}, {
		key: 'nextAction',
		value: function nextAction() {
			var _this = this;

			console.log(chalk.bgWhite.black('Fetched an action in a sequence'));

			// TODO: un-dummy this, using multipartName to get the next action
			// Currently assuming just one, multi-part test has been created
			this[seqNum] += 1;
			var result = {
				maxSeq: 2,
				seq: this[seqNum],
				action: ['toppings', 'size', 'quantity'][this[seqNum]]
			};

			if (result.seq <= result.maxSeq) {
				return new Promise(function (resolve) {
					return resolve({
						action: result.action,
						finished: false,
						testName: _this[sequenceName]
					});
				});
			}

			var retVal = Promise.resolve({
				action: null,
				finished: true,
				testName: this[sequenceName]
			});

			this[sequenceName] = null;
			this[seqNum] = 0;
			this[midFlow] = false;

			return retVal;
		}
	}, {
		key: 'getResponse',
		value: function getResponse(name, defaultResponse, entities) {
			console.log(chalk.bgWhite.black('Fetched a response!'));

			var response = void 0;
			if (this[conversationId] !== '...') {
				// TODO: fetch things from Manner
			} else {
				response = defaultResponse + ' :) ';
			}

			// TODO: I think Manner will do its own entity injection
			return Promise.resolve(entityReplace(response, entities));
		}
	}, {
		key: 'log',
		value: function log() {
			console.log(chalk.bgWhite.black('Event tracked to ' + this[conversationId] + '!'));
		}
	}, {
		key: 'submitContext',
		value: function submitContext() {
			console.log(chalk.bgWhite.black('Received context information for ' + this[conversationId] + '!'));
		}
	}, {
		key: 'isMidFlow',
		get: function get() {
			return this[midFlow];
		}
	}], [{
		key: 'config',
		value: function config(obj) {
			_config = Object.assign(_config, obj);
		}
	}]);

	return Conversation;
}();