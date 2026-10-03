"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const context = { console };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, "main.js"), "utf8"), context);

const convertIDtoUnix = context.convertIDtoUnix;

// (snowflake >> 22) + Discord epoch. This ID is above Number.MAX_SAFE_INTEGER.
assert.strictEqual(convertIDtoUnix("175928847299117063"), 1462015105796);
assert.strictEqual(convertIDtoUnix("  175928847299117063\n"), 1462015105796);
assert.strictEqual(convertIDtoUnix("000175928847299117063"), 1462015105796);

// Number() rounding used to report 12:00:31 instead of 12:00:30.999.
assert.strictEqual(convertIDtoUnix("70846957748223999"), 1436961630999);

// Bits below the timestamp do not move the clock.
assert.strictEqual(convertIDtoUnix("0"), 1420070400000);
assert.strictEqual(convertIDtoUnix("42"), 1420070400000);

// Largest unsigned 64-bit snowflake still decodes.
assert.strictEqual(convertIDtoUnix("18446744073709551615"), 5818116911103);

assert.throws(() => convertIDtoUnix(""), /numeric Discord ID/);
assert.throws(() => convertIDtoUnix("   "), /numeric Discord ID/);
assert.throws(() => convertIDtoUnix("abc"), /numeric Discord ID/);
assert.throws(() => convertIDtoUnix("12.3"), /numeric Discord ID/);
assert.throws(() => convertIDtoUnix("<@175928847299117063>"), /numeric Discord ID/);
assert.throws(() => convertIDtoUnix("18446744073709551616"), /not a Discord snowflake/);

console.log("snowflake tests passed");
