import * as shlex from "shlex";

type MurasameParams = {
  [key: string]: {
    isRequired: boolean;
    default: string | boolean;
  };
};
type MurasameExecutor<T> = (params: T, phrases?: string[]) => void;

export default class MurasameNode<Params> {
  static isOption = (phrase: string) => {
    const yesNoMatch = phrase.match(/^-(?<key>[a-z,A-Z,0-9])+$/);
    const keyValueMatch = phrase.match(
      /^--(?<key>[a-z,A-Z][a-z,A-Z,0-9]+)(=(?<value>.+))?$/
    );
    return { yesNoMatch, keyValueMatch };
  };

  private phrase: string;
  private description?: string;
  private params: MurasameParams = {}; // parameter definitions
  private executor?: MurasameExecutor<Params>;
  private childNodes: MurasameNode<any>[] = [];
  private parent: MurasameNode<any>;
  constructor(phrase: string, parent?: MurasameNode<any>) {
    this.phrase = phrase;
    this.parent = parent || this;
  }

  describe(description: string) {
    this.description = description;
    return this;
  }

  param(
    key: string,
    isRequired: boolean = false,
    defaultValue?: boolean | string
  ) {
    this.params = {
      ...this.params,
      [key]: {
        isRequired,
        default: key.length === 1 ? !!defaultValue : defaultValue.toString()
      }
    };
    return this;
  }

  action(action: MurasameExecutor<Params>) {
    this.executor = action;
    return this;
  }

  sub<ChildParams>(phrase: string): MurasameNode<ChildParams> {
    const node = new MurasameNode<ChildParams>(phrase, this);
    this.childNodes.push(node);
    return node;
  }

  super() {
    return this.parent;
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
        params[keyValueMatch.groups.key] = shlex.split(
          keyValueMatch.groups.value
        )[0];
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

    const defaultParams = Object.keys(currentNode.params).reduce(
      (prev, key) => {
        return { ...prev, [key]: currentNode.params[key].default };
      },
      {}
    );

    // check params type
    for (let key of Object.keys(currentNode.params)) {
      const { isRequired } = currentNode.params[key];
      if (isRequired && params[key] === void 0) {
        process.stderr.write(`${key} is required, but not given.`);
        return false;
      }
    }

    currentNode.executor({ ...defaultParams, ...params }, traversedPhrases);
    return true;
  }
}
