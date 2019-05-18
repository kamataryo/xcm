import test from "ava";
import Command from "./xcm";

test("register a command", t => {
  let isCalled = false;

  new Command("#root")
    .sub("hello")
    .action(() => (isCalled = true))
    .super()
    .exec("hello");

  t.true(isCalled);
});

test("receives arguments", t => {
  let isCalled = false;

  new Command("#root")
    .sub("hello")
    .action(args => {
      if (args[0] === "arg1" && args[1] === "arg2") {
        isCalled = true;
      }
    })
    .super()
    .exec("hello", "arg1", "arg2");

  t.true(isCalled);
});

test("get parent command", t => {
  let isCalled = false;

  new Command("#root")
    .sub("hello")
    .sub("JavaScript")
    .super()
    .sub("Ruby")
    .action(() => (isCalled = true))
    .super()
    .super()
    .exec("hello", "Ruby");

  t.true(isCalled);
});

test("register a command with description", t => {
  let isCalled = false;

  new Command("#root")
    .sub("hello")
    .action(() => (isCalled = true))
    .super()
    .exec("hello");

  t.true(isCalled);
});

test("register a nested command", t => {
  let isCalled = false;

  new Command("#root")
    .sub("hello")
    .sub("world")
    .action(() => (isCalled = true))
    .super()
    .super()
    .exec("hello", "world");

  t.true(isCalled);
});

test("register a nested command with options", t => {
  let isCalled = false;

  new Command("#root")
    .sub("hello")
    .sub<{ y: boolean; key: string }>("world")
    .describe("hello world command")
    .option("y", { isRequired: true, description: "", default: true })
    .option("key", { isRequired: false, description: "", default: "value" })
    .action((_0, options) => {
      if (options.y === true && options.key === "value") {
        isCalled = true;
      }
    })
    .super()
    .super()
    .exec("hello", "world", "-y", "--key=value");

  t.true(isCalled);
});

test("register a command with default options", t => {
  let isCalled = false;

  new Command("#root")
    .sub<{ y: boolean; key: string }>("hello")
    .option("y", { isRequired: false, description: "", default: true })
    .option("key", { isRequired: false, description: "", default: "value" })
    .action((_0, options) => {
      if (options.y === true && options.key === "value") {
        isCalled = true;
      }
    })
    .super()
    .exec("hello");

  t.true(isCalled);
});

test("Quoted options", t => {
  let isCalled = false;

  new Command("#root")
    .sub<{ key: string }>("hello")
    .option("key", { isRequired: false, description: "", default: "value" })
    .action((_0, options) => {
      if (options.key === "value") {
        isCalled = true;
      }
    })
    .super()
    .exec("hello", '--key="value"');

  t.true(isCalled);
});

test("Single quoted options", t => {
  let isCalled = false;

  new Command("#root")
    .sub<{ key: string }>("hello")
    .option("key", { isRequired: false, description: "", default: "value" })
    .action((_0, options) => {
      if (options.key === "value") {
        isCalled = true;
      }
    })
    .super()
    .exec("hello", "--key='value'");

  t.true(isCalled);
});

test("should get help", t => {
  let help: any;

  new Command("#root")
    .sub<{ key: string }>("hello")
    .describe("This is description for hello subcommand")
    .option("key", { isRequired: false, description: "", default: "value" })
    .action((_0, _1, actualHelp) => (help = actualHelp))
    .super()
    .exec("hello", "--key='value'");

  t.is(help.sub[0].phrase, "hello");
});

test("write help", t => {
  new Command("#root")
    .describe("desribe help for root")
    .option("a", {
      isRequired: false,
      description: "parameter A.",
      default: false
    })
    .option("abc", {
      isRequired: false,
      description: "parameter ABC.",
      default: "default-value-for-ABC"
    })
    .sub("help")
    .help()
    .describe("display help")
    .super()
    .sub("sub-a")
    .describe("sub A.")
    .super()
    .exec("help");

  t.true(true);
});

test("async", t =>
  new Command("#root")
    .sub("async")
    .action(() => new Promise(resolve => setTimeout(resolve, 50)))
    .super()
    .execAsync("async")
    .then(result => t.true(result)));

test("no executables", t => {
  new Command("#root")
    .sub("no-exec")
    .super()
    .exec("no-exec");

  t.true(true);
});
