const { writeFileSync } = require('fs');
const { promisify } = require('util');
const { Builder, By, Key, promise, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
promise.USE_PROMISE_MANAGER = false;

const snapPath = __dirname + '/snaps/' + Date.now() + '/';
fs.mkdirSync(snapPath);

const options = new chrome.Options();
options.setChromeBinaryPath();
options.addArguments("no-first-run", "use-gl=osmesa");
options.setUserPreferences({
	"profile.default_content_settings.popups": 0,
	"download.default_directory": snapPath
});

const driver = new Builder()
.forBrowser('chrome')
.setChromeOptions(options)
.build();

async function snap(url) {

	console.log('Loading URL:', url);

	await driver.get(url);

	console.log('Page loaded');

	if (await driver.executeScript('return !document.querySelector("a-scene")')) throw Error('<a-scene> not found.');

	await driver.wait(driver.executeScript('return !!(document.querySelector("a-scene") || {}).hasLoaded'), 5000, 'Scene took too long to load.');

	console.log('a-frame loaded, running for 7s');

	await new Promise(resolve => setTimeout(resolve, 7000));

	const files = fs.readdirSync(snapPath);

	console.log('Trigger Screenshot', url);

	await driver.executeScript('requestAnimationFrame(() => requestAnimationFrame(() => document.querySelector("a-scene").components.screenshot.capture("equirectangular")))');
	
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