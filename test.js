import test from 'ava';
import balancedLineSplit from '.';

function macro(t, input, expected) {
	t.deepEqual(balancedLineSplit(...input), expected);
}

macro.title = (providedTitle, input) => `“${input[0]}” split to ${input[1]} lines`.trim();

test(macro, ['Friday deploy, good luck!', 3], 'Friday\ndeploy,\ngood luck!');
test(macro, ['Friday deploy, good luck!', 4], 'Friday\ndeploy,\ngood\nluck!');
test(macro, ['Friday deploy, good luck!', 5], 'Friday\ndeploy,\ngood\nluck!\n');
test(macro, ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 4], 'Lorem ipsum\ndolor sit amet,\nconsectetur\nadipiscing elit.');
test(macro, ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 5], 'Lorem ipsum\ndolor sit\namet, consectetur\nadipiscing\nelit.');
test(macro, ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse.', 5], 'Lorem ipsum\ndolor sit amet,\nconsectetur\nadipiscing elit.\nSuspendisse.');
test(macro, ['Selfies ramps forage shabby chic leggings roof party.', 3], 'Selfies ramps forage\nshabby chic leggings\nroof party.');
test(macro, ['Selfies ramps forage shabby chic leggings roof party.', 4], 'Selfies ramps\nforage shabby\nchic leggings\nroof party.');
test(macro, ['Leverage agile frameworks to provide a robust synopsis for high-level overviews.', 5], 'Leverage agile\nframeworks to\nprovide a robust\nsynopsis for high-\nlevel overviews.');
