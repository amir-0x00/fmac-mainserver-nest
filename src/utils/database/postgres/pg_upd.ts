import { dateTime } from 'src/utils/utils';
import { CacheManager } from './../../../shared/cache/CacheManager';
import { pg_where } from './pg_where';
import { table_names, db, postgres_log_types, w_oprs } from '../database';
import cfg from 'src/config/config';
import { db_subEnt } from './db_subEnt';
import { pg_general } from '.';

// ---------------------------
/** $
 *  Without '
 *  with = */

/**  &-&
 *  Without '
 *  with =
 *  merege if conflict */

export type u_oprs = '+' | '-' | '$';
// export type u_oprs = '+' | '-' | '$' | '&-&';
// ---------------------------
export type Edit_params = {
  user_id: number;
};
export type T__Edit_data = {
  isEdit: boolean;
  user_id?: number;
};

const default_edit = { isEdit: false };

function edit_func({ user_id }: Edit_params) {
  let time = dateTime();
  const _cols: I_cols_list[] = this._cols;
  this._cols = _cols.filter((r) => r.args[0] !== 'old_log');
  this._Edit_data = { user_id, isEdit: true };
  this.c(
    <any>'old_log',
    '$',
    `old_log::jsonb || jsonb_build_object('id', ${Math.random()}, 'date','${time}', 'user_id',${user_id}, 'data', (SELECT (JSONB_SET(to_jsonb(${
      this.table
    }), '{date,deleted_date}', '"${time}"') - 'old_log') FROM (SELECT * FROM ${this.table} where i = 1) ${
      this.table
    })::TEXT)`,
  );

  this.c(<any>'date', '&-&', (val) => {
    // console.log('&-&', val, inx);
    return `JSONB_SET(${val}::JSONB, '{modified_date}', '"${time}"')`;
  });
  // this.c('date', '');
  // `old_log = old_log || jsonb_build_object('id', 3, 'data', (SELECT (JSONB_SET(to_jsonb(j_entries), '{date,deleted_date}', '"2020-09-19 00:30:49"') - 'old_log') FROM (SELECT * FROM j_entries where i = 1) j_entries)::TEXT`
  return this;
}

// abstract class pg_upd_edit<Entity> {
//   protected abstract table: table_names;
//   private _Edit_data: T__Edit_data = { isEdit: false };

//   abstract c(col: keyof Entity, value: any): this;
//   abstract c(col: keyof Entity, opr: u_oprs, value?: any): this;
//   abstract c(col: keyof Entity, p_opr_or_value, value?: any);

//   edit({ user_id }: Edit_params) {
//     let time = dateTime();
//     this._Edit_data = { user_id, isEdit: true };
//     this.c(
//       <any>'old_log',
//       '$',
//       `= old_log::jsonb || jsonb_build_object('id', ${Math.random()}, 'date','"${time}"', 'user_id','"${user_id}"', 'data', (SELECT (JSONB_SET(to_jsonb(${
//         this.table
//       }), '{date,deleted_date}', '"${time}"') - 'old_log') FROM (SELECT * FROM ${this.table} where i = 1) ${
//         this.table
//       })`,
//     );

//     this.c(<any>'date', '$', `=JSONB_SET(date, '{modified_date}', '"${time}"')`);
//     // `old_log = old_log || jsonb_build_object('id', 3, 'data', (SELECT (JSONB_SET(to_jsonb(j_entries), '{date,deleted_date}', '"2020-09-19 00:30:49"') - 'old_log') FROM (SELECT * FROM j_entries where i = 1) j_entries)::TEXT`
//     return this;
//   }
// }
// ---------------------------
type I_cols_list = {
  args: [any, any, any];
  str: string;
};
export class pg_upd_cols<Entity> extends pg_where<Entity> {
  protected returning = '';

  // protected cols_num = 0;
  protected _cols: I_cols_list[] = [];
  protected get cols(): string {
    let col_str = '';
    for (const col of this._cols) {
      if (col_str) col_str += ',';
      col_str += col.str;
    }
    return col_str;
  }

  // Returning
  r(...list: (keyof Entity)[]) {
    if (<any>list.includes(<any>'*')) {
      // console.log('****');
      this.returning = ` RETURNING *`;
      return this;
    }
    // console.log(list, '!!!!!');

    if (!list.length) return this;
    if (this.returning == '') {
      this.returning = ` RETURNING i,`;
    } else {
      this.returning += `,`;
    }
    this.returning += '"' + list.join('","') + '"';
    return this;
  }

  c(col: keyof Entity, value: any): this;
  c(col: keyof Entity, opr: '&-&', value: (value: string, index?: number) => void): this;
  c(col: keyof Entity, opr: u_oprs, value?: any): this;
  c(col: keyof Entity, p_opr_or_value, value?: any) {
    // TODO: add assign to json. eg. SELECT jsonb_set('{"date":"1", "created_date":"2"}', '{modified_date}', '22')
    // if (this.cols_num) this.cols += ',';
    let opr = '=',
      val = p_opr_or_value;
    if (value !== undefined) {
      val = value;
      opr = p_opr_or_value;
    }
    if (opr == '+' || opr == '-') {
      val = `"${col}" ${opr} ${val}`;
      this.r(col);
      opr = '=';
    } else if (opr == '$') {
      opr = '=';
    } else if (opr == '&-&') {
      const inx = this._cols.findIndex((r) => r.args[0] === col),
        col_val = inx >= 0 ? this._cols[inx].args[2] : `"${col}"`;
      this._cols.splice(inx, 1);
      val = value(col_val, inx);
      opr = '=';
    } else {
      if (typeof val === 'object') val = `'${JSON.stringify(val)}'`;
      else if (typeof val === 'string') val = `'${val.replace(/'/g, "''")}'`;
    }
    // this.cols += `"${col}" ${opr} ${val}`;
    this._cols.push({ args: [col, opr, val], str: `"${col}" ${opr} ${val}` });

    // this.cols += `${col} = `;
    // this.cols_num++;
    return this;
  }
}

