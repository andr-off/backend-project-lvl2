import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parse from './parsers';
import render from './formatters';

const makeAST = (object1, object2) => {
  const keys = _.union(_.keys(object1), _.keys(object2)).sort();

  const ast = keys.map((key) => {
    const node = {
      propertyName: key,
      type: '',
      oldValue: '',
      newValue: '',
      children: [],
    };

    if (!_.has(object2, key)) {
      node.type = 'deleted';
      node.oldValue = object1[key];

      return node;
    }

    if (!_.has(object1, key)) {
      node.type = 'added';
      node.newValue = object2[key];

      return node;
    }

    if (_.isObject(object1[key]) && _.isObject(object2[key])) {
      node.type = 'withChildren';
      node.children = makeAST(object1[key], object2[key]);

      return node;
    }

    if (object1[key] === object2[key]) {
      node.type = 'notModified';
      node.oldValue = object1[key];

      return node;
    }

    node.type = 'modified';
    node.oldValue = object1[key];
    node.newValue = object2[key];

    return node;
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
