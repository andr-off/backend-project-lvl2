const stringify = (value) => {
  if ((value instanceof Object)) {
    return '[complex value]';
  }

  if (typeof value === 'string' && !Number(value)) {
    return `'${value}'`;
  }

  return value;
};

const makePath = (path, next) => `${path}${path ? '.' : ''}${next}`;

const makeString = (path, item) => `Property '${makePath(path, item.name)}' was`;

const actions = {
  notModified: () => '',

  modified: (item, path) => [
    `${makeString(path, item)} updated.`,
    `From ${stringify(item.oldValue)} to ${stringify(item.value)}`,
  ].join(' '),

  added: (item, path) => `${makeString(path, item)} added with value: ${stringify(item.value)}`,

  deleted: (item, path) => `${makeString(path, item)} removed`,

  withChildren: (item, path, func) => func(item.children, makePath(path, item.name)),
};

export default (ast) => {
  const iter = (items, path) => {
    const result = items.map((element) => {
      const action = actions[element.type];

      return action(element, path, iter);
    });

    return result
      .filter(str => str !== '')
      .join('\n');
  };

  return iter(ast, '');
};
