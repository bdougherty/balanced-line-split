import stringWidth from 'string-width';
import stripAnsi from 'strip-ansi';

/*
 * Break characters are:
 * - whitespace (except non-breaking space: u00a0)
 * - hyphen
 * - em dash (u2014)
 * - en dash (u2013)
 * - soft hyphen (u00ad)
 */
const isBreakCharacter = (char) => {
	const regex = /([^\S\u00A0]|-|\u2014|\u2013|\u00AD)/;
	return regex.test(char);
};

const isBreakOpportunity = (string, index) => {
	if (index === 0 || index === string.length) {
		return true;
	}

	const previousChar = string.slice(index - 1, index);
	const nextChar = string.slice(index, index + 1);

	return isBreakCharacter(previousChar) && !isBreakCharacter(nextChar);
};

const findBreakOpportunity = (string, desiredWidth, direction, index) => {
	for (;;) {
		while (!isBreakOpportunity(string, index)) {
			index += direction;
		}

		if (direction < 0 && (index <= desiredWidth || index <= 0)) {
			return index;
		}

		if (direction > 0 && (index >= desiredWidth || index >= string.length)) {
			return index;
		}

		index += direction;
	}
};

const exec = (string, lines, maxLineLength) => {
	if (lines === 1) {
		return stripAnsi(string);
	}

	let idealLineWidth = Math.ceil(stringWidth(string) / lines);

	let remainingLines = lines;
	let remainingText = stripAnsi(string);
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

		finalText.push(remainingText.slice(0, Math.max(0, splitIndex)).trim());
		remainingText = remainingText.slice(splitIndex).trim();
		remainingLines--;
	}

	finalText.push(remainingText.trim());

	return finalText.join('\n');
};

const balancedLineSplit = (string, lines = 2, maxLineLength = Number.POSITIVE_INFINITY) => String(string)
	.normalize()
	.split('\n')
	.map((line) => exec(line, lines, maxLineLength))
	.join('\n');

export default balancedLineSplit;
