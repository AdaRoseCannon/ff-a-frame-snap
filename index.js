const { writeFileSync } = require('fs');
const { promisify } = require('util');
const { Builder, By, Key, promise, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
promise.USE_PROMISE_MANAGER = false;

const binary = new firefox.Binary('/home/SERILOCAL/ada.edwards/bin/firefox/firefox');
// binary.addArguments("--headless");

const profile = new firefox.Profile();
profile.setPreference("browser.download.dir", __dirname);
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
	await driver.get(url);

	await driver.wait(async () => {
		const readyState = await driver.executeScript('return document.querySelector("a-scene").hasLoaded');
		return readyState === true;
	});

	await driver.executeScript('document.querySelector("a-scene").components.screenshot.capture("equirectangular")');

	await new Promise(resolve => setTimeout(resolve, 2000));

	await driver.quit();
}

snap('https://earthy-course.glitch.me/');
  