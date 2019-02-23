const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const fs = require('fs-extra');

const configDir = path.resolve(__dirname, 'config');

function printMessage(config) {
	if (!config) return;
	ora(chalk.green(`Generate ${config} successfully!`)).succeed();
}

function readConfigList() {
	const config = fs.readdirSync(configDir);
	return config;
}

function copyConfig(config) {
	const configFile = path.resolve(configDir, config);
	const dest = path.resolve(process.cwd(), config);
	fs.copyFileSync(configFile, dest);
	printMessage(config);
}

module.exports = {
	readConfigList,
	copyConfig,
	printMessage
};
