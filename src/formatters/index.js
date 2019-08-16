import prettyFormat from './prettyFormatter';
import plainFormat from './plainFormatter';
import jsonFormat from './jsonFormatter';

const formatters = {
  pretty: prettyFormat,
  plain: plainFormat,
  json: jsonFormat,
};

export default (ast, format = 'pretty') => formatters[format](ast);
