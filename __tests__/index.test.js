import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const files = fs.readdirSync(`${__dirname}/__fixtures__/`);
const pathes = files.map(file => `${__dirname}/__fixtures__/${file}`);

const jsons = pathes.filter(p => path.extname(p) === '.json');
const simpleJsons = jsons.filter(p => !p.includes('complex'));
const complexJsons = jsons.filter(p => p.includes('complex'));

const yamls = pathes.filter(p => path.extname(p) === '.ini');
const simpleYamls = yamls.filter(p => !p.includes('complex'));
const complexYamls = yamls.filter(p => p.includes('complex'));

const inis = pathes.filter(p => path.extname(p) === '.ini');
const simpleInis = inis.filter(p => !p.includes('complex'));
const complexInis = inis.filter(p => p.includes('complex'));

const [
  expected1,
  expected2,
  expected3,
] = pathes.filter(p => path.extname(p) === '.txt')
  .map(p => fs.readFileSync(p, 'utf-8'));

const simpleConfigs = {
  jsons: simpleJsons,
  yamls: simpleYamls,
  inis: simpleInis,
};

const complexConfigs = {
  jsons: complexJsons,
  yamls: complexYamls,
  inis: complexInis,
};

const makeTable = configs => Object
  .entries(configs)
  .map(([key, value]) => [key, ...value]);

const table1 = makeTable(simpleConfigs);
const table2 = makeTable(complexConfigs);

test.each(table1)(
  'simple %s',
  (testName, path1, path2, path3, path4) => {
    const diff = genDiff(path3, path1);
    const diff2 = genDiff(path4, path2);

    expect(diff).toBe(expected1);
    expect(diff2).toBe(expected1);
  },
);

test.each(table2)(
  'complex %s',
  (testName, path1, path2, path3, path4) => {
    const diff = genDiff(path3, path1);
    const diff2 = genDiff(path4, path2);

    expect(diff).toBe(expected2);
    expect(diff2).toBe(expected3);
  },
);
