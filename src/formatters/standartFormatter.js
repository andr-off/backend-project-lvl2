import _ from 'lodash';

const makeIndent = (times) => {
  const indent = ' '.repeat(2);
  const doubleIndent = indent.repeat(2);
  const indentation = doubleIndent.repeat(times);

  return `${indentation}${indent}`;
};

const stringify = (item, depth) => {
  if (!_.isObject(item)) {
    return item;
  }

  return Object.entries(item)
    .map(([key, value]) => [
      `{\n${makeIndent(depth)}${' '.repeat(6)}${key}: ${value}`,
      `${makeIndent(depth)}  }`,
    ].join('\n'));
};

const makeString = (name, value, symbol, depth) => (
  `${makeIndent(depth)}${symbol} ${name}: ${stringify(value, depth)}`
);

const actions = {
  notModified: (item, depth) => makeString(item.name, item.value, ' ', depth),

  modified: (item, depth) => [
    makeString(item.name, item.value, '+', depth),
    makeString(item.name, item.oldValue, '-', depth),
  ].join('\n'),

  added: (item, depth) => makeString(item.name, item.value, '+', depth),

  deleted: (item, depth) => makeString(item.name, item.value, '-', depth),

  withChildren: (item, depth, func) => [
    `${makeIndent(depth)}  ${item.name}: {`,
    `${func(item.children, depth + 1)}\n${makeIndent(depth)}  }`,
  ].join('\n'),
};

export default (ast) => {
  const iter = (items, depth) => items.map((element) => {
    const action = actions[element.type];

    return action(element, depth, iter);
  }).join('\n');

  const result = `{\n${iter(ast, 0)}\n}`;

  return result;
};
