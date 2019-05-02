# MURASAME

[![Build Status](https://travis-ci.org/kamataryo/murasame.svg?branch=master)](https://travis-ci.org/kamataryo/murasame)

A Node.js CLI tool builder.

## features

- easy to nest
- Chain API
- Asynchronous support
- TypeScript Support

## install

```shell
$ yarn add murasame # or npm install murasame --save
```

## Usage

```JavaScript
#!/usr/bin/env node

// cli.js
const Murasame = require('murasame').default;

const command = new Murasame('murasame');
command
  .sub('init')
  .action(() => process.stdout.srite('init!'))
    .sub('wow')
    .action(() => process.stdout.srite('wow!'))

command
  .sub('opt')
  .param('hello', true, 'world')
  .action(params => process.stdout.srite(params))

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
$ cli.js init                     # init!
$ cli.js init wow                 # wow!
$ cli.js opt                      # { hello: "world" }
$ cli.js opt -y --hello="Node.js" # { y: true, hello: "Node.js" }
$ cli.js a b c d e                # abcde!
$ cli.js A B C D E                # ABCDE!
$ cli.js help                     # <show help>
```

## APIs

- `command.describe(description:string)`
- `command.sub(phrase:string)`
- `command.param()`
- `command.action()`
- `command.super()`
- `command.exec()`
- `command.execAsync()`
- `command.parse()`
- `command.parseAsync()`

## Development

```shell
$ git clone git@github.com:kamataryo/murasame.git
$ cd murasame
$ yarn # or npm install
```
