import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parse from './parsers';
import render from './formatters';

const makeAST = (object1, object2) => {
  const keys = _.union(_.keys(object1), _.keys(object2)).sort();

  const ast = keys.map((key) => {
    if (!_.has(object2, key)) {
      return {
        propertyName: key,
        type: 'deleted',
        oldValue: object1[key],
      };
    }

    if (!_.has(object1, key)) {
      return {
        propertyName: key,
        type: 'added',
        newValue: object2[key],
      };
    }

    if (_.isObject(object1[key]) && _.isObject(object2[key])) {
      return {
        propertyName: key,
        type: 'withChildren',
        children: makeAST(object1[key], object2[key]),
      };
    }

    if (object1[key] === object2[key]) {
      return {
        propertyName: key,
        type: 'notModified',
        oldValue: object1[key],
      };
    }

    return {
      propertyName: key,
      type: 'modified',
      oldValue: object1[key],
      newValue: object2[key],
    };
  });

  return ast;
};

const genDiff = (pathToConfig1, pathToConfig2, format) => {
  if (!fs.existsSync(pathToConfig1) || !fs.existsSync(pathToConfig2)) {
    throw new Error('File not found.');
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
