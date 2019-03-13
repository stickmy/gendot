const commander = require('commander');
const chalk = require('chalk');
const startPrompt = require('./prompt');
const { copyToConfigList, copyConfig, removeByName, renameConfig, readConfigList, init } = require('./utils');
const packageJson = require('../package.json');
const path = require('path');

init();

const program = new commander.Command('gend').version(packageJson.version);

program
	.command('create')
	.arguments('[config]')
	.description('generate config by choosen template')
	.action(onGenerate);

program
	.command('list')
	.alias('ls')
	.description('show exists config template list')
	.action(onList);

program
	.command('add')
	.arguments('<name> [config]')
	.description('add a new config file into config list')
	.action(onAdd);

program
	.command('remove')
	.alias('rm')
	.arguments('<name>')
	.description('remove config template')
	.action(onRemove);

program
	.command('rename')
	.arguments('<old> <new>')
	.description('rename from old to new')
	.action(onRename);

program.parse(process.argv);

if (!program.args.length) {
	program.help();
}

function onGenerate(config) {
	if (config) {
		copyConfig(config);
		return;
	}
	startPrompt().then(config => {
		copyConfig(config);
	});
}

function onList() {
	const configList = readConfigList();
	configList.forEach(c => {
		console.log(chalk.blue(c));
	});
}

function onAdd(configName, filePath) {
	const cwd = process.cwd();
	if (!filePath) {
		filePath = configName;
		configName = path.basename(path.resolve(cwd, filePath));
	}
	filePath = path.resolve(cwd, filePath);
	copyToConfigList(configName, filePath);
}

function onRemove(configName) {
	removeByName(configName);
}

function onRename(oldName, newName) {
	renameConfig(oldName, newName);
}
