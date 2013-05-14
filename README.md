azure-node-runtime-selector
===========================

Custom deployment script for choosing any node or npm version for your Azure Website. Will download the selected versions dynamically during deployment.

# How to use

* Clone this repo or grab the zip and extract to the folder where your node app lives. 
* Create your website i.e. `azure site create --git`
* Add all files for your project i.e. `git add .`
* Select your node / npm version (see version selection below)
* Commit your files `git commit -am "first commit"`
* Push to Azure `git push azure master`. 
  * The first time you push you will notice it installs [nodist] (https://github.com/marcelklehr/nodist), a node version manager for windows.
  * After the initial install it will then download the specified node/npm version.
  * On successive pushes it will not download newer versions unless you update the selected versions.

Note: For npm future deployments will be much faster if you specify a specific version rather than using a semver i.e. "1.8.x". 

# Version selection
Several options are available for specifying your selected node and npm version.

## Using package.json
You can specify your versions using the standard "engines" block in package.json i.e.
```javascript
engines: {
  "node": "0.10.x",
  "npm": "1.2.x"
}
```
## Setting version in the portal
You can set specify versions in the Windows Azure portal by adding the settings NODE_VERSION and NPM_VERSION on the configure tab as show below.

![Settings in the portal](https://dl.dropboxusercontent.com/u/6860088/NODE%20APP%20SETTINGS.png "Windows Azure Portal")

Make sure you click "Save" on the bottom to have the settings change take effect.

If the app is already deployed, you can make the version change take effect immediately within the portal by redeploying your last deployment. To do that head to the "Deployments" tab, select your most recent deployment and then click "Redeploy" on the bottom.

![Redeploy](https://dl.dropboxusercontent.com/u/6860088/version%20selection%20redeploy.png "Redeploying the last deployment")

Check the logs after deployment is completed to see if any errors occured.

## Setting a version via the CLI
If you are using the azure-cli, you can also select a version and apply from the shell using `azure site config`

```bash
azure site config add NODE_VERSION=0.10.x
azure site config add NPM_VERSION=1.2.x
```

Next to apply the changes redeploy your app. First list the deployments.

```bash
azure site deployment list
```

The output will be as follows listing each commit that has been deployed.

```bash
info:    Executing command site deployment list
+ Enumerating deployments
data:    Time                 Commit id   Status   Author       Message
data:    -------------------  ----------  -------  -----------  ------------
data:    2013-05-12 23:37:49  f925d413dc  Active   Glenn Block  updated
data:    2013-05-12 23:23:42  9c5bf8ec17  Success  Glenn Block  updated
```

Next redeploy the last commit.

```bash
azure site deployment redeploy f925d413dc
```

Which will give you a result similar to the following.

```bash
info:    Executing command site deployment redeploy
Web site name: gbnodever
Reploy deployment with f925d413dc id?  (y/n) y
+ Redeploying deployment
+ Enumerating deployments
data:    Time                 Commit id   Status   Author       Message
data:    -------------------  ----------  -------  -----------  ------------
data:    2013-05-13 00:53:57  f925d413dc  Active   Glenn Block  updated
data:    2013-05-12 23:23:42  9c5bf8ec17  Success  Glenn Block  updated
info:    site deployment redeploy command OK
```

Regardless of which method you use, when you deploy, the selected npm version and node version will be used.

If you check your app, you should see that it will be running the selected node version.

# A note on space
* Nodist takes up about 10 meg
* Each node version that is installed takes up approx 5 meg of storage. 
* npm takes up about 25 megs total (including it's dependencies).

# License
Apache 2: http://www.apache.org/licenses/LICENSE-2.0.html
