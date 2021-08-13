# balanced-line-split

> Split a string into multiple lines of similar lengths.

## Install

```sh
$ npm install balanced-line-split
```

## Usage

```js
import balancedLineSplit from 'balanced-line-split';

const string = 'split me evenly';
const result = balancedLineSplit(string, 3);

// split
// me
// evenly
```

## API

### balancedLineSplit(string, lines = 1, maxLineLength = Infinity)

#### string

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
