'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Message = exports.Event = exports.setAgentID = exports.setToken = exports.Goal = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Conversation = require('./Conversation');

Object.keys(_Conversation).forEach(function (key) {
	if (key === "default" || key === "__esModule") return;
	Object.defineProperty(exports, key, {
		enumerable: true,
		get: function get() {
			return _Conversation[key];
		}
	});
});

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Goal = exports.Goal = function () {
	function Goal(name) {
		_classCallCheck(this, Goal);

		this.name = name;
	}

	_createClass(Goal, [{
		key: 'resolve',
		value: function resolve() {}
	}, {
		key: 'reject',
		value: function reject() {}
	}]);

	return Goal;
}();

function setConfigForAll(obj) {
	_Conversation.Conversation.config(obj);
}

var setToken = exports.setToken = function setToken(token) {
	return setConfigForAll({ token: token });
};
var setAgentID = exports.setAgentID = function setAgentID(agentId) {
	return setConfigForAll({ agentId: agentId });
};
setConfigForAll({ graphQLURL: 'http://localhost:4444/graphql' });

var Action = function Action() {
	_classCallCheck(this, Action);
};

var Response = function Response() {
	_classCallCheck(this, Response);
};

var Event = exports.Event = function Event() {
	_classCallCheck(this, Event);
};

var Message = exports.Message = function (_Event) {
	_inherits(Message, _Event);

	function Message() {
		_classCallCheck(this, Message);

		return _possibleConstructorReturn(this, (Message.__proto__ || Object.getPrototypeOf(Message)).apply(this, arguments));
	}

	return Message;
}(Event);