const { writeFileSync } = require('fs');
const { promisify } = require('util');
const { Builder, By, Key, promise, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const fs = require('fs');
promise.USE_PROMISE_MANAGER = false;

const binary = new firefox.Binary(__dirname + '/firefox/firefox');
// binary.addArguments("--headless");

const snapPath = __dirname + '/snaps/' + Date.now() + '/';
fs.mkdirSync(snapPath);

const profile = new firefox.Profile();
profile.setPreference("browser.download.dir", snapPath);
profile.setPreference("browser.download.folderList", 2);
profile.setPreference("browser.helperApps.neverAsk.saveToDisk", "image/png;"); 
profile.setPreference("browser.download.manager.showWhenStarting", false );

const options = new firefox.Options();
options.setBinary(binary);
options.setProfile(profile);

const driver = new Builder()
.forBrowser('firefox')
.setFirefoxOptions(options)
.build();

async function snap(url) {

	console.log('Loading URL:', url);

	await driver.get(url);

	await driver.wait(async () => {
		const readyState = await driver.executeScript('return document.querySelector("a-scene").hasLoaded');
		return readyState === true;
	});
	
	console.log('Load Complete:', url);

	await new Promise(resolve => setTimeout(resolve, 3000));

	const files = fs.readdirSync(snapPath);

	console.log('Trigger Screenshot, waiting for files.', url);
	
	await driver.executeScript('document.querySelector("a-scene").components.screenshot.capture("equirectangular")');
	
	let newFiles;

	await driver.wait(() => {
		newFiles = fs.readdirSync(snapPath);
		return newFiles.length > files.length;
	});

	console.log('File Made', url);
	
	await driver.get('about:blank');

	return snapPath + newFiles.find(file => files.indexOf(file) === -1);
}

module.exports = snap;