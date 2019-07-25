import standartFormat from './standartFormatter';
import plainFormat from './plainFormatter';


const formatters = {
  standart: ast => standartFormat(ast),
  plain: ast => plainFormat(ast),
};

export default (ast, format = 'standart') => formatters[format](ast);
