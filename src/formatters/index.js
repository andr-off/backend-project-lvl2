import standartFormat from './standartFormatter';
import plainFormat from './plainFormatter';
import jsonFormat from './jsonFormatter';

const formatters = {
  standart: ast => standartFormat(ast),
  plain: ast => plainFormat(ast),
  json: ast => jsonFormat(ast),
};

export default (ast, format = 'standart') => formatters[format](ast);
