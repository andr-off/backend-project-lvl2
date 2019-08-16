import _ from 'lodash';

const makeIndent = (times, numerOfSpaces = 2) => {
  const indentation = ' '.repeat(numerOfSpaces);

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
  ],

  added: (item, depth) => makeString(item.propertyName, item.newValue, '+', depth),

  deleted: (item, depth) => makeString(item.propertyName, item.oldValue, '-', depth),

  withChildren: (item, depth, func) => [
    `${makeIndent(depth)}  ${item.propertyName}: ${func(item.children, depth + 1)}`,
  ],
};

const prettyFormat = (ast, depth = 0) => {
  const result = ast.map((item) => {
    const action = actions[item.type];

    return action(item, depth + 1, prettyFormat);
  });

  return `{\n${_.flattenDeep(result).join('\n')}\n${makeIndent(depth)}}`;
};

export default prettyFormat;
