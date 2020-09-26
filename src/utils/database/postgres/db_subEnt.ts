import { pg_where } from './pg_where';
import { table_names } from '../database';

// ---------------------------
export class db_subEnt<Entity> extends pg_where<Entity> {
  private cols = 'i,';
  // private vals = [];
  private valStr = '';
  constructor(private table: table_names) {
    super();
  }

  c(...list: (keyof Entity)[]) {
    if (list.length) this.cols += '"' + list.join('","') + '"';
    return this;
  }

  x(): string {
    // row_to_json
    const qryStr = `(SELECT to_jsonb(${this.table}) FROM (SELECT ${this.cols} FROM ${this.table}${this.where}) ${this.table})`;
    // (SELECT to_jsonb(tree) - 'name' - 'disabled' - 'parent_list'- 'credit' FROM (SELECT * FROM tree where i = 1) tree)
    // (SELECT to_jsonb(tree) - 'name'::text - 'disabled'::text - 'parent_list'::text FROM (SELECT * FROM tree where i = 1) tree)
    return qryStr;
  }
} // ---------------------------
