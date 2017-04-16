'use strict';
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Pizzabot time! On a 5X5 grid choose where to deliver pizza. (x, y) format \n>'
});

rl.prompt();

var xAxis = [0];
var yAxis = [0];
var directionXVals = [];
var directionYVals = [];

function filter(input) {
	var x, y;

	//get rid of the containing ()
	input = input.slice(1).slice(0, - 1);

	//get the numeric value of the x and y axis
	x = +input[0];
	y = +input.slice(-1);

	if ( x >= 6 || y >= 6) {
		console.log('Whoops your outside the graph. x and y need to be between 0 - 5');
	} else {
		//save the values to an array to be compared after all the input is entered
		xAxis.push(x);
		yAxis.push(y);
		console.log('Any other houses to visit before deliveries go out? "y"/"n" or (x, y)');	
	}
}

function compare(array, type) {
	var comparedVals = array.map(function(val, index) {
		var nextStop = index + 1;
		var nextStopVal = array[nextStop];
		if (val - nextStopVal === NaN) {
			return;
		} else {
			return val - nextStopVal;
		}
	});
	convertValues(comparedVals, type);
}

function convertValues(array, type) {
	//converts the numeric values into their directional counterparts based on x or y axis
	if (type === 'x') {
		directionXVals = array.map(function (num) {
			if (num > 0) {
				return 'W'.repeat(num);
			} else if (num < 0) {
				num *= -1; 
				return 'E'.repeat(num);
			} else if (num === 0) {
				return 'Same horizontal';
			}
		});

	} else {
		directionYVals = array.map(function (num) {
			if (num > 0) {
				return 'S'.repeat(num) + 'D';
			} else if (num < 0) {
				num *= -1; 
				return 'N'.repeat(num) + 'D';
			} else if (num === 0) {
				return 'Same vertical D';
			}
		});
	}
	
	if (directionXVals.length > 0 && directionYVals.length > 0) {
		showOutput(directionXVals, directionYVals);
	}
}

function showOutput(xArray, yArray) {
	var arrayCombined = xArray.reduce(function (arr, v, i) {
        return arr.concat(v, yArray[i]); 
	}, []);
	console.log('Pizzabot directions: ' + arrayCombined.join(''));
	console.log('If you want to start over enter "new" or to quit "ctrl + c"');
}

//handles the STNDIN
rl.on('line', (line) => {
	var correctFormat = /\(\d?, \d?\)/g;
	var correctNoSpace = /\(\d?,\d?\)/g;

	if (line.match(correctFormat) || line.match(correctNoSpace)) {
		//now filter the input for numbers only
		filter(line);
	} else if (line === 'y') {
		//adds another delivery to the arrays
		console.log('Where\'s the next delivery? (x, y)');
	} else if (line === 'n') {
		//prints the directions to the STNDOUT
		compare(xAxis, 'x');
		compare(yAxis, 'y');
	} else if (line === 'new') {
		//starts the delivery process over from (0,0)
		xAxis = [0];
		yAxis = [0];
		directionXVals.length = 0;
		directionYVals.length = 0;

		rl.prompt();
	} else if (line.length > 6) {
		//error handles for decimals, single digits
		console.log('Whole numbers between 0 - 5 and in the (x, y) format please!');
		
	} else {
		//prompt the user to start again
		console.log('Uh oh. Somthing isn\'t right. Let\'s start again with "new"');
	}
	
}).on('close', () => {
  console.log('See you next delivery day!');
  process.exit(0);
});

