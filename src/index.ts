type MurasameExecutor<T> = (params: T, phrases?: string[]) => void;

const isOption = (phrase: string) => {
  const yesNoMatch = phrase.match(/^-(?<key>[a-z,A-Z,0-9])+$/);
  const keyValueMatch = phrase.match(
    /^--(?<key>[a-z,A-Z][a-z,A-Z,0-9]+)(=(?<value>.+))?$/
  );
  return { yesNoMatch, keyValueMatch };
};

class MurasameNode<Params> {
  phrase: string;
  private description?: string;
  private executor?: MurasameExecutor<Params>;
  private childNodes: MurasameNode<any>[] = [];
  constructor(
    phrase: string,
    description?: string,
    executor?: MurasameExecutor<Params>
  ) {
    this.phrase = phrase;
    this.description = description;
    this.executor = executor;
  }

  registerChildNode<ChildParams>(
    phrase: string,
    description?: string,
    exec?: MurasameExecutor<ChildParams>
  ): MurasameNode<ChildParams> {
    const node = new MurasameNode<ChildParams>(phrase, description, exec);
    this.childNodes.push(node);
    return node;
  }

  private findChildNode(phrase: string): MurasameNode<any> | false {
    for (let node of this.childNodes) {
      if (node.phrase === phrase) {
        return node;
      }
    }
    return false;
  }

  exec(...phrases: string[]): boolean {
    const params: any = {};
    const traversedPhrases = [this.phrase];
    let currentNode: MurasameNode<Params> = this;
    for (let phrase of phrases) {
      const { yesNoMatch, keyValueMatch } = isOption(phrase);
      if (yesNoMatch) {
        params[yesNoMatch.groups.key] = true;
      } else if (keyValueMatch) {
        params[keyValueMatch.groups.key] = keyValueMatch.groups.value;
      } else {
        const nextNode = currentNode.findChildNode(phrase);
        if (nextNode) {
          traversedPhrases.push(phrase);
          currentNode = nextNode;
        } else {
          process.stderr.write("no such command");
          return false;
        }
      }
    }
    currentNode.executor(params, traversedPhrases);
    return true;
  }
}

const rootMurasameNode = new MurasameNode("#root", "root description");

rootMurasameNode
  .registerChildNode<{}>("b", "", (params, phrases) =>
    console.log("b", params, phrases)
  )
  .registerChildNode<{}>("b-1", "", (params, phrases) =>
    console.log("b b-1", params, phrases)
  );

rootMurasameNode.registerChildNode<{}>("a", "", (params, phrases) =>
  console.log("a", params, phrases)
);

// rootMurasameNode.exec("aaa");
// rootMurasameNode.exec("bbb");
rootMurasameNode.exec("b", "b-1", "-a", "--abc=value");
// rootMurasameNode.exec("b-1");
