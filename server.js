/*
--=== Module dependencies ===--
We need to require express, stylus and nib additionally.
*/
var express = require('express'),
stylus = require('stylus'),
nib = require('nib'),
morgan = require('morgan'),
fs = require('fs'),
prompt = require('prompt'),
ns = require('ns-api');
/* Main app dependancy is on express */
var app = express()

/* Setup date query */
var date = new Date();
var datemonth = date.getMonth();
var datehour = date.getHours();
var datemin = date.getMinutes();
var datesec = date.getSeconds();

/* Cool. Lets add some functionality as well ! */

function compile(str, path) {
	return stylus(str)
	.set('filename', path)
	.use(nib())
}
/* We call middleware function for express */
/* First one is dev. This simply log incoming requests to the console */
app.use(morgan('dev'));
app.use(stylus.middleware(
{ src: __dirname + '/'
, compile: compile
}
))
app.use(express.static(__dirname + '/'))

/* Create a simple route for I/O */
app.get('/', function (req, res) {
	res.render('index',
{ title : 'Ontrein' }
)
})
console.log('Application is hosted on port 3000');
app.listen(3000)

// PROMPT
var schema = {
	properties: {
		StartStation: {
			pattern: /^[a-zA-Z\s\-]+$/,
			message: 'Name must be only letters, spaces, or dashes',
			required: true
		},
		EndStation: {
			pattern: /^[a-zA-Z\s\-]+$/,
			message: 'Name must be only letters, spaces, or dashes',
			required: true
		}
	}
};

//
// Start the prompt
//
prompt.start();

//
// Get two properties from the user: email, password
//
prompt.get(schema, function (err, result) {
	//
	// Log the results.
	//
	console.log('Command-line input received:');
	console.log('Initial Station: ' + result.StartStation);
	console.log('Final Station: ' + result.EndStation);




// Setup NS credentials
ns.username = 'lauranijenhuis@live.nl'
ns.password = '1kWR5lDImCQrlxtHdeOmB_IzY8APxYXX-nH-Y2ycwO6qtqKoXd1oEA'

// event handler
function handler (request, response) {
	request.on('end', function() {
		files.serve(request, response);
	}).resume();
}

console.log(date);
ns.stations(
	function( err, data ) {
		var index = [];

		// build the index
		for (var x in data) {
			index.push(x);
		}

		// sort the index
		index.sort(function (a, b) {
			return a == b ? 0 : (a > b ? 1 : -1);
		});

		var stationName = [];
		var stationLat = [];
		var stationLon = [];

		for (var i=0; i<index.length; i++){
				stationName[i] = data[index[i]]['Namen']['Lang'];
				stationLat[i] = data[index[i]]['Lat'];
				stationLon[i] = data[index[i]]['Lon'];
		}
		//console.log(stationName);
		//console.log(stationLat);
		//console.log(stationLon);
		// BUILDING JSON FILE

		var NSdata = {
			stationName: stationName,
			stationLat: stationLat,
			stationLon: stationLon
		}

		var outputFilename = './tmp/NSdata.json';

		fs.writeFile(outputFilename, JSON.stringify(NSdata, null, 4), function(err) {
			if(err) {
				console.log(err);
			} else {
				console.log("JSON saved to " + outputFilename);
			}
		});

	}
)

ns.reisadvies(
{
	fromStation: 'Eindhoven',
	toStation:   'Utrecht',
	dateTime:    date,
	departure:   true,
	nextAdvices: 1,
	previousAdvices: 0
},
function( err, data ) {
	//console.log( err || data )
	var timeArray = [];
	var trainDepartureTimes = [];
	for (var i = 0; i < data.length; i++){
		timeArray[i] = data[i]['ActueleVertrekTijd'];
		trainDepartureTimes[i] = timeArray[i].slice(11,16);
	}
	console.log(trainDepartureTimes);

	var Timedata = {
		trainDepartureTimes: trainDepartureTimes
	}

	var outputFilename = './tmp/Timedata.json';

	fs.writeFile(outputFilename, JSON.stringify(Timedata, null, 4), function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("JSON saved to " + outputFilename);
		}
	});
}
)
});
