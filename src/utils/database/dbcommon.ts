// import * as ormconfig from '../../../xormconfig.js';
import * as ormconfig from '../../config/orm.config';
import { ConnectionManager } from 'typeorm';
import { w_oprs, table_names, db, w_oprs_arr } from './database';
import { es_upd, es_del, es_ins, es_where, es_upd_list } from './elasticsearch';
import {
  pg_ins,
  pg_del,
  pg_where,
  pg_upd,
  pg_upd_list,
  // pg_general,
} from './postgres';
import { Edit_params, T__Edit_data, u_oprs } from './postgres/pg_upd';
import { toArray } from '../utils';
// ---------------------------
export class db_co_where<Entity, PGType = pg_where<Entity>, ESType = es_where<Entity>> {
  protected es: ESType;
  protected pg: PGType;

  w(nest: (w: db_co_where<Entity, PGType, ESType>) => db_co_where<Entity, PGType, ESType>): this;
  w(id: number): this;
  w(col: keyof Entity, value: any): this;
  w(col: keyof Entity, opr: w_oprs, value?: any): this;
  w(...list: any[]) {
    (<any>this.es).w(...list);
    (<any>this.pg).w(...list);
    return this;
  }

  wOr(nest: (w: db_co_where<Entity, PGType, ESType>) => db_co_where<Entity, PGType, ESType>): this;
  wOr(id: number): this;
  wOr(col: keyof Entity, value: any): this;
  wOr(col: keyof Entity, opr: w_oprs, value?: any): this;
  wOr(...list: any[]) {
    (<any>this.es).wOr(...list);
    (<any>this.pg).wOr(...list);
    return this;
  }

  wAnd(nest: (w: db_co_where<Entity, PGType, ESType>) => db_co_where<Entity, PGType, ESType>): this;
  wAnd(id: number): this;
  wAnd(col: keyof Entity, value: any): this;
  wAnd(col: keyof Entity, opr: w_oprs, value?: any): this;
  wAnd(...list: any[]) {
    (<any>this.es).wAnd(...list);
    (<any>this.pg).wAnd(...list);
    return this;
  }
}

// ---------------------------

// export class db_co_slc<Entity> extends db_co_where<Entity> {
//   private cols = '*';
//   private limit: number = null;
//   private orderBy = '';
//   private orderNumber = 0;
//   constructor(private table: table_names) {
//     super();
//   }

//   c(...list: (keyof Entity)[]) {
//     list.push(<keyof Entity>'i');
//     if (list.length) this.cols = '"' + list.join('","') + '"';
//     return this;
//   }
//   /** Limit */
//   l(num: number) {
//     this.limit = num;
//     return this;
//   }

//   /** OrderBy */
//   o(col: keyof Entity, type: orderByTypes): this;
//   // o(col: keyof Entity, opr: w_oprs, value?: any): this;
//   o(col: keyof Entity, type: orderByTypes) {
//     if (!this.orderNumber) this.orderBy += ' ORDER BY ';
//     if (this.orderNumber > 0) this.orderBy += ',';
//     this.orderBy += `${col} ${type}`;
//     this.orderNumber++;
//     // this.limit = num;
//     return this;
//   }

//   private get getLimit() {
//     return this.limit === null ? '' : ` LIMIT ${this.limit}`;
//   }

//   /** Get One */
//   async one(): Promise<Entity> {
//     const this_x = await this.l(1).x();
//     if (this_x.length) return this_x[0];
//     return {} as Entity;
//   }

//   async x(): Promise<Entity[]> {
//     const qryStr = `SELECT ${this.cols} FROM ${this.table}${this.orderBy}${this.getLimit}`;
//     // console.log('qryStr', qryStr);
//     // if (cfg.postgres_debug) db.co_logQuery(postgres_log_types.select, qryStr);
//     const res = await pg_general.getConnection.query(
//       qryStr,
//       // `UPDATE products SET gi = gi+1 WHERE dl = 0 returning gi, i`,
//     );
//     // console.log('qry', qryStr);

//     return res;
//   }
// }

// ---------------------------

// export class db_co_upd_cols<Entity> extends db_co_where<Entity, pg_upd<Entity>, es_upd<Entity>> {
//   protected opr_cols: Partial<keyof Entity>[] = [];

