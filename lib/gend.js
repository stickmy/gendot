const commander = require('commander');
const chalk = require('chalk');
const startPrompt = require('./prompt');
const { copyConfig, readConfigList, init } = require('./utils');
const packageJson = require('../package.json');

init();

let configName;

const program = new commander.Command(packageJson.name)
	.version(packageJson.version)
	.arguments('<config>')
	.usage(`${chalk.green('<config>')}`)
	.action(name => {
		configName = name;
	})
	.option('--list')
	.allowUnknownOption();

program.parse(process.argv);

if (program.list) {
	const configList = readConfigList();
	configList.forEach(c => {
		console.log(chalk.blue(c));
	});
	return;
}

if (typeof configName !== 'undefined') {
	copyConfig(configName);
	return;
}

startPrompt().then(config => {
	copyConfig(config);
});
