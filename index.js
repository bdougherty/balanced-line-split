const stringWidth = require('string-width');
const stripAnsi = require('strip-ansi');

const isBreakCharacter = (str, index) => {
	const regex = /(\s|-|\u2014|\u2013|\u00ad)/g;
	const breakMatches = [];
	let match;

	while ((match = regex.exec(str))) {
		breakMatches.push(match.index);
	}

	return breakMatches.includes(index);
};

const isBreakOpportunity = (str, index) => {
	if (index === 0 || index === str.length) {
		return true;
	}

	return isBreakCharacter(str, index - 1) && !isBreakCharacter(str, index);
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

const exec = (str, lines) => {
	const idealLineWidth = Math.ceil(stringWidth(str) / lines);

	let remainingLines = lines;
	let remainingText = stripAnsi(str);
	const finalText = [];

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

module.exports = (str, lines) => {
	return String(str)
		.normalize()
		.split('\n')
		.map((line) => exec(line, lines))
		.join('\n');
};
