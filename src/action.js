#!/usr/bin/env node

const path = require("path");
const core = require("@actions/core");
const {downloadAtom, addToPath} = require("./setup-atom.js");

async function run() {
	try {
		const channel = process.env.GITHUB_ACTIONS
			? core.getInput("channel", {required: true}).toLowerCase()
			: process.argv[2] || "stable";
		const folder = process.env.GITHUB_ACTIONS
			? path.join(process.env.GITHUB_WORKSPACE, "atom")
			: path.resolve(process.argv[3] || "atom");
		console.log("channel=%s", channel);
		console.log("folder=%s", folder);

		await downloadAtom(channel, folder);
		await addToPath(channel, folder);

	} catch (error) {
		if (process.env.GITHUB_ACTIONS) {
			core.setFailed(error.message);
		} else {
			console.error(error);
			process.exit(1);
		}
	}
}

run();
