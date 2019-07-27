import fs from 'fs';
import genDiff from '../src';

const expected = fs.readFileSync(`${__dirname}/__fixtures__/expected.txt`, 'utf-8');
const expected2 = fs.readFileSync(`${__dirname}/__fixtures__/expected-plain.txt`, 'utf-8');
const expected3 = fs.readFileSync(`${__dirname}/__fixtures__/expected.json`, 'utf-8');

const table = ['json', 'yml', 'ini'].map((ext) => {
  const path1 = `${__dirname}/__fixtures__/before.${ext}`;
  const path2 = `${__dirname}/__fixtures__/after.${ext}`;

  return [ext, path1, path2];
});

test.each(table)(
  '%s configs',
  (testName, path1, path2) => {
    const diff = genDiff(path1, path2);
    const diff2 = genDiff(path1, path2, 'plain');
    const diff3 = genDiff(path1, path2, 'json');

    expect(diff).toBe(expected);
    expect(diff2).toBe(expected2);
    expect(diff3).toBe(expected3);
  },
);
