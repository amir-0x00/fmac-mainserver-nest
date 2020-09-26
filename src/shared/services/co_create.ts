import { db } from 'src/utils/database/database';
import { table_names } from './../../utils/database/database';
import { toArray } from 'src/utils/utils';

export default async function co_create<Entity>(that: any, table: table_names, body: Entity | Entity[]) {
  let res: Entity[];
  const list = toArray(body);
  if (that.normRows) await that.normRows(list);
  try {
    res = await db.co_ins<Entity>(table, list).x();
  } catch (err) {
    if (that.handleErrors) that.handleErrors(err);
    throw err;
  }
  return res;
}
