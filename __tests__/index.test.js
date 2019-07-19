import fs from 'fs';
import genDiff from '../src';

const pathToExpected = `${__dirname}/__fixtures__/expected.txt`;
const expected = fs.readFileSync(pathToExpected, 'utf-8');

const pathToJsonConfig1 = `${__dirname}/__fixtures__/jsonConfigBefore.json`;
const pathToJsonConfig2 = `${__dirname}/__fixtures__/jsonConfigAfter.json`;
const pathToJsonConfig3 = `${__dirname}/__fixtures__/jsonConfigBefore2.json`;
const pathToJsonConfig4 = `${__dirname}/__fixtures__/jsonConfigAfter2.json`;

const pathToYamlConfig1 = `${__dirname}/__fixtures__/yamlConfigBefore.yml`;
const pathToYamlConfig2 = `${__dirname}/__fixtures__/yamlConfigAfter.yml`;
const pathToYamlConfig3 = `${__dirname}/__fixtures__/yamlConfigBefore2.yml`;
const pathToYamlConfig4 = `${__dirname}/__fixtures__/yamlConfigAfter2.yml`;

const pathToIniConfig1 = `${__dirname}/__fixtures__/iniConfigBefore.ini`;
const pathToIniConfig2 = `${__dirname}/__fixtures__/iniConfigAfter.ini`;
const pathToIniConfig3 = `${__dirname}/__fixtures__/iniConfigBefore2.ini`;
const pathToIniConfig4 = `${__dirname}/__fixtures__/iniConfigAfter2.ini`;

const table = [
  ['jsons', pathToJsonConfig1, pathToJsonConfig2, pathToJsonConfig3, pathToJsonConfig4],
  ['yamls', pathToYamlConfig1, pathToYamlConfig2, pathToYamlConfig3, pathToYamlConfig4],
  ['inis', pathToIniConfig1, pathToIniConfig2, pathToIniConfig3, pathToIniConfig4],
];

test.each(table)(
  'simple %s',
  (testName, path1, path2, path3, path4) => {
    const diff = genDiff(path1, path2);
    const diff2 = genDiff(path3, path4);

    expect(diff).toBe(expected);
    expect(diff2).toBe(expected);
  },
);
