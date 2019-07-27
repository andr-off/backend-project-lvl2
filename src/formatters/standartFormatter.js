import _ from 'lodash';

const makeIndent = (times) => {
  const indentation = ' '.repeat(2);

  return indentation.repeat(times);
};

const stringify = (item, depth) => {
  if (!_.isObject(item)) {
    return item;
  }

  return Object.entries(item)
    .map(([key, value]) => [
      `{\n${makeIndent(depth + 1)}  ${key}: ${value}`,
      `${makeIndent(depth)}}`,
    ].join('\n'));
};

const makeString = (propertyName, value, symbol, depth) => (
  `${makeIndent(depth)}${symbol} ${propertyName}: ${stringify(value, depth + 1)}`
);

const actions = {
  notModified: (item, depth) => makeString(item.propertyName, item.oldValue, ' ', depth),

  modified: (item, depth) => [
    makeString(item.propertyName, item.newValue, '+', depth),
    makeString(item.propertyName, item.oldValue, '-', depth),
  ].join('\n'),

  added: (item, depth) => makeString(item.propertyName, item.newValue, '+', depth),

  deleted: (item, depth) => makeString(item.propertyName, item.oldValue, '-', depth),

  withChildren: (item, depth, func) => [
    `${makeIndent(depth)}  ${item.propertyName}: {`,
    `${func(item.children, depth + 2)}\n${makeIndent(depth + 1)}}`,
  ].join('\n'),
};

export default (ast) => {
  const iter = (items, depth) => items.map((item) => {
    const action = actions[item.type];

    return action(item, depth, iter);
  }).join('\n');

  const result = `{\n${iter(ast, 1)}\n}`;

  return result;
};
