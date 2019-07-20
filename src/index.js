import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parse from './parsers';

const makeAST = (object1, object2) => {
  const keys = [...Object.keys(object1), ...Object.keys(object2)];
  const uniqKeys = Array.from(new Set(keys)).sort();

  const ast = uniqKeys.reduce((acc, key) => {
    if (!_.has(object2, key)) {
      const item = {
        keyName: key,
        status: 'deleted',
        value: object1[key],
        oldValue: '',
        children: [],
      };

      return [...acc, item];
    }

    if (!_.has(object1, key)) {
      const item = {
        keyName: key,
        status: 'added',
        value: object2[key],
        oldValue: '',
        children: [],
      };

      return [...acc, item];
    }

    if (object1[key] instanceof Object && object2[key] instanceof Object) {
      const item = {
        keyName: key,
        status: 'checkChildren',
        value: '',
        oldValue: '',
        children: makeAST(object1[key], object2[key]),
      };

      return [...acc, item];
    }

    if (object1[key] === object2[key]) {
      const item = {
        keyName: key,
        status: 'notModified',
        value: object1[key],
        oldValue: '',
        children: [],
      };

      return [...acc, item];
    }

    const item = {
      keyName: key,
      status: 'modified',
      value: object2[key],
      oldValue: object1[key],
      children: [],
    };

    return [...acc, item];
  }, []);

  return ast;
};

const stringify = (item, indent) => {
  if (!(item instanceof Object)) {
    return item;
  }

  return Object.entries(item)
    .map(([key, value]) => [
      `{\n${indent}${' '.repeat(6)}${key}: ${value}`,
      `${indent}  }`,
    ].join('\n'));
};

const render = (ast) => {
  const actions = {
    notModified: (item, indent) => `${indent}  ${item.keyName}: ${stringify(item.value, indent)}`,
    modified: (item, indent) => [
      `${indent}+ ${item.keyName}: ${stringify(item.value, indent)}`,
      `${indent}- ${item.keyName}: ${stringify(item.oldValue, indent)}`,
    ].join('\n'),
    added: (item, indent) => `${indent}+ ${item.keyName}: ${stringify(item.value, indent)}`,
    deleted: (item, indent) => `${indent}- ${item.keyName}: ${stringify(item.value, indent)}`,
    checkChildren: (item, indent, func, depth) => [
      `${indent}  ${item.keyName}: {`,
      `${func(item.children, depth + 1)}\n${indent}  }`,
    ].join('\n'),
  };

  const iter = (items, depth = 0) => {
    const indent = ' '.repeat(2);
    const doubleIndent = indent.repeat(2);
    const depthIndent = doubleIndent.repeat(depth);
    const indentation = `${depthIndent}${indent}`;


    return items.map(element => actions[element.status](element, indentation, iter, depth)).join('\n');
  };

  const result = `{\n${iter(ast)}\n}`;

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

  const config1 = fs.readFileSync(pathToConfig1, 'utf-8');
  const config2 = fs.readFileSync(pathToConfig2, 'utf-8');

  const ext1 = path.extname(pathToConfig1);
  const ext2 = path.extname(pathToConfig2);

  const obj1 = parse(config1, ext1);
  const obj2 = parse(config2, ext2);

  const ast = makeAST(obj1, obj2);
  const result = render(ast);

  return result;
};

export default genDiff;
