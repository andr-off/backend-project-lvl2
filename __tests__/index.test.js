import fs from 'fs';
import genDiff from '../src';

const pathToExpected = `${__dirname}/__fixtures__/expected.txt`;
const expected = fs.readFileSync(pathToExpected, 'utf-8');

test('simple jsons', () => {
  const pathToConfig1 = `${__dirname}/__fixtures__/jsonConfigBefore.json`;
  const pathToConfig2 = `${__dirname}/__fixtures__/jsonConfigAfter.json`;
  const pathToConfig3 = `${__dirname}/__fixtures__/jsonConfigBefore2.json`;
  const pathToConfig4 = `${__dirname}/__fixtures__/jsonConfigAfter2.json`;

  const diff = genDiff(pathToConfig1, pathToConfig2);
  const diff2 = genDiff(pathToConfig3, pathToConfig4);

  expect(diff).toBe(expected);
  expect(diff2).toBe(expected);
});

test('simple yamls', () => {
  const pathToConfig1 = `${__dirname}/__fixtures__/yamlConfigBefore.yml`;
  const pathToConfig2 = `${__dirname}/__fixtures__/yamlConfigAfter.yml`;
  const pathToConfig3 = `${__dirname}/__fixtures__/yamlConfigBefore2.yml`;
  const pathToConfig4 = `${__dirname}/__fixtures__/yamlConfigAfter2.yml`;

  const diff = genDiff(pathToConfig1, pathToConfig2);
  const diff2 = genDiff(pathToConfig3, pathToConfig4);

  expect(diff).toBe(expected);
  expect(diff2).toBe(expected);
});
