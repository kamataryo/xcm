#!/usr/bin/env node

const Command = require("../dist").default;

const command = new Command("nest");

command.describe("Something like a library management CLI.").help();

command
  .sub("help")
  .describe("This is help command.")
  .help();

const user = command.sub("user");
const book = command.sub("book");
const lend = command.sub("lend");
const retrieve = command.sub("retrieve");

user
  .sub("create")
  .describe("create a user")
  .action(([name]) => process.stdout.write(`creating a user ${name}\n`));

user
  .sub("delete")
  .describe("delete a user")
  .action(([name]) => process.stdout.write(`deleting a book ${name}\n`));

book
  .sub("create")
  .describe("create a book")
  .action(([name]) => process.stdout.write(`creating a book ${name}\n`));

book
  .sub("delete")
  .describe("delete a book")
  .action(([name]) => process.stdout.write(`deleting a book ${name}\n`));

lend
  .describe("lend a book to an user")
  .action(([user, book]) =>
    process.stdout.write(`lending the book "${book}" to the user "${user}"\n`)
  );

retrieve
  .describe("retrieve a book to an user")
  .action(([user, book]) =>
    process.stdout.write(
      `retrieving the book "${book}" from the user "${user}"\n`
    )
  );

command.parse();
