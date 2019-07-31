import fs from 'fs';
import genDiff from '../src';

const pathToExpected1 = `${__dirname}/__fixtures__/expected.txt`;
const pathToExpected2 = `${__dirname}/__fixtures__/expected-plain.txt`;
const pathToExpected3 = `${__dirname}/__fixtures__/expected.json`;

const table = ['json', 'yml', 'ini'].map((ext) => {
  const path1 = `${__dirname}/__fixtures__/before.${ext}`;
  const path2 = `${__dirname}/__fixtures__/after.${ext}`;

  return [ext, path1, path2];
});

test.each(table)(
  '%s configs',
  (testName, path1, path2) => {
    const expected1 = fs.readFileSync(pathToExpected1, 'utf-8');
    const diff1 = genDiff(path1, path2);
    expect(diff1).toBe(expected1);

    const expected2 = fs.readFileSync(pathToExpected2, 'utf-8');
    const diff2 = genDiff(path1, path2, 'plain');
    expect(diff2).toBe(expected2);

    const expected3 = fs.readFileSync(pathToExpected3, 'utf-8');
    const diff3 = genDiff(path1, path2, 'json');
    expect(diff3).toBe(expected3);
  },
);
