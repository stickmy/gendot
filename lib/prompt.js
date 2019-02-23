const inquirer = require('inquirer');
const { readConfigList } = require('./utils');

const configList = readConfigList();

const config = {
	type: 'list',
	name: 'config',
	message: 'Choose config >',
	choices: configList.map(c => ({ name: c, value: c }))
};

function startPrompt() {
	return inquirer.prompt([config]).then(answers => answers.config);
}

module.exports = startPrompt;