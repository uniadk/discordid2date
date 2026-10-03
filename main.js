// MIT License
// 
// Copyright (c) 2019 Hugonun(https://github.com/hugonun)

// Discord epoch: 2015-01-01T00:00:00.000Z.
// https://discord.com/developers/docs/reference#snowflakes
var DISCORD_EPOCH_MS = 1420070400000n;
var SNOWFLAKE_UINT64_LIMIT = 1n << 64n;

function convertIDtoUnix(id) {
	/* Discord snowflakes are unsigned 64-bit integers. Number() only keeps 53 bits, so modern IDs must stay BigInts. */
	var text = String(id).trim();
	if (!/^[0-9]+$/.test(text)) {
		throw new Error("Enter a numeric Discord ID.");
	}
	var snowflake = BigInt(text);
	if (snowflake >= SNOWFLAKE_UINT64_LIMIT) {
		throw new Error("That value is not a Discord snowflake.");
	}
	// Top 42 bits are milliseconds since the Discord epoch.
	return Number((snowflake >> 22n) + DISCORD_EPOCH_MS);
}

function convert(id) {
	var dateEl = document.getElementById("i-date24");
	var agoEl = document.getElementById("i-timeago");
	try {
		if (typeof moment !== "function") {
			throw new Error("Date library failed to load.");
		}
		var unix = convertIDtoUnix(id);
		var timestamp = moment.unix(unix / 1000);
		dateEl.textContent = timestamp.format("DD-MM-YYYY, HH:mm:ss");
		agoEl.textContent = timestamp.fromNow();
	} catch (err) {
		dateEl.textContent = err && err.message ? err.message : "Enter a numeric Discord ID.";
		agoEl.textContent = "";
	}
}

function bindDiscordIdInput() {
	var input = document.getElementById("i-id");
	if (!input || input.getAttribute("data-convert-bound") === "1") {
		return;
	}
	input.setAttribute("data-convert-bound", "1");
	input.addEventListener("keydown", function (event) {
		if (event.key === "Enter") {
			event.preventDefault();
			convert(input.value);
		}
	});
}

if (typeof document !== "undefined") {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", bindDiscordIdInput);
	} else {
		bindDiscordIdInput();
	}
}
