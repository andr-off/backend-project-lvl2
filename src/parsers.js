import yaml from 'js-yaml';
import ini from 'ini';

const parsers = [
  {
    ext: '.json',
    parser: data => JSON.parse(data),
  },
  {
    ext: '.yml',
    parser: data => yaml.safeLoad(data),
  },
  {
    ext: '.ini',
    parser: data => ini.parse(data),
  },
];

export default (content, extName) => parsers
  .find(({ ext }) => ext === extName).parser(content);
