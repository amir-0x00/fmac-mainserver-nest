import * as elasticsearch from 'elasticsearch';
// ---------------------------
export const defaultType = '_doc';

type es_connection_type = {
  es_client: elasticsearch.Client;
};

export const es_connection: es_connection_type = {
  es_client: null,
};
export const es_client = es_connection.es_client;
// ---------------------------
