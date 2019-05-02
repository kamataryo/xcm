import * as shlex from "shlex";
import * as table from "text-table";

export type MurasameParams = {
  [key: string]: {
    isRequired: boolean;
    description: string;
    default: string | boolean;
    type: string;
  };
};

export type MurasameHelp = {
  phrase: string;
  description?: string;
  params: MurasameParams;
  sub: MurasameHelp[];
};

export type MurasameExecutor<T> = (
  params: T,
  helps: MurasameHelp,
  phrases?: string[]
) => any;

export default class MurasameNode<Params> {
  static isOption = (phrase: string) => {
    const yesNoMatch = phrase.match(/^-([a-z,A-Z,0-9])+$/);
    const keyValueMatch = phrase.match(/^--([a-z,A-Z][a-z,A-Z,0-9]+)=(.+)$/);
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
    key: string | string[],
    options: {
      isRequired?: boolean;
      description?: string;
      default?: boolean | string;
    } = {}
  ) {
    const keys = Array.isArray(key) ? key : [key];
    const additionalParams = keys.reduce(
      (prev, key) => ({
        ...prev,
        [key]: {
          isRequired: options.isRequired || false,
          description: options.description || "",
          default:
            key.length === 1 ? !!options.default : options.default.toString(),
          type: keys[0]
        }
      }),
      {}
    );

    this.params = {
      ...this.params,
      ...additionalParams
    };
    return this;
  }

  action(action: MurasameExecutor<Params>) {
    this.executor = action;
    return this;
  }

  help() {
    this.executor = murasameHelpWriter;
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

  private getHelps(): any {
    return {
      phrase: this.phrase,
      description: this.description || "",
      params: this.params,
      sub: this.childNodes.map(node => node.getHelps())
    };
  }

  exec(...phrases: string[]): boolean {
    const params: any = {};
    const traversedPhrases = [this.phrase];
    let currentNode: MurasameNode<Params> = this;
    for (let phrase of phrases) {
      const { yesNoMatch, keyValueMatch } = MurasameNode.isOption(phrase);
      if (yesNoMatch) {
        params[yesNoMatch[1]] = true;
      } else if (keyValueMatch) {
        // solve quoted params like --url="https://example.com"
        params[keyValueMatch[1]] = shlex.split(keyValueMatch[2])[0];
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

    typeof currentNode.executor === "function" &&
      currentNode.executor(
        { ...defaultParams, ...params },
        this.getHelps(),
        traversedPhrases
      );

    return true;
  }

  async execAsync(...phrases: string[]) {
    return this.exec(...phrases);
  }

  parse() {
    const [, , ...args] = process.argv;
    return this.exec(...args);
  }

  parseAsync() {
    const [, , ...args] = process.argv;
    return this.execAsync(...args);
  }
}

const murasameHelpWriter = (
  _0: any,
  help: MurasameHelp,
  traversedPhrases: string[]
) => {
  const { description, params, sub } = help;

  const parentalPhrases = traversedPhrases.splice(
    0,
    traversedPhrases.length - 1
  );

  const options =
    Object.keys(params).length > 0
      ? `Options:
${table(
  Object.keys(params).map(key => {
    const displayOption = key.length > 1 ? `--${key}` : `-${key}`;
    const defaultValue = params[key].default ? `[${params[key].default}]` : "";
    return ["    ", displayOption, defaultValue, params[key].description];
  })
)}`
      : "";

  const commands =
    sub.length > 0
      ? `Commands:
${table(sub.map(({ phrase, description }) => ["    ", phrase, description]))}`
      : "";

  process.stdout.write(
    [
      `Usage: ${parentalPhrases.join(" ")} [command] [options]`,
      "",
      description,
      "",
      options,
      ``,
      commands,
      ""
    ].join("\n")
  );
};
