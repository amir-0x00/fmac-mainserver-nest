import { es_connection } from './es_common';
// ---------------------------
export const es_drop_index = async index => {
  await es_connection.es_client.indices.delete({ index });
};
// ---------------------------
