const { promisify } = require('util');
const { Builder, By, Key, promise, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

module.exports = function (snapPath) {
	promise.USE_PROMISE_MANAGER = false;

	const binary = new firefox.Binary(__dirname + '/firefox/firefox');
	// binary.addArguments("--headless");

	const profile = new firefox.Profile();
	profile.setPreference("browser.download.dir", snapPath);
	profile.setPreference("browser.download.folderList", 2);
	profile.setPreference("browser.helperApps.neverAsk.saveToDisk", "image/png;"); 
	profile.setPreference("browser.download.manager.showWhenStarting", false );
	profile.setPreference("webgl.osmesalib", "/usr/lib/x86_64-linux-gnu/libOSMesa.so.6");
	profile.setPreference("webgl.force-enabled", true);

	const options = new firefox.Options();
	options.setBinary(binary);
	options.setProfile(profile);

	const driver = new Builder()
	.forBrowser('firefox')
	.setFirefoxOptions(options)
	.build();
}