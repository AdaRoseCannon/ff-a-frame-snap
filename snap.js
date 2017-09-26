const fs = require('fs');

const snapPath = __dirname + '/snaps/' + Date.now() + '/';
fs.mkdirSync(snapPath);

const driver = require('./browser/chrome')(snapPath);

async function snap(url) {

	console.log('Loading URL:', url);

	await driver.get(url);

	if (await driver.executeScript('return !document.querySelector("a-scene")')) throw Error('<a-scene> not found.');
	
	await driver.wait(() => driver.executeScript('return !!(document.querySelector("a-scene") || {}).hasLoaded'), 5000, 'Scene took too long to load.');
	
	console.log('Page loaded, Waiting for first render.')

	await driver.wait(() => driver.executeScript('return !!(document.querySelector("a-scene") || {}).renderStarted'), 150000, 'Scene took too long to render.');

	const files = fs.readdirSync(snapPath);

	console.log('Trigger Screenshot', url);

	await driver.executeScript('document.querySelector("a-scene").components.screenshot.capture("equirectangular")');
	
	console.log('Waiting for files', url);
	
	let newFiles;

	await driver.wait(() => {
		newFiles = fs.readdirSync(snapPath);
		if (newFiles.length === files.length) {
			return new Promise(resolve => setTimeout(resolve(false), 500));
		}
		return true;
	}, 60000, 'Screenshot should have been taken by now.');

	console.log('Download started');

	// Wait for the download to finish
	let newFileName;
	await driver.wait(() => {
		newFiles = fs.readdirSync(snapPath);
		newFileName = snapPath + newFiles.find(file => files.indexOf(file) === -1);

		// still not done so wait.
		if (newFileName.slice(-10) === 'crdownload') {
			return new Promise(resolve => setTimeout(resolve(false), 500));
		}

		// done
		return true;
	});

	console.log('File Made', url);

	await driver.get('about:blank');

	return newFileName;
}

module.exports = snap;