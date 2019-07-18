import fs from 'fs';
import genDiff from '../src';

test('simple jsons', () => {
  const pathToConfig1 = `${__dirname}/__fixtures__/jsonConfigBefore.json`;
  const pathToConfig2 = `${__dirname}/__fixtures__/jsonConfigAfter.json`;
  const pathToConfig3 = `${__dirname}/__fixtures__/jsonConfigBefore2.json`;
  const pathToConfig4 = `${__dirname}/__fixtures__/jsonConfigAfter2.json`;
  const pathToExpected = `${__dirname}/__fixtures__/jsonConfigExpected.txt`;
  const expected = fs.readFileSync(pathToExpected, 'utf-8');

  const diff = genDiff(pathToConfig1, pathToConfig2);
  const diff2 = genDiff(pathToConfig3, pathToConfig4);

  expect(diff).toBe(expected);
  expect(diff2).toBe(expected);
});
