import test from "ava";
import MurasameNode from "./murasame";

test("register a command", t => {
  let isCalled = false;

  const rootMurasameNode = new MurasameNode("#root", "root description");
  rootMurasameNode.registerChildNode<{}>(
    "hello",
    "this is command for `hello`",
    () => (isCalled = true)
  );
  rootMurasameNode.exec("hello");
  t.true(isCalled);
});

test("register a nested command", t => {
  let isCalled = false;

  const rootMurasameNode = new MurasameNode("#root", "root description");
  rootMurasameNode
    .registerChildNode<{}>("hello")
    .registerChildNode<{}>("world", "", () => (isCalled = true));
  rootMurasameNode.exec("hello", "world");
  t.true(isCalled);
});

test("register a nested command with params", t => {
  let isCalled = false;

  const rootMurasameNode = new MurasameNode("#root", "root description");
  rootMurasameNode
    .registerChildNode<{}>("hello")
    .registerChildNode<{ y: boolean; key: string }>("world", "", params => {
      if (params.y === true && params.key === "value") {
        isCalled = true;
      }
    });
  rootMurasameNode.exec("hello", "world", "-y", "--key=value");
  t.true(isCalled);
});

test("register a command with default params", t => {
  let isCalled = false;

  const rootMurasameNode = new MurasameNode("#root", "root description");
  rootMurasameNode.registerChildNode<{ y: boolean; key: string }>(
    "hello",
    {
      description: "",
      defaultParams: { y: true, key: "value" }
    },
    params => {
      if (params.y === true && params.key === "value") {
        isCalled = true;
      }
    }
  );

  rootMurasameNode.exec("hello");
  t.true(isCalled);
});
