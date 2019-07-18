import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parse from './parsers';

const compare = (object1, object2) => {
  const keys = [...Object.keys(object1), ...Object.keys(object2)];
  const uniqKeys = Array.from(new Set(keys)).sort();

  const result = uniqKeys.map((key) => {
    if (_.has(object2, key) && object1[key] === object2[key]) {
      return `    ${key}: ${object1[key]}`;
    }

    if (!_.has(object1, key)) {
      return `  + ${key}: ${object2[key]}`;
    }

    if (!_.has(object2, key)) {
      return `  - ${key}: ${object1[key]}`;
    }

    return `  + ${key}: ${object2[key]}\n  - ${key}: ${object1[key]}`;
  }).join('\n');

  return result;
};

const genDiff = (pathToConfig1, pathToConfig2) => {
  if (!fs.existsSync(pathToConfig1)) {
    console.log(`No such file: ${pathToConfig1}`);
    return '';
  }

  if (!fs.existsSync(pathToConfig2)) {
    console.log(`No such file: ${pathToConfig2}`);
    return '';
  }

  const config1 = fs.readFileSync(pathToConfig1);
  const config2 = fs.readFileSync(pathToConfig2);
  const ext1 = path.extname(pathToConfig1);
  const ext2 = path.extname(pathToConfig2);

  const obj1 = parse(config1, ext1);
  const obj2 = parse(config2, ext2);

  return `{\n${compare(obj1, obj2)}\n}`;
};

export default genDiff;
