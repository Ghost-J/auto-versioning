#!/usr/bin/env node
const fs = require('fs');
const packageJSON = require('./../package.json');
const inquirer = require('inquirer');

const push = (process.argv.indexOf('--push') > -1);

if (push) {

	let versionType, updatePackage = false;

	const questions = [
		{
			type: 'confirm',
			name: 'updatePackage',
			message: 'Do you want to update the package version?',
		},
		{
			type: 'list',
			name: 'versionType',
			message: 'What is the version type?',
			choices: ['patch', 'minor', 'major'],
			when: answers => {
				return answers.updatePackage === true;
			},
		}
	];

	inquirer.prompt(questions).then(
		answers => {
			if (answers['updatePackage']) {
				updatePackageVersion(answers['versionType']);
			}

			console.log('The package.json has been updated to version: ' + packageJSON.version);
		}
	);

}

const major = (process.argv.indexOf('--major') > -1);
const minor = (process.argv.indexOf('--minor') > -1);
const patch = (process.argv.indexOf('--patch') > -1);

/**
 * Update the package version in the package.json
 *
 * @param {string} versionType
 *
 * @returns {void}
 */
function updatePackageVersion(versionType)
{
	let currentVersion = packageJSON.version;

	const versionBatches = currentVersion.split('.');

	if (versionBatches.length === 3) {
		switch (versionType) {
			case 'patch':
				versionBatches[2] = parseInt(versionBatches[2], 10) + 1;
				break;

			case 'minor':
				versionBatches[1] = parseInt(versionBatches[1], 10) + 1;
				break;

			case 'major':
				versionBatches[0] = parseInt(versionBatches[0], 10) + 1;
				break;
			default:
			// Do nothing
		}
	}

	packageJSON.version = versionBatches.join('.');

	fs.writeFile('./package.json', JSON.stringify(packageJSON, null, 2), err => {
		if (err) {
			console.log('Error writing file', err)
		}
	});
}