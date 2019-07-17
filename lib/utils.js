const path = require('path');
const { homedir } = require('os');
const parser = require('configparser');
const ora = require('ora');
const chalk = require('chalk');
const fs = require('fs-extra');
const inquirer = require('inquirer');

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

function printOperateMessage(config, operateType = 'Operate') {
	if (!config) return;
	ora(chalk.green(`${operateType} ${config} successfully!`)).succeed();
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
		ora(chalk.magenta(`${config} did not exist. Please run gend --list to list all dotfiles`)).fail();
		return;
	}
	fs.copyFileSync(configFile, dest);
	printMessage(config);
}

function copyToConfigList(configName, configPath) {
	const configBase = resolveConfigPath();
	const dest = path.resolve(configBase, configName);
	if (!fs.existsSync(configPath)) {
		ora(chalk.magenta(`${configPath} did not exist. Please run gend --list to list all dotfiles`)).fail();
		return;
	}
	fs.copyFileSync(configPath, dest);
	printOperateMessage(configName, 'AddNew');
}

function removeByName(configName) {
	const configPath = path.resolve(resolveConfigPath(), configName);
	if (!fs.existsSync(configPath)) {
		ora(chalk.magenta(`${configPath} did not exist. Please run gend --list to list all dotfiles`)).fail();
		return;
	}
	fs.removeSync(configPath);
	printOperateMessage(configName, 'Remove');
}

function renameConfig(oldName, newName) {
	const configBase = resolveConfigPath();
	const target = path.resolve(configBase, oldName);
	if (!fs.existsSync(target)) {
		ora(chalk.magenta(`${target} did not exist. Please run gend --list to list all dotfiles`)).fail();
		return;
	}
	const dest = path.resolve(configBase, newName);
	if (fs.existsSync(dest)) {
		inquirer
			.prompt([
				{
					type: 'confirm',
					name: 'overrite',
					message: `${newName} has already exist, Are you sure to overrite?`
				}
			])
			.then(({ overrite }) => {
				if (overrite) {
					fs.removeSync(dest);
					fs.moveSync(target, dest);
					printOperateMessage(oldName, 'Rename');
				} else {
					ora(
						chalk.magenta(`${oldName} rename failed. Because ${newName} has exist and you didn't choosen overrite`)
					).fail();
				}
			});
		return;
	}
	fs.moveSync(target, dest);
	printOperateMessage(oldName, 'Rename');
}

module.exports = {
	init,
	readConfigList,
	copyConfig,
	copyToConfigList,
	removeByName,
	renameConfig,
	printMessage,
	writePathToGendrc
};
