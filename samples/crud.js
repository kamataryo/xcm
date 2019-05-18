#!/usr/bin/env node

const Command = require("../dist").default;

const command = new Command("crud");

command.describe("Simple crud example.").help();

command
  .sub("help")
  .describe("", "This is help command.")
  .help();

command
  .sub("update")
  .describe("[key] [value]", "This is update command.")
  .action(() => process.stdout.write("update\n"))
  .sub("help")
  .describe("This is help for update command.")
  .help();

command
  .sub("list")
  .describe("", "This is list command.")
  .action(() => process.stdout.write("list\n"));

command
  .sub("delete")
  .describe("[key]", "This is delete command.")
  .action(() => process.stdout.write("delete\n"));

command.parse();
