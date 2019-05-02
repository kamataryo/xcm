import test from "ava";
import * as Murasame from "./murasame";

test("register a command", t => {
  let isCalled = false;

  new Murasame.default("#root")
    .sub("hello")
    .action(() => (isCalled = true))
    .super()
    .exec("hello");

  t.true(isCalled);
});

test("get parent command", t => {
  let isCalled = false;

  new Murasame.default("#root")
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

  new Murasame.default("#root")
    .sub("hello")
    .action(() => (isCalled = true))
    .super()
    .exec("hello");

  t.true(isCalled);
});

test("register a nested command", t => {
  let isCalled = false;

  new Murasame.default("#root")
    .sub("hello")
    .sub("world")
    .action(() => (isCalled = true))
    .super()
    .super()
    .exec("hello", "world");

  t.true(isCalled);
});

test("register a nested command with params", t => {
  let isCalled = false;

  new Murasame.default("#root")
    .sub("hello")
    .sub<{ y: boolean; key: string }>("world")
    .describe("hello world command")
    .param("y", { isRequired: true, description: "", default: true })
    .param("key", { isRequired: false, description: "", default: "value" })
    .action(params => {
      if (params.y === true && params.key === "value") {
        isCalled = true;
      }
    })
    .super()
    .super()
    .exec("hello", "world", "-y", "--key=value");

  t.true(isCalled);
});

test("register a command with default params", t => {
  let isCalled = false;

  new Murasame.default("#root")
    .sub<{ y: boolean; key: string }>("hello")
    .param("y", { isRequired: false, description: "", default: true })
    .param("key", { isRequired: false, description: "", default: "value" })
    .action(params => {
      if (params.y === true && params.key === "value") {
        isCalled = true;
      }
    })
    .super()
    .exec("hello");

  t.true(isCalled);
});

test("Quoted param", t => {
  let isCalled = false;

  new Murasame.default("#root")
    .sub<{ key: string }>("hello")
    .param("key", { isRequired: false, description: "", default: "value" })
    .action(params => {
      if (params.key === "value") {
        isCalled = true;
      }
    })
    .super()
    .exec("hello", '--key="value"');

  t.true(isCalled);
});

test("Single quoted param", t => {
  let isCalled = false;

  new Murasame.default("#root")
    .sub<{ key: string }>("hello")
    .param("key", { isRequired: false, description: "", default: "value" })
    .action(params => {
      if (params.key === "value") {
        isCalled = true;
      }
    })
    .super()
    .exec("hello", "--key='value'");

  t.true(isCalled);
});

test("should get help", t => {
  let help: Murasame.MurasameHelp;

  new Murasame.default("#root")
    .sub<{ key: string }>("hello")
    .describe("This is description for hello subcommand")
    .param("key", { isRequired: false, description: "", default: "value" })
    .action((_0, actualHelp) => (help = actualHelp))
    .super()
    .exec("hello", "--key='value'");

  t.is(help.sub[0].phrase, "hello");
});

test("write help", t => {
  new Murasame.default("#root")
    .describe("desribe help for root")
    .param("a", {
      isRequired: false,
      description: "parameter A.",
      default: "default-value-for-a"
    })
    .sub("help")
    .help()
    .describe("display help")
    .super()
    .exec("help");

  t.true(true);
});

test("async", t =>
  new Murasame.default("#root")
    .sub("async")
    .action(() => new Promise(resolve => setTimeout(resolve, 50)))
    .super()
    .execAsync("async")
    .then(result => t.true(result)));

test("no executables", t => {
  new Murasame.default("#root")
    .sub("no-exec")
    .super()
    .exec("no-exec");

  t.true(true);
});