//   // Returning
//   r(...list: (keyof Entity)[]) {
//     this.pg.r(...list);
//     return this;
//   }

//   c(col: keyof Entity, value: any): this;
//   c(col: keyof Entity, opr: '&-&', value: (string) => void): this;
//   c(col: keyof Entity, opr: u_oprs, value?: any): this;
//   c(col: keyof Entity, p_opr_or_value, value?: any) {
//     this.pg.c(col, p_opr_or_value, value);
//     let opr = '=',
//       val = p_opr_or_value;
//     if (value !== undefined) {
//       val = value;
//       opr = p_opr_or_value;
//     }
//     if (opr == '+' || opr == '-' || opr == '$') {
//       this.opr_cols.push(col);
//     } else {
//       this.es.c(col, val);
//     }
//     return this;
//   }
// }

export class db_co_upd<Entity> extends db_co_where<
  Entity,
  pg_upd<Entity> | pg_upd_list<Entity>,
  es_upd<Entity> | es_upd_list<Entity>
> {
  private _Edit_data: T__Edit_data = { isEdit: false };

  // is col has operator. eg +, -
  private isOperations = false;
  private cols_list = [];
  private cols_rw = [];
  private whrs_list = [];
  private whrs_rw = [];
  constructor(private table: table_names) {
    super();
    // this.pg = db.pg_upd<Entity>(this.table);
    // this.es = db.es_upd<Entity>(this.table);
  }

  w(
    nest: (
      w: db_co_where<Entity, pg_upd<Entity> | pg_upd_list<Entity>, es_upd<Entity> | es_upd_list<Entity>>,
    ) => db_co_where<Entity, pg_upd<Entity> | pg_upd_list<Entity>, es_upd<Entity> | es_upd_list<Entity>>,
  ): this;
  w(id: number): this;
  w(col: keyof Entity, value: any): this;
  w(col: keyof Entity, opr: w_oprs, value?: any): this;
  w(...list: any[]) {
    this.whrs_rw.push([...list]);
    // console.log('sss', list);
    // (<any>this.es).w(...list);
    // (<any>this.pg).w(...list);
    return this;
  }

  // c<T extends string>( p_opr_or_value: Exclude<T, u_oprs> | number ) {
  c(col: keyof Entity, value: any): this;
  c(col: keyof Entity, opr: '&-&', value: (string) => string): this;
  c(col: keyof Entity, opr: u_oprs, value?: any): this;
  c(col: keyof Entity, p_opr_or_value, value?: any) {
    if (p_opr_or_value === '+' || p_opr_or_value === '-') this.isOperations = true;
    this.cols_rw.push([col, p_opr_or_value, value]);
    // this.pg.c(col, <any>p_opr_or_value, value);
    // let val = value !== undefined ? value : p_opr_or_value;
    // this.es.c(col, val);
    return this;
  }

  next() {
    if (this.cols_rw.length === 0 || this.whrs_rw.length === 0) return this;
    this.cols_list.push(this.cols_rw);
    this.cols_rw = [];
    this.whrs_list.push(this.whrs_rw);
    this.whrs_rw = [];

    // this.pg.next();
    // this.es.next();
    return this;
  }

  set(cols: Partial<Entity>) {
    const list: Partial<Entity>[] = toArray(cols);
    // if(Array.isArray(cols))return this.setList(cols);
    for (const rw of list) {
      for (const col in rw) {
        const val = rw[col];
        this.c(col, <any>val);
      }
    }
    return this;
  }

  // private setList(cols: Partial<Entity[]>) {
  //   for
  //   return this;
  // }

  edit(params: Edit_params) {
    this._Edit_data = { ...params, isEdit: true };
    return this;
  }

  async x(): Promise<any> {
    // async x(): Promise<[Entity[], number]> {
    if (this.isOperations) {
      this.pg = db.pg_upd_list<Entity>(this.table);
      this.es = db.es_upd_list<Entity>(this.table);
      this.next();
      const set_list = [];
      for (let i = 0; i < this.cols_list.length; i++) {
        this.pg.next();
        const cols = this.cols_list[i],
          whrs = this.whrs_list[i],
          set_rw = {};
        for (let j = 0; j < cols.length; j++) {
          const [col, opr, value]: [any, any, any] = cols[j];
          let val = opr;
          if (value !== undefined && (opr == '+' || opr == '-')) {
            val = value;
            if (i === 0) {
              this.pg.c(col, opr);
            }
          } else if (i === 0) {
            this.pg.c(col);
          }
          set_rw[col] = val;
        }
        for (let j = 0; j < whrs.length; j++) {
          const whr: [any, any?, any?] = whrs[j];
          if (whr.length === 1) {
            set_rw['i'] = whr[0];
            this.pg.w(<any>'i');
          } else if (whr.length === 3 && w_oprs_arr.includes(whr[1])) {
            set_rw[whr[0]] = whr[2];
            this.pg.w(whr[0], whr[1]);
          } else {
            set_rw[whr[0]] = whr[1];
            this.pg.w(whr[0]);
          }
        }
        set_list.push(set_rw);
        if (this._Edit_data.isEdit) this.pg.edit(<any>this._Edit_data);
      }
      this.pg.set(<any>set_list);
    } else {
      this.pg = db.pg_upd<Entity>(this.table);
      this.es = db.es_upd<Entity>(this.table);
      this.next();
      for (let i = 0; i < this.cols_list.length; i++) {
        this.pg.next();
        this.es.next();
        const cols = this.cols_list[i],
          whrs = this.whrs_list[i];
        for (let j = 0; j < cols.length; j++) {
          const col: [any, any] = cols[j];
          this.pg.c(...col);
          this.es.c(...col);
        }
        for (let j = 0; j < whrs.length; j++) {
          const whr: [any, any, any] = whrs[j];
          this.pg.w(...whr);
          this.es.w(...whr);
        }
        if (this._Edit_data.isEdit) this.pg.edit(<any>this._Edit_data);
      }
    }
    // console.log('cols_list', this.cols_list);
    // console.log('whr_list', this.whrs_list);
    let res;
    if (this.isOperations || this._Edit_data.isEdit) {
      const pgres = await this.pg.x();
      res = pgres;
      const pgres_rws = pgres[0];
      // if(pgres_rws)
      for (let i = 0; i < pgres_rws.length; i++) {
        const rw: any = pgres_rws[i];
        this.es.next().set(rw).w(rw.i);
      }
      await this.es.x();
      // console.log('pgres_rws', pgres_rws);
      // const pgres = await this.pg.x();
    } else {
      // const [pgres] = await Promise.all([this.pg.x(), this.es.x()]);
      const pgres = await this.pg.x();
      await this.es.x();
      res = pgres;
    }
    // const [res] = await Promise.all([this.pg.x(), this.es.x()]);
    return res;
  }
}

