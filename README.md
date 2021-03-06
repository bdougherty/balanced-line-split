# balanced-line-split
[![Build Status](https://travis-ci.org/bdougherty/balanced-line-split.svg?branch=master)](https://travis-ci.org/bdougherty/balanced-line-split)

> Split a string into multiple lines of similar lengths.

## Install

```sh
$ npm install balanced-line-split
```

## Usage

```js
const balancedLineSplit = require('balanced-line-split');

const str = 'split me evenly';
const result = balancedLineSplit(str, 3);

// split
// me
// evenly
```

## API

### balancedLineSplit(str, lines = 1, maxLineLength = Infinity)

#### str

Type: `string`

The string to split.

#### lines

Type: `Number`

The number of lines to split the string across. Note that the resulting string will include enough line breaks to match this number of lines, even if there is no text to fill them.

#### maxLineLength

Type: `Number`

Attempt to stay within a specified maximum line length.

## Related

* [Balance Text](https://github.com/adobe-webplatform/balance-text) - balanced-line-split is based off the algorithm from this package

## License

MIT © [Brad Dougherty](https://brad.is)
