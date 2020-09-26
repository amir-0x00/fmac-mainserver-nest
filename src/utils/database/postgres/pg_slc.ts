import { table_names, db, postgres_log_types, orderByTypes } from '../database';
import cfg from 'src/config/config';
import { getConnection } from 'typeorm';
import { pg_where } from './pg_where';
import { pg_general } from '.';

// ---------------------------
export class pg_slc<Entity> extends pg_where<Entity> {
  private cols = '*';
  private limit: number = null;
  private orderBy = '';
  private orderNumber = 0;
  constructor(private table: table_names) {
    super();
  }

  c(...list: (keyof Entity)[]) {
    list.push(<keyof Entity>'i');
    if (list.length) this.cols = '"' + list.join('","') + '"';
    return this;
  }
  /** Limit */
  l(num: number) {
    this.limit = num;
    return this;
  }

  /** OrderBy */
  o(col: keyof Entity, type: orderByTypes): this;
  // o(col: keyof Entity, opr: w_oprs, value?: any): this;
  o(col: keyof Entity, type: orderByTypes) {
    if (!this.orderNumber) this.orderBy += ' ORDER BY ';
    if (this.orderNumber > 0) this.orderBy += ',';
    this.orderBy += `${col} ${type}`;
    this.orderNumber++;
    // this.limit = num;
    return this;
  }

  private get getLimit() {
    return this.limit === null ? '' : ` LIMIT ${this.limit}`;
  }

  /** Get One */
  async one(): Promise<Entity> {
    const this_x = await this.l(1).x();
    if (this_x.length) return this_x[0];
    return {} as Entity;
  }

  async x(): Promise<Entity[]> {
    const qryStr = `SELECT ${this.cols} FROM ${this.table}${this.where}${this.orderBy}${this.getLimit}`;
    // console.log('qryStr', qryStr);
    if (cfg.postgres_debug) db.pg_logQuery(postgres_log_types.select, qryStr);
    const res = await pg_general.getConnection.query(
      qryStr,
      // `UPDATE products SET gi = gi+1 WHERE dl = 0 returning gi, i`,
    );
    // console.log('qry', qryStr);

    return res;
  }
}
// ---------------------------
