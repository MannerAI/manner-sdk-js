'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var graphQLURL = 'http://localhost:4444/graphql';
var token = void 0;

var config = exports.config = {
	get graphQLURL() {
		return graphQLURL;
	},
	set graphQLURL(u) {
		graphQLURL = u;
	},
	get token() {
		return token;
	},
	set token(t) {
		token = t;
	}
};