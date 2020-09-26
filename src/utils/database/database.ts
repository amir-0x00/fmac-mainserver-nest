import * as colors from 'colors-cli/safe';
import cfg from '../../config/config';
import { getConnection } from 'typeorm';
import * as elasticsearch from 'elasticsearch';
import { pg_slc, db_subEnt, pg_upd_list, pg_upd, pg_ins, pg_general, pg_del } from './postgres';
import { es_slc, es_upd, es_ins, es_general, es_upd_list, es_del, es_create, es_que, es_count } from './elasticsearch';
import { db_co_upd, db_co_ins } from './dbcommon';

// ---------------------------
export type table_names =
  | 'products'
  | 'patients'
  | 'colors'
  | 'config'
  | 'treasury'
  | 'tree'
  | 'j_entries'
  | 'j_entries_items'
  | 'users'
  | 'users_group'
  | 'imp_vouchers'
  | 'exp_vouchers';
export type table_names_all = table_names | '_all';
// ---------------------------
export const w_oprs_arr = ['>=', '<=', '!=', '<', '>'] as const;
// export type w_oprs = '>=' | '<=' | '!=' | '<' | '>';
type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType> ? ElementType : never;

export type w_oprs = ElementType<typeof w_oprs_arr>;

export type orderByTypes = 'ASC' | 'DESC';
// ---------------------------
export enum postgres_log_types {
  delete,
  insert,
  select,
  update,
  execute,
}

// ---------------------------
class dbClass {
  pg_connected = false;
  es_connected = false;
  async connect() {
    await this.pg_connect();
    await this.es_connect();
  }
  async pg_connect() {
    await pg_general.connect();
    this.pg_connected = true;
  }
  async es_connect(name?: string) {
    await es_general.connect();
    this.es_connected = true;
  }
  // ---------------------------
  pg_logQuery(name: postgres_log_types, query) {
    if (!cfg.postgres_debug) return;
    let color;
    switch (name) {
      case postgres_log_types.delete:
        color = 'red';
        break;
      case postgres_log_types.insert:
        color = 'green';
        break;
      case postgres_log_types.select:
        color = 'yellow';
        break;
      case postgres_log_types.update:
        color = 'cyan';
        break;
      case postgres_log_types.execute:
        color = 'blue';
        break;
    }
    // query = query.replace(/;$/, colors.red(';'));

    console.log(
      colors.blue_bt.bold.underline('POSTGRES'),
      colors.bold[color](postgres_log_types[name]),
      colors.bold.green(':'),
      query + colors.red(';'),
    );
  }
  // ---------------------------
  async es_error(err, name, quBody?) {
    // if (isDev)
    //   notifier.notify({ title: 'es_error', message: err.message, sound: true });
    console.log(colors.yellow('-----------------------'));
    console.log(`${colors.red.underline('ES')} error ${colors.yellow.underline(name)} : `);
    console.log(colors.yellow('-----------------------'));
    console.dir(quBody, { depth: null });
    console.log(colors.red('-----------------------'));
    if (typeof err === 'object') {
      console.dir(err, { depth: null });
    } else {
      console.log(colors.yellow.bold(err));
    }
    console.log(colors.red('-----------------------'));
  }
  // ---------------------------

  // ---------------------------
  subEnt<T>(table: table_names) {
    return new db_subEnt<T>(table);
  }
  pg_upd_list<T>(table: table_names) {
    return new pg_upd_list<T>(table);
  }

  async pg_que(qryStr) {
    if (cfg.postgres_debug) db.pg_logQuery(postgres_log_types.execute, qryStr);
    const res = await pg_general.getConnection.query(qryStr);
    return res;
  }

  pg_slc<T>(table: table_names) {
    return new pg_slc<T>(table);
  }

  pg_upd<T>(table: table_names) {
    return new pg_upd<T>(table);
  }

  pg_ins<T>(table: table_names, list: T[] | T) {
    return new pg_ins<T>(table, list);
  }

  pg_del_flag<T>(table: table_names) {
    return new pg_upd<T & { dl: string }>(table).c('dl', 1);
  }

  pg_del<T>(table: table_names) {
    return new pg_del<T>(table);
  }

  // ---------------------------
  es_upd_list<T>(table: table_names) {
    return new es_upd_list<T>(table);
  }

  es_slc<T>(table: table_names) {
    return new es_slc<T>(table);
  }

  es_count<T>(table: table_names) {
    return new es_count<T>(table);
  }

  es_upd<T>(table: table_names) {
    return new es_upd<T>(table);
  }

  es_ins<T>(table: table_names, list: T[] | T) {
    return new es_ins<T>(table, <T>list);
  }

  es_del_flag<T>(table: table_names) {
    return new es_upd<T & { dl: string }>(table).c('dl', 1);
  }

  es_del<T>(table: table_names) {
    return new es_del<T>(table);
  }

  // ---------------------------
  es_create(table: table_names, map) {
    return es_create(table, map);
  }
  // ---------------------------
  async es_que(prms: (c: elasticsearch.Client) => any) {
    return await es_que(prms);
  }
  // ---------------------------
  // co_upd_list<T>(table: table_names) {
  //   return new db_co_upd_list<T>(table);
  // }

  // co_slc<T>(table: table_names) {
  //   return new db_co_slc<T>(table);
  // }

  co_upd<T>(table: table_names) {
    return new db_co_upd<T>(table);
  }

  co_ins<T>(table: table_names, list?: T[] | T) {
    return new db_co_ins<T>(table, <T>list);
  }

  co_del_flag<T>(table: table_names) {
    return new db_co_upd<T & { dl: string }>(table).c('dl', 1);
  }

  // co_del<T>(table: table_names) {
  //   return new db_co_del<T>(table);
  // }
}

export const db = new dbClass();
