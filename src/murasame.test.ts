import test from "ava";
import Murasame from "./murasame";

test("register a command", t => {
  let isCalled = false;

  const command = new Murasame("#root");
  command.sub("hello").action(() => (isCalled = true));
  command.exec("hello");
  t.true(isCalled);
});

test("get parent command", t => {
  let isCalled = false;

  const command = new Murasame("#root");

  command
    .sub("hello")
    .sub("JavaScript")
    .super()
    .sub("Ruby")
    .action(() => (isCalled = true));

  command.exec("hello", "Ruby");
  t.true(isCalled);
});

test("register a command with description", t => {
  let isCalled = false;

  const command = new Murasame("#root");
  command.sub("hello").action(() => (isCalled = true));
  command.exec("hello");
  t.true(isCalled);
});

test("register a nested command", t => {
  let isCalled = false;

  const command = new Murasame("#root");
  command
    .sub("hello")
    .sub("world")
    .action(() => (isCalled = true));
  command.exec("hello", "world");
  t.true(isCalled);
});

test("register a nested command with params", t => {
  let isCalled = false;

  const command = new Murasame("#root");
  command
    .sub("hello")
    .sub<{ y: boolean; key: string }>("world")
    .describe("hello world command")
    .param("y", true, true)
    .param("key", false, "value")
    .action(params => {
      if (params.y === true && params.key === "value") {
        isCalled = true;
      }
    });

  command.exec("hello", "world", "-y", "--key=value");
  t.true(isCalled);
});

test("register a command with default params", t => {
  let isCalled = false;

  const command = new Murasame("#root");
  command
    .sub<{ y: boolean; key: string }>("hello")
    .param("y", false, true)
    .param("key", false, "value")
    .action(params => {
      if (params.y === true && params.key === "value") {
        isCalled = true;
      }
    });

  command.exec("hello");
  t.true(isCalled);
});
