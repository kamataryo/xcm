# MURASAME

[![Build Status](https://travis-ci.org/kamataryo/murasame.svg?branch=master)](https://travis-ci.org/kamataryo/murasame)

A Simple nested Node.js CLI tool buider.

## install

```shell
$ npm install murasame --save
```

## Usage

```JavaScript
#!/usr/bin/env node

// cli.js
import Murasame from 'murasame'

const command = new Murasame('murasame');
command
  .sub('init')
  .action(() => console.log('init!'))
    .sub('wow')
    .action(() => console.log('wow!'))

command
  .sub('opt')
  .param('hello', true, 'world')
  .action(params => console.log(params))

command
  .sub('a')
    .sub('b')
      .sub('c')
        .sub('d')
          .sub('e')
          .action(() => console.log('abcde!'))
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
          .action(() => console.log('ABCDE!'))

command
  .sub('help')
  .help()

// Go!
const [, , ...args] = process.argv;
command.exec(...args)
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

## Development

```shell
$ git clone git@github.com:kamataryo/murasame.git
$ cd murasame
$ yarn # or npm install
```
