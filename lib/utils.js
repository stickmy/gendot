const path = require('path');
const { homedir } = require('os');
const parser = require('configparser');
const ora = require('ora');
const chalk = require('chalk');
const fs = require('fs-extra');

const cp = new parser();

const gendrc = path.resolve(homedir(), '.gendrc');

const localConfigPath = path.resolve(__dirname, 'config');

function init() {
	if (!fs.existsSync(gendrc)) {
		fs.ensureFileSync(gendrc);
		writePathToGendrc(localConfigPath);
	}
}

function writePathToGendrc(c) {
	cp.addSection('config');
	cp.set('config', 'path', c);
	cp.write(gendrc);
}

function printMessage(config) {
	if (!config) return;
	ora(chalk.green(`Generate ${config} successfully!`)).succeed();
}

function readConfigList() {
	const configPath = resolveConfigPath();
	const config = fs.readdirSync(configPath);
	return config;
}

function resolveConfigPath() {
	let configPath = localConfigPath;
	if (fs.existsSync(gendrc)) {
		cp.read(gendrc);
		configPath = cp.get('config', 'path');
	}
	return configPath;
}

function copyConfig(config) {
	const configPath = resolveConfigPath();
	const configFile = path.resolve(configPath, config);
	const dest = path.resolve(process.cwd(), config);
	if (!fs.existsSync(configFile)) {
		ora(
			chalk.magenta(
				`${config} did not exist. Please run gend --list to list all dotfiles`
			)
		).fail();
		return;
	}
	fs.copyFileSync(configFile, dest);
	printMessage(config);
}

module.exports = {
	init,
	readConfigList,
	copyConfig,
	printMessage,
	writePathToGendrc
};
