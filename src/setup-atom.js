const path = require("path");
if (!process.env.GITHUB_ACTIONS) {
	process.env.RUNNER_TEMP = path.resolve("./temp");
}
const tc = require("@actions/tool-cache");
const core = require("@actions/core");
const exec = require("@actions/exec");
const { execSync } = require("child_process");

async function downloadAtom(channel, folder) {
	switch (process.platform) {
		case "win32": {
			const downloadFile = await tc.downloadTool("https://atom.io/download/windows_zip?channel=" + channel);
			await tc.extractZip(downloadFile, folder);
			break;
		}
		case "darwin": {
			const downloadFile = await tc.downloadTool("https://atom.io/download/mac?channel=" + channel);
			await exec.exec("unzip", ["-q", downloadFile, "-d", folder]);
			break;
		}
		default: {
			const downloadFile = await tc.downloadTool("https://atom.io/download/deb?channel=" + channel);
			await exec.exec("dpkg-deb", ["-x", downloadFile, folder]);
			break;
		}
	}
}

async function addToPath(channel, folder) {
	switch (process.platform) {
		case "win32": {
			let atomfolder = "Atom";
			if (channel !== "stable") {
				atomfolder += ` ${channel[0].toUpperCase() + channel.substring(1)}`;
			}
			const atomPath = path.join(folder, atomfolder, "resources", "cli");
			if (process.env.GITHUB_ACTIONS) {
				core.addPath(atomPath);
			} else {
				// console.log(`setX PATH=${atomPath};%PATH%`);
				// execSync(`setx PATH=${atomPath};%PATH%`);
				console.log(`set PATH=${atomPath};%PATH%`);
				execSync(`set PATH=${atomPath};%PATH%`);
				execSync("echo %PATH%");
			}
			break;
		}
		case "darwin": {
			let atomfolder = "Atom";
			if (channel !== "stable") {
				atomfolder += ` ${channel[0].toUpperCase() + channel.substring(1)}`;
			}
			atomfolder += ".app";
			const atomPath = path.join(folder, atomfolder, "Contents", "Resources", "app");
			await exec.exec("ln", ["-s", path.join(atomPath, "atom.sh"), path.join(atomPath, "atom")]);
			const apmPath = path.join(atomPath, "apm", "bin");
			if (process.env.GITHUB_ACTIONS) {
				core.addPath(atomPath);
				core.addPath(apmPath);
			} else {
				console.log(`export "PATH=${atomPath}:${apmPath}:$PATH"`);
				execSync(`export "PATH=${atomPath}:${apmPath}:$PATH"`);
				execSync("echo $PATH");
			}
			break;
		}
		default: {
			await exec.exec("/sbin/start-stop-daemon --start --quiet --pidfile /tmp/custom_xvfb_99.pid --make-pidfile --background --exec /usr/bin/Xvfb -- :99 -ac -screen 0 1280x1024x16");
			if (process.env.GITHUB_ACTIONS) {
				await core.exportVariable("DISPLAY", ":99");
			} else {
				execSync("export DISPLAY=\":99\"");
			}
			let atomfolder = "atom";
			if (channel !== "stable") {
				atomfolder += `-${channel}`;
			}
			const atomPath = path.join(folder, "usr", "share", atomfolder);
			const apmPath = path.join(atomPath, "resources", "app", "apm", "bin");
			if (process.env.GITHUB_ACTIONS) {
				core.addPath(atomPath);
				core.addPath(apmPath);
			} else {
				console.log(`export "PATH=${atomPath}:${apmPath}:$PATH"`);
				execSync(`export "PATH=${atomPath}:${apmPath}:$PATH"`);
				execSync("echo $PATH");
			}
			break;
		}
	}
}

module.exports = {
	downloadAtom,
	addToPath,
};
