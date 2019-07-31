import _ from 'lodash';

const stringify = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  if (_.isString(value)) {
    return `'${value}'`;
  }

  return value;
};

const makePath = (path, next) => `${path}${path ? '.' : ''}${next}`;

const makeString = (path, item) => `Property '${makePath(path, item.propertyName)}' was`;

const actions = {
  notModified: () => [],

  modified: (item, path) => [
    `${makeString(path, item)} updated.`,
    `From ${stringify(item.oldValue)} to ${stringify(item.newValue)}`,
  ].join(' '),

  added: (item, path) => `${makeString(path, item)} added with value: ${stringify(item.newValue)}`,

  deleted: (item, path) => `${makeString(path, item)} removed`,

  withChildren: (item, path) => item.children.map((element) => {
    const action = actions[element.type];

    return action(element, makePath(path, item.propertyName));
  }),
};

export default (ast) => {
  const result = ast.map((item) => {
    const action = actions[item.type];

    return action(item, '');
  });

  return _.flattenDeep(result).join('\n');
};
