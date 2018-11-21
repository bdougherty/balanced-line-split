import test from 'ava';
import balancedLineSplit from '.';

test('splits string into balanced lines', (t) => {
	t.is(balancedLineSplit('Friday deploy, good luck!', 3), 'Friday\ndeploy,\ngood luck!');
	t.is(balancedLineSplit('Friday deploy, good luck!', 4), 'Friday\ndeploy,\ngood\nluck!');
	t.is(balancedLineSplit('Friday deploy, good luck!', 5), 'Friday\ndeploy,\ngood\nluck!\n');
	t.is(balancedLineSplit('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 4), 'Lorem ipsum\ndolor sit amet,\nconsectetur\nadipiscing elit.');
	t.is(balancedLineSplit('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 5), 'Lorem ipsum\ndolor sit\namet, consectetur\nadipiscing\nelit.');
	t.is(balancedLineSplit('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse.', 5), 'Lorem ipsum\ndolor sit amet,\nconsectetur\nadipiscing elit.\nSuspendisse.');
	t.is(balancedLineSplit('Selfies ramps forage shabby chic leggings roof party.', 3), 'Selfies ramps forage\nshabby chic leggings\nroof party.');
	t.is(balancedLineSplit('Selfies ramps forage shabby chic leggings roof party.', 4), 'Selfies ramps\nforage shabby\nchic leggings\nroof party.');
	t.is(balancedLineSplit('Leverage agile frameworks to provide a robust synopsis for high-level overviews.', 5), 'Leverage agile\nframeworks to\nprovide a robust\nsynopsis for high-\nlevel overviews.');
});

test('always returns number of lines passed', (t) => {
	t.is(balancedLineSplit('Fewer words than lines', 5), 'Fewer\nwords\nthan\nlines\n');
	t.is(balancedLineSplit('Fewer words than lines', 6), 'Fewer\nwords\nthan\nlines\n\n');
});

test('string with no break opportunities is before line breaks', (t) => {
	t.is(balancedLineSplit('Nobreakopportunity', 3), 'Nobreakopportunity\n\n');
});

test('breaks on whitespace except non-breaking space', (t) => {
	t.is(balancedLineSplit('regular space', 2), 'regular\nspace');
	t.is(balancedLineSplit('nonbreaking\u00A0space', 2), 'nonbreaking\u00A0space\n');
});

test('breaks words on allowed characters', (t) => {
	t.is(balancedLineSplit('em\u2014dash', 2), 'em\u2014\ndash');
	t.is(balancedLineSplit('en\u2013dash', 2), 'en\u2013\ndash');
	t.is(balancedLineSplit('soft\u00ADhyphen', 2), 'soft\u00AD\nhyphen');
});

test('with maximum line length', (t) => {
	const longString = 'this is a really long string that needs to wrap to more than three lines this is a really long string that needs to wrap to more than three lines this is a really long string that needs to wrap to more than three lines this is a really long string that needs to wrap to more than three lines';
	const longStringWithBreaks = 'this is a really long string that needs to wrap to more than\nthree lines this is a really long string that needs to wrap\nto more than three lines this is a really long string that\nneeds to wrap to more than three lines this is a really long\nstring that needs to wrap to more than three lines';
	t.is(balancedLineSplit(longString, 3, 60), longStringWithBreaks);
});
