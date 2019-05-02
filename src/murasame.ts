type MurasameExecutor<T> = (params: T, phrases?: string[]) => void;
type MuramasaOption = string | { description?: string; defaultParams?: any };

export default class MurasameNode<Params> {
  static isOption = (phrase: string) => {
    const yesNoMatch = phrase.match(/^-(?<key>[a-z,A-Z,0-9])+$/);
    const keyValueMatch = phrase.match(
      /^--(?<key>[a-z,A-Z][a-z,A-Z,0-9]+)(=(?<value>.+))?$/
    );
    return { yesNoMatch, keyValueMatch };
  };

  phrase: string;
  private description?: string;
  private defaultParams?: any;
  private executor?: MurasameExecutor<Params>;
  private childNodes: MurasameNode<any>[] = [];
  constructor(
    phrase: string,
    arg1?: MuramasaOption | MurasameExecutor<Params>,
    arg2?: MurasameExecutor<Params>
  ) {
    this.phrase = phrase;

    if (typeof arg1 === "function") {
      this.executor = arg1;
    } else {
      this.executor = arg2;
      if (typeof arg2 === "string") {
        this.description = arg2;
        this.defaultParams = {};
      } else if (typeof arg1 === "object") {
        this.description = arg1.description || "";
        this.defaultParams = arg1.defaultParams || {};
      }
    }
  }

  registerChildNode<ChildParams>(
    phrase: string,
    arg1?: MuramasaOption | MurasameExecutor<ChildParams>,
    arg2?: MurasameExecutor<ChildParams>
  ): MurasameNode<ChildParams> {
    const node = new MurasameNode<ChildParams>(phrase, arg1, arg2);
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
      const { yesNoMatch, keyValueMatch } = MurasameNode.isOption(phrase);
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

    currentNode.executor(
      { ...currentNode.defaultParams, ...params },
      traversedPhrases
    );
    return true;
  }
}