// export class db_co_upd_list<Entity> {
//   private tableList: {
//     c: [keyof Entity, u_oprs | '=', any];
//     w: keyof Entity;
//   }[] = [];
//   private currentCols: [keyof Entity, u_oprs | '=', any][] = [];
//   private currentWhr: Partial<Entity> = {};
//   private row_count = 0;

//   private pg: db_pg_upd_list<Entity>;
//   private es: es_upd_list<Entity>;

//   constructor(private table: table_names) {
//     this.pg = db.pg_upd_list<Entity>(this.table);
//     this.es = db.es_upd_list<Entity>(this.table);
//   }

//   // Returning
//   r(...list: (keyof Entity)[]) {
//     this.pg.r(...list);
//     return this;
//   }

//   set(list: Partial<Entity> | Partial<Entity>[]) {
//     if (Array.isArray(list)) {
//       for (let i = 0; i < list.length; i++) {
//         const rw = list[i];
//         this.normListRw(rw);
//       }
//     } else {
//       this.normListRw(list);
//     }
//     return this;
//   }

//   normListRw(rw: Partial<Entity>) {
//     for (const k in rw) {
//       const val = rw[k];
//       this.currentCols.push([k, '=', val]);
//     }
//     this.row_count++;
//   }

//   w(col: keyof Entity): this {
//     this.v_cols.add(col);
//     if (this.w_str.length) this.w_str += ' AND ';
//     this.w_str = `c.${col} = ${this.table}.${col}`;
//     return this;
//   }

//   c(col: keyof Entity, operator?: '+' | '-'): this {
//     if (this.cols_list.length) this.cols += ',';
//     let opr = operator !== undefined ? operator : '=',
//       val = 'c.' + col;
//     if (operator == '+' || operator == '-') {
//       val = `${this.table}.${col} ${opr} ${val}`;
//       this.r(col);
//       opr = '=';
//     }
//     this.cols += `${col} ${opr} ${val}`;

