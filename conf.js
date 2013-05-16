var fs=require('fs');
var path=require('path');
var npmVersion='latest';
var nodeVersion='latest';
var nodeVersionSetting=null;
var npmVersionSetting=null;
var util = require('util');
var path=require('path');
var fs = require('fs');
var sitePath = process.env.DEPLOYMENT_TARGET

var packageJson;
var packageJsonPath = process.env.DEPLOYMENT_TARGET + '\\package.json';
if (path.existsSync(packageJsonPath)) {
	packageJson = require(packageJsonPath);
}
else {
	packageJson = {};
}

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

var template="<?xml version=\"1.0\" encoding=\"utf-8\"?> \r\n \
<configuration>\r\n \
  <system.webServer> \r\n \
    <webSocket enabled=\"false\" /> \r\n \
    <handlers> \r\n \
      <add name=\"iisnode\" path=\"{NodeStartFile}\" verb=\"*\" modules=\"iisnode\"/> \r\n \
    </handlers> \r\n \
    <rewrite> \r\n \
      <rules> \r\n \
        <rule name=\"StaticContent\"> \r\n \
          <action type=\"Rewrite\" url=\"public{REQUEST_URI}\"/> \r\n \
        </rule> \
        <rule name=\"DynamicContent\"> \r\n \
          <conditions> \r\n \
            <add input=\"{REQUEST_FILENAME}\" matchType=\"IsFile\" negate=\"True\"/> \r\n \
          </conditions> \r\n \
          <action type=\"Rewrite\" url=\"{NodeStartFile}\"/> \r\n \
        </rule> \r\n \
      </rules> \r\n \
    </rewrite> \r\n \
    <iisnode \r\n \
      nodeProcessCommandLine=\"&quot;c:\\home\\node\\nodist\\bin\\node.exe&quot;\" \r\n \
      debuggingEnabled=\"false\" \r\n \
      logDirectory=\"..\\..\\LogFiles\\nodejs\" \r\n \
      watchedFiles=\"*.js;iisnode.yml;node_modules\\*;views\\*.jade;views\\*.ejb;routes\\*.js\" /> \r\n \
  </system.webServer> \r\n \
</configuration>";

function createIisNodeWebConfigIfNeeded(sitePath) {
    // Check if web.config exists in the 'repository', if not generate it in 'wwwroot'
    var webConfigPath = path.join(sitePath, 'web.config');

    //if (!path.existsSync(webConfigPath)) {
        var nodeStartFilePath = getNodeStartFile(sitePath);
        if (!nodeStartFilePath) {
            console.log('Missing server.js/app.js files, web.config is not generated');
            return;
        }

        var webConfigContent = template.replace(/{NodeStartFile}/g, nodeStartFilePath);

        fs.writeFileSync(webConfigPath, webConfigContent, 'utf8');
    //}
}

function getNodeStartFile(sitePath) {
    var nodeStartFiles = ['server.js', 'app.js'];

    for (var i in nodeStartFiles) {
        var nodeStartFilePath = path.join(sitePath, nodeStartFiles[i]);
        if (path.existsSync(nodeStartFilePath)) {
            return nodeStartFiles[i];
        }
    }

    return null;
}

writeVersions();
createIisNodeWebConfigIfNeeded(sitePath);




