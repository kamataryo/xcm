#!/usr/bin/env bash

./samples/nest.js
./samples/nest.js help
./samples/nest.js user create foo
./samples/nest.js user delete bar
./samples/nest.js book create alice-in-wonderland
./samples/nest.js book delete alice-in-wonderland
./samples/nest.js lend foo alice-in-wonderland
./samples/nest.js retrieve foo alice-in-wonderland
