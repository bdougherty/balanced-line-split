const stringWidth = require('string-width');
const stripAnsi = require('strip-ansi');

/*
 * Break characters are:
 * - whitespace (except non-breaking space: u00a0)
 * - hyphen
 * - em dash (u2014)
 * - en dash (u2013)
 * - soft hyphen (u00ad)
 */
const isBreakCharacter = (char) => {
	const regex = /([^\S\u00a0]|-|\u2014|\u2013|\u00ad)/;
	return regex.test(char);
};

const isBreakOpportunity = (str, index) => {
	if (index === 0 || index === str.length) {
		return true;
	}

	const previousChar = str.substring(index - 1, index);
	const nextChar = str.substring(index, index + 1);

	return isBreakCharacter(previousChar) && !isBreakCharacter(nextChar);
};

const findBreakOpportunity = (str, desiredWidth, direction, index) => {
	for (;;) {
		while (!isBreakOpportunity(str, index)) {
			index += direction;
		}

		if (direction < 0 && (index <= desiredWidth || index <= 0)) {
			return index;
		}

		if (direction > 0 && (index >= desiredWidth || index >= str.length)) {
			return index;
		}

		index += direction;
	}
};

const exec = (str, lines, maxLineLength) => {
	if (lines === 1) {
		return stripAnsi(str);
	}

	let idealLineWidth = Math.ceil(stringWidth(str) / lines);

	let remainingLines = lines;
	let remainingText = stripAnsi(str);
	const finalText = [];

	// If there are no break opportunities, return the full string as the first
	// line and pad the rest.
	if (![...remainingText].some((char) => isBreakCharacter(char))) {
		return `${remainingText}${'\n'.repeat(lines - 1)}`;
	}

	if (idealLineWidth > maxLineLength) {
		const additionalLines = Math.ceil(idealLineWidth / maxLineLength);
		remainingLines += additionalLines;
		idealLineWidth = maxLineLength;
	}

	while (remainingLines > 1) {
		const guessedIndex = Math.round((remainingText.length + 1) / remainingLines) - 1;
		const initialIndex = findBreakOpportunity(remainingText, idealLineWidth, -1, guessedIndex);
		const afterIndex = findBreakOpportunity(remainingText, idealLineWidth, +1, initialIndex);
		const beforeIndex = findBreakOpportunity(remainingText, idealLineWidth, -1, afterIndex);

		const splitIndex = Math.abs(idealLineWidth - beforeIndex) < Math.abs(idealLineWidth - afterIndex) ? beforeIndex : afterIndex;

		finalText.push(remainingText.substr(0, splitIndex).trim());
		remainingText = remainingText.substr(splitIndex).trim();
		remainingLines--;
	}

	finalText.push(remainingText.trim());

	return finalText.join('\n');
};

module.exports = (str, lines = 2, maxLineLength = Infinity) => {
	return String(str)
		.normalize()
		.split('\n')
		.map((line) => exec(line, lines, maxLineLength))
		.join('\n');
};
