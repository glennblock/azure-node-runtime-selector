var fs=require('fs');
var path=require('path');
var npmVersion='latest';
var nodeVersion='latest';
var nodeVersionSetting=null;
var npmVersionSetting=null;
var util = require('util');

var packageJson;
var packageJsonPath = process.env.DEPLOYMENT_TARGET + '\\package.json';
if (path.existsSync(packageJsonPath)) {
	packageJson = require(packageJsonPath);
}
else {
	packageJson = {};
}

writeVersions();

function writeVersions() {
	if (process.env.NODE_VERSION != undefined && process.env.NODE_VERSION != null) {
		nodeVersionSetting = process.env.NODE_VERSION;
		nodeVersion=nodeVersionSetting;
	}

	if (process.env.NPM_VERSION != undefined && process.env.NPM_VERSION != null) {
		npmVersionSetting = process.env.NPM_VERSION;
		npmVersion = npmVersionSetting;
	}

	if (packageJson.engines != undefined) {
		var nodeTemp = packageJson.engines.node;
		if (nodeVersionSetting==null && nodeTemp != undefined && nodeTemp != null)
			nodeVersion = nodeTemp;

		var npmTemp = packageJson.engines.npm;
		if (npmVersionSetting==null && npmTemp != undefined && npmTemp != null)
			npmVersion = npmTemp;
	}

	var tempBase = process.env.DEPLOYMENT_TARGET + "/../../node/nodist/bin/";
	fs.writeFileSync(tempBase + 'nodeVersion.tmp', nodeVersion);
	fs.writeFileSync(tempBase + 'npmVersion.tmp', npmVersion);
}

/*
function readYAML() {
	var buffer = fs.readFileSync(iisnodeYml);
	var file = buffer.toString();
	//console.log(file);
	file = file.replace('\r\n', '\n');
	return file.split('\n');
}

function updateYAML(lines) {
	var found = false;
 	var nodeProcessCommandLine='nodeProcessCommandLine: \"' + process.env.APPDATA + '\\node\\nodist\\bin\\node.exe\"';
	lines.every(function(line, index) {
		if (line.substring(0, 8) == 'nodeProc') {
			lines[index]=nodeProcessCommandLine;
			found=true;
			return false;
		}
		return true;
	});
	if (!found) {
		lines.push(nodeProcessCommandLine);
	}
	console.log(lines.join('\n'));
	fs.writeFileSync(iisnodeYml, lines.join('\n'));	
}
*/
