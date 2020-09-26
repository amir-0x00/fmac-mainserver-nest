import { table_names, db, postgres_log_types } from '../database';
import cfg from 'src/config/config';
import { db_subEnt } from './db_subEnt';
import { pg_general } from '.';

// ---------------------------
export class pg_ins<Entity> {
  private cols = '';
  private cols_arr = [];
  private vals = [];
  private valStr = '';
  private isReturnAll = false;
  private returningList = new Set('i');
  // private returning = ' RETURNING i';
  constructor(private table: table_names, private list: Entity[] | Entity = []) {}

  normCols() {
    if (Array.isArray(this.list) && this.list.length > 1) {
      // this.cols_arr = []
      for (let rw of this.list) {
        let cols = Object.keys(rw);
        if (cols.length > this.cols_arr.length) this.cols_arr = cols;
      }
    } else {
      const first_rw = Array.isArray(this.list) ? this.list[0] : this.list;
      // console.log('first_rw', this.list);
      this.cols_arr = Object.keys(first_rw);
    }
    this.cols = '"' + this.cols_arr.join('","') + '"';
  }
  normVals() {
    if (Array.isArray(this.list)) {
      for (const rw of this.list) {
        const normRw = this.normRw(rw);
        let rwStr = '';
        for (const col of this.cols_arr) {
          if (rwStr.length) rwStr += ',';
          const rwVal = normRw[col];
          // rwStr += rwVal !== undefined ? rwVal : 'null';
          rwStr += rwVal !== undefined ? rwVal : '';
        }
        this.addRw(rwStr);
      }
      // for (let i = 0; i < this.list.length; i++) {
      //   const rw = this.list[i];
      //   let rwStr = Object.values(this.normRw(rw)).join(',');
      //   this.addRw(rwStr);
      // }
    } else {
      let rwStr = Object.values(this.normRw(this.list)).join(',');
      this.addRw(rwStr);
    }
  }

  add(rw: Entity) {
    if (!Array.isArray(this.list)) this.list = [];
    this.list.push(rw);
    return this;
  }

  addRw(rw) {
    if (this.valStr.length) this.valStr += ',';
    this.valStr += `(${rw})`;
  }

  normRw(rw) {
    // console.log('rw', rw);
    let c_rw = JSON.parse(JSON.stringify(rw));
    for (const k in c_rw) {
      let val = rw[k];
      if (val instanceof db_subEnt) {
        c_rw[k] = rw[k].x();
        this.r(<keyof Entity>k);
      } else if (typeof val === 'string') c_rw[k] = `'${val.replace(/'/g, "''")}'`;
      else if (typeof val === 'object' && val !== null) c_rw[k] = `'${JSON.stringify(val)}'`;
    }
    return c_rw;
  }

  // Returning
  r(...list: (keyof Entity)[]) {
    if (!list.length) return;
    for (let i = 0; i < list.length; i++) {
      const rw = list[i];
      this.returningList.add(<string>rw);
    }
    // if (this.returning.length) this.returning += `,`;
    // this.returning += '"' + list.join('","') + '"';
    return this;
  }
  get returning(): string {
    let str = ' RETURNING ';
    if (this.isReturnAll) {
      str += '*';
    } else {
      str += '"' + [...this.returningList].join('","') + '"';
    }
    return str;
  }

  returnAll() {
    this.isReturnAll = true;
    return this;
  }

  async x(): Promise<Entity[]> {
    this.normCols();
    this.normVals();
    const qryStr = `INSERT INTO ${this.table} (${this.cols}) VALUES ${this.valStr}${this.returning}`;
    if (cfg.postgres_debug) db.pg_logQuery(postgres_log_types.insert, qryStr);
    // console.time('pg_ins');
    const res = await pg_general.getConnection.query(qryStr);
    // console.timeEnd('pg_ins');
    return res;
  }
}
// ---------------------------