export class pg_upd<Entity> extends pg_upd_cols<Entity> {
  private oldQueries = '';

  private _Edit_data: T__Edit_data = default_edit;
  public edit: (prm: Edit_params) => this;

  constructor(private table: table_names) {
    super();
    this.edit = edit_func.bind(this);
    this.clear();
  }
  clear() {
    this.clearWhare();
    // this.cols = '';
    // this.cols_num = 0;
    this._cols = [];
    this.returning = '';
  }

  next() {
    if (this.cols.length === 0) return this;
    this.oldQueries += this.getQuery() + ';';
    this.clear();
    return this;
  }

  set(cols: Partial<Entity>) {
    for (const col in cols) {
      const val = cols[col];
      this.c(col, val);
    }
    return this;
  }

  getQuery(): string {
    return `UPDATE ${this.table} SET ${this.cols}${this.where}${this.returning}`;
  }
  async x(): Promise<[Entity[], number]> {
    if (this._Edit_data.isEdit) this.r(<any>'*');
    const qryStr = `${this.oldQueries}${this.getQuery()}`;
    if (cfg.postgres_debug) db.pg_logQuery(postgres_log_types.update, qryStr);
    const res = await pg_general.getConnection.query(qryStr);

    return res;
  }
}

export class pg_upd_list<Entity> {
  private _Edit_data: T__Edit_data = default_edit;
  public edit: (prm: Edit_params) => this;

  protected returning = '';
  protected cols = '';
  protected cols_list = [];
  protected v_table = [];
  protected v_cols = new Set();
  private _isList = false;
  private w_str = '';
  private valStr = '';

  protected set isList(val) {
    this._isList = val;
  }
  protected get isList() {
    return this._isList;
  }

  constructor(protected table: table_names) {
    this.isList = true;
    this.edit = edit_func.bind(this);
  }

  // Returning
  // r(...list: (keyof Entity)[]) {
  //   if (!list.length) return;
  //   if (this.returning == '') {
  //     this.returning = ` RETURNING i,`;
  //   } else {
  //     this.returning += `,`;
  //   }
  //   this.returning += '"' + list.join('","') + '"';
  //   return this;
  // }

  set(list: Partial<Entity>[]) {
    if (!list.length) return;
    this.v_table = list;
    const [first] = list,
      first_cols = Object.keys(first);

    for (let i = 0; i < first_cols.length; i++) {
      const col = first_cols[i];
      this.v_cols.add(col);
    }
    return this;
  }

  w(col: keyof Entity, w_opr?: w_oprs): this {
    this.v_cols.add(col);
    const opr = w_opr || '=';
    if (this.w_str.length) this.w_str += ' AND ';
    this.w_str = `c.${col} ${opr} ${this.table}.${col}`;
    return this;
  }

  c(col: keyof Entity, operator?: '+' | '-'): this {
    if (this.cols_list.length) this.cols += ',';
    let opr = operator !== undefined ? operator : '=',
      val = 'c.' + col;
    if (operator == '+' || operator == '-') {
      val = `${this.table}.${col} ${opr} ${val}`;
      // this.r(col);
      opr = '=';
    }
    this.cols += `${col} ${opr} ${val}`;

    // this.cols += `${col} = `;
    this.cols_list.push(col);
    this.v_cols.add(col);
    return this;
  }

  next() {
    return this;
  }

  private get v_cols_arr() {
    return [...this.v_cols];
  }

  private get get_returning() {
    if (this._Edit_data.isEdit) return `RETURNING *`;
    let returningStr = `RETURNING ${this.table}.i`;
    const list = this.v_cols_arr;
    for (let i = 0; i < list.length; i++) {
      const col = list[i];
      returningStr += ',';
      returningStr += `${this.table}.${col}`;
    }
    return returningStr;
  }

  private get v_table_str() {
    const v_cols: any = this.v_cols_arr,
      v_table = this.v_table;
    let list_str = '';
    for (let i = 0; i < v_table.length; i++) {
      const rw = v_table[i];
      if (i) list_str += ',';
      list_str += '(';
      for (let j = 0; j < v_cols.length; j++) {
        const col = v_cols[j],
          val = this.normRw(rw[col]);
        if (j) list_str += ',';
        list_str += val;
      }
      list_str += ')';
    }
    return list_str;
  }
  private normRw(val) {
    if (val instanceof db_subEnt) return val.x();
    else if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
    else if (typeof val === 'object' && val !== null) return `'${JSON.stringify(val)}'`;
    else return val;
  }

  async x(): Promise<[Entity[], number]> {
    const qryStr = `update ${this.table} as ${this.table} set ${this.cols} from (values ${this.v_table_str}) as c(${
      '"' + this.v_cols_arr.join('","') + '"'
    }) where ${this.w_str} ${this.get_returning}`;
    if (cfg.postgres_debug) db.pg_logQuery(postgres_log_types.update, qryStr);
    const res = await pg_general.getConnection.query(qryStr);
    // console.log('res', res);
    CacheManager.set(this.table, res[0]);
    return res;
  }
  // TODO: SELECT JSONB_SET(to_jsonb(j_entries), '{date,deleted_date}', '"2020-09-19 00:30:49"') FROM (SELECT * FROM j_entries where i = 1) j_entries;
}
// ---------------------------
