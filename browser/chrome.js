
const { Builder, By, Key, promise, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

module.exports = function (snapPath) {
	promise.USE_PROMISE_MANAGER = false;
	
	const options = new chrome.Options();
	options.setChromeBinaryPath();
	options.addArguments("no-first-run", "use-gl=osmesa", "enable-webgl", "ignore-gpu-blacklist");
	options.setUserPreferences({
		"profile.default_content_settings.popups": 0,
		"download.default_directory": snapPath
	});
	
	const driver = new Builder()
	.forBrowser('chrome')
	.setChromeOptions(options)
	.build();
	return driver;
}