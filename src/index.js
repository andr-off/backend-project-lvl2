import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parse from './parsers';
import render from './formatters';

class Node {
  constructor(name, type, value = '', oldValue = '', children = []) {
    this.name = name;
    this.type = type;
    this.value = value;
    this.oldValue = oldValue;
    this.children = children;
  }
}

const makeAST = (object1, object2) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  const keys = [...keys1, ...keys2];
  const setOfKeys = new Set(keys);
  const uniqKeys = Array.from(setOfKeys).sort();

  const ast = uniqKeys.map((key) => {
    if (!_.has(object2, key)) {
      return new Node(key, 'deleted', object1[key]);
    }

    if (!_.has(object1, key)) {
      return new Node(key, 'added', object2[key]);
    }

    if (object1[key] instanceof Object && object2[key] instanceof Object) {
      return new Node(key, 'withChildren', '', '', makeAST(object1[key], object2[key]));
    }

    if (object1[key] === object2[key]) {
      return new Node(key, 'notModified', object1[key]);
    }

    return new Node(key, 'modified', object2[key], object1[key]);
  });

  return ast;
};

const genDiff = (pathToConfig1, pathToConfig2, format) => {
  if (!fs.existsSync(pathToConfig1)) {
    console.log(`No such file: ${pathToConfig1}`);
    return '';
  }

  if (!fs.existsSync(pathToConfig2)) {
    console.log(`No such file: ${pathToConfig2}`);
    return '';
  }

  const config1 = fs.readFileSync(pathToConfig1, 'utf-8');
  const config2 = fs.readFileSync(pathToConfig2, 'utf-8');

  const ext1 = path.extname(pathToConfig1);
  const ext2 = path.extname(pathToConfig2);

  const obj1 = parse(config1, ext1);
  const obj2 = parse(config2, ext2);

  const ast = makeAST(obj1, obj2);
  const result = render(ast, format);

  return result;
};

export default genDiff;
