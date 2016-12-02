const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const client = new Lokka({
	transport: new Transport('http://localhost:4444/graphql')
});
