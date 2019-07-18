import yaml from 'js-yaml';

const parsers = [
  {
    ext: '.json',
    parser: data => JSON.parse(data),
  },
  {
    ext: '.yml',
    parser: data => yaml.safeLoad(data),
  },
];

export default (content, extName) => parsers
  .find(({ ext }) => ext === extName).parser(content);
