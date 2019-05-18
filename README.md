# Xcm

[![Build Status](https://travis-ci.org/kamataryo/xcm.svg?branch=master)](https://travis-ci.org/kamataryo/xcm)

![](./raw/image.png)

XCM or Xcommand is a Node.js CLI tool builder.

## installation

```shell
$ yarn add xcm
$ npm install xcm --save # Use npm
```

## Usage

```JavaScript
#!/usr/bin/env node

//
// cli.js
//


import Command from 'xcm';

const command = new Command('xcm');

command
  .sub('init')
  .action(() => process.stdout.write('init!'))
    .sub('something')
    .action(() => process.stdout.write('init something!'))

command
  .sub('opt')
  .option('hello', {isRequred: true, default: 'world' })
  .action(options => process.stdout.write(options))

command
  .sub('a')
    .sub('b')
      .sub('c')
        .sub('d')
          .sub('e')
          .action(() => process.stdout.write('abcde!'))
          .super()
        .super()
      .super()
    .super()
  .super()
  .sub('A')
    .sub('B')
      .sub('C')
        .sub('D')
          .sub('E')
          .action(() => process.stdout.write('ABCDE!'))

command
  .sub('help')
  .help()

// Go!
command.parse()
```

```shell
$ ./cli.js init                     # init!
$ ./cli.js init something           # init something!
$ ./cli.js opt                      # { hello: "world" }
$ ./cli.js opt -y --hello="Node.js" # { y: true, hello: "Node.js" }
$ ./cli.js a b c d e                # abcde!
$ ./cli.js A B C D E                # ABCDE!
$ ./cli.js help                     # <show help>
```

## APIs

### `constructor`

```javascript
import Command from "xcm";
const commnad = new Command("cli.js");
command.action(() => process.stdout.write("init!")).parse();
```

```shell
$ ./cli.js # init!
```

### `command.sub(phrase:string)`

`sub` define sub command.

```javascript
import Command from "xcm";
new Command("cli.js");
  .sub("hello")
  .action(() => process.stdout.write("hello!"))
  .parse();
```

```shell
$ ./cli.js hello # hello!
```

### `command.option(phrase, options)`

`option` defines acceptable options. This will be used with `help`.

```javascript
import Command from "xcm";
new Command("cli.js");
  .option('word', { isRequired: true })
  .action(opts => process.stdout.write(`say ${opts.word}!`))
  .parse();
```

```shell
$ ./cli.js --word=hello # say hello!
```

### `command.action(callback)`

### `action callback`

### `command.describe(description:string)`

`describe` defines description for the command. This will be used with `help`.

### `command.super()`

### `command.parse()`

`parse` starts parse given environment and execution of each command.

### `command.parseAsync()`

## Development

```shell
$ git clone git@github.com:kamataryo/xcm.git
$ cd xcm
$ yarn # or npm install
```
