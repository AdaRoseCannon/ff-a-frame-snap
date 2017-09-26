const express = require('express');
const snap = require('./snap-chrome');

const app = express();

let promiseQueue = Promise.resolve();

app.get('/', function (req, res) {

	
	const url = req.query.url;
	if (!url) return res.sendFile(__dirname + '/index.html');
	
	promiseQueue = promiseQueue
	.then(() => snap(url))
	.then(function (filepath) {
		res.sendFile(filepath);
	}).catch(e => {
		console.log(e.message, e.stack)
		res.end(e.message + '\n' + e.stack + '\n');	
	});
});

app.listen(process.env.PORT || 3000);