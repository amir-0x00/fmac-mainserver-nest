import { ConfigOptions } from 'elasticsearch';

const es_connection: ConfigOptions = {
  host: '127.0.0.1:9200',
};
const cfg = {
  postgres_debug: false,
  // postgres_debug: true,
  es_debug: false,
  // es_debug: true,

  es_connection,
};

export default cfg;
