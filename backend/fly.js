const dgram = require('dgram');
const wait = require('waait');
const commandDelays = require('./commandDelays');

const PORT = 8889;
const HOST = '192.168.10.1';

function parseState(state) {
	return state.split(';').map(x => x.split(':'));
}

const drone = dgram.createSocket('udp4');
drone.bind(PORT);

const droneState = dgram.createSocket('udp4');
droneState.bind(8890);

drone.on('message', message => {
	console.log(`masterChief : ${message}`);
});

droneState.on('message', state => {
	console.log(state.toString());
	const formattedState = parseState(state.toString());
	console.log(formattedState);
});

function handleError(err) {
	if (err) {
		console.log('ERROR');
		console.log(err);
	}
}

// drone.send('command', 0, 7, PORT, HOST, handleError);
// drone.send('battery?', 0, 8, PORT, HOST, handleError);
// drone.send('flip', 0, 4, PORT, HOST, handleError);
// drone.send('land', 0, 4, PORT, HOST, handleError);
// drone.send('battery', 0, 7, PORT, HOST, handleError);


const commands = ['command', 'battery?'];
// const commands = ['command', 'battery?', 'takeoff', 'forward', 'back', 'land'];

let i = 0;

async function go() {
	const command = commands[i];
	const delay = commandDelays[command];
	console.log(`Masterchief is running command: ${command}`);
	drone.send(command, 0, command.length, PORT, HOST, handleError);
	await wait(delay);
	i += 1;
	if (i < commands.length) {
		return go();
	}
	console.log('Mastechief has finished the flight');
}

go();