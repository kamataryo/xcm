# MURASAME

[![Build Status](https://travis-ci.org/kamataryo/murasame.svg?branch=master)](https://travis-ci.org/kamataryo/murasame)

A Node.js CLI tool builder.

## installation

```shell
$ yarn add murasame
$ npm install murasame --save # Use npm
```

## Usage

```JavaScript
#!/usr/bin/env node

//
// cli.js
//


import Command from 'murasame';

const command = new Command('murasame');

command
  .sub('init')
  .action(() => process.stdout.srite('init!'))
    .sub('wow')
    .action(() => process.stdout.srite('wow!'))

command
  .sub('opt')
  .option('hello', {isRequred: true, default: 'world' })
  .action(options => process.stdout.srite(options))

command
  .sub('a')
    .sub('b')
      .sub('c')
        .sub('d')
          .sub('e')
          .action(() => process.stdout.srite('abcde!'))
          .suprer()
        .super()
      .super()
    .super()
  .super()
  .sub('A')
    .sub('B')
      .sub('C')
        .sub('D')
          .sub('E')
          .action(() => process.stdout.srite('ABCDE!'))

command
  .sub('help')
  .help()

// Go!
command.parse()
```

```shell
$ ./cli.js init                     # init!
$ ./cli.js init wow                 # wow!
$ ./cli.js opt                      # { hello: "world" }
$ ./cli.js opt -y --hello="Node.js" # { y: true, hello: "Node.js" }
$ ./cli.js a b c d e                # abcde!
$ ./cli.js A B C D E                # ABCDE!
$ ./cli.js help                     # <show help>
```

## APIs

### `constructor`

```javascript
import Command from "murasame";
const commnad = new Command("cli.js");
command.action(() => process.stdout.write("hello!")).parse();
```

```shell
$ ./cli.js # hello!
```

- `command.sub(phrase:string)`
- `command.option(phrase, options)`
- `command.action(callback)`
- `command.describe(description:string)`
- `action callback`
- `command.super()`
- `command.parse()`
- `command.parseAsync()`

## Development

```shell
$ git clone git@github.com:kamataryo/murasame.git
$ cd murasame
$ yarn # or npm install
```
