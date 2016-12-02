'use strict';

var Lokka = require('lokka').Lokka;
var Transport = require('lokka-transport-http').Transport;

var client = new Lokka({
  transport: new Transport('http://localhost:4444/graphql')
});

//# sourceMappingURL=index.js.map