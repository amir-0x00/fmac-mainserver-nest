import * as elasticsearch from 'elasticsearch';
import { es_connection } from './es_common';

// ---------------------------
export const es_que = async (prms: (c: elasticsearch.Client) => any) => {
  let cl = prms(es_connection.es_client);
  let res = await (<any>cl);
  return res;
};
// ---------------------------