//     // this.cols += `${col} = `;
//     this.cols_list.push(col);
//     this.v_cols.add(col);
//     return this;
//   }

//   next() {
//     return this;
//   }

//   private get v_cols_arr() {
//     return [...this.v_cols];
//   }

//   private get get_returning() {
//     let returningStr = 'RETURNING ';
//     const list = this.v_cols_arr;
//     for (let i = 0; i < list.length; i++) {
//       const col = list[i];
//       if (i) returningStr += ',';
//       returningStr += `${this.table}.${col}`;
//     }
//     return returningStr;
//   }

//   private get v_table_str() {
//     const v_cols: any = this.v_cols_arr,
//       v_table = this.v_table;
//     let list_str = '';
//     for (let i = 0; i < v_table.length; i++) {
//       const rw = v_table[i];
//       if (i) list_str += ',';
//       list_str += '(';
//       for (let j = 0; j < v_cols.length; j++) {
//         const col = v_cols[j];
//         if (j) list_str += ',';
//         list_str += rw[col];
//       }
//       list_str += ')';
//     }
//     return list_str;
//   }
//   async x(): Promise<[Entity[], number]> {
//     const qryStr = `update ${this.table} as ${this.table} set ${
//       this.cols
//     } from (values ${this.v_table_str}) as c(${this.v_cols_arr.join(
//       ',',
//     )}) where ${this.w_str} ${this.get_returning}`;
//     // if (cfg.postgres_debug) db.co_logQuery(postgres_log_types.update, qryStr);
//     const res = await getConnection().query(qryStr);
//     return res;
//   }
// }
// ---------------------------

export class db_subEnt<Entity> extends db_co_where<Entity> {
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
    const qryStr = `(SELECT row_to_json(${this.table}) FROM (SELECT ${this.cols} FROM ${this.table}) ${this.table})`;
    // if (cfg.postgres_debug) db.my_logQuery(postgres_log_types.insert, qryStr);
    // const res = await getConnection().query(qryStr);
    // return res;
    // console.log('qryStr', qryStr);
    return qryStr;
  }
}

// ---------------------------

export class db_co_ins<Entity> {
  private es: es_ins<Entity>;
  private pg: pg_ins<Entity>;

  constructor(private table: table_names, private list: Entity[] | Entity) {
    this.pg = db.pg_ins<Entity>(this.table, this.list);
    this.es = db.es_ins<Entity>(this.table, this.list);
  }

  // set(list: Entity) {
  //   this.es.set(list);
  //   return this;
  // }
  // Returning
  // r(...list: (keyof Entity)[]) {
  //   this.pg.r(...list);
  //   return this;
  // }

  async mix_with_results(res: Entity | Entity[]) {
    const list = Array.isArray(this.list) ? this.list : [this.list];
    for (let i = 0; i < list.length; i++) {
      const rw = list[i];
      Object.assign(rw, res[i]);
    }
  }

  async x(): Promise<Entity[]> {
    const res = await this.pg.returnAll().x();
    this.mix_with_results(res);
    await this.es.set(<any>this.list).x();
    return res;
  }
}

// ---------------------------
export class db_co_del<Entity> extends db_co_where<Entity, pg_del<Entity>, es_del<Entity>> {
  constructor(private table: table_names) {
    super();
    this.pg = db.pg_del<Entity>(this.table);
    this.es = db.es_del<Entity>(this.table);
  }

  /** Limit */
  l(num: number) {
    this.pg.l(num);
    // this.es.l(num);
    return this;
  }

  /** Get One */
  async one(): Promise<Entity> {
    const this_x = await this.l(1).x();
    if (this_x.length) return this_x[0];
    return {} as Entity;
  }

  async x(): Promise<any> {
    // const [res] = await Promise.all([this.pg.x(), this.es.x()]);
    const res = await this.pg.x();
    await this.es.x();
    return res;
  }
}
// ---------------------------
export class db_co_general {
  // ---------------------------
  static async connect() {
    const connectionManager = new ConnectionManager();
    const connection = connectionManager.create(<any>ormconfig);
    await connection.connect(); // performs connection
  }
}
// ---------------------------
