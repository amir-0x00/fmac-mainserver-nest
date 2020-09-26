import * as elasticsearch from 'elasticsearch';
import { table_names, db } from '../database';
import { es_where } from './es_where';
import { defaultType, es_connection } from './es_common';
import * as colors from 'colors-cli/safe';

import cfg from 'src/config/config';
import { es_bulk } from './es_bulk';

// ---------------------------
export class es_upd_cols<Entity> extends es_where<Entity> {
  protected cols: Partial<Entity> = {};
  protected cols_num = 0;

  c(col: keyof Entity, value: any): this {
    this.cols[col] = value;
    this.cols_num++;
    return this;
  }
}
// ---------------------------
export class es_upd_list<Entity> extends es_bulk<Entity> {
  constructor(protected table: table_names) {
    super(table, 'update');
  }
}

// ---------------------------

export class es_upd<Entity> extends es_upd_cols<Entity> {
  es_type = 'es_upd';
  esBody: elasticsearch.UpdateDocumentByQueryParams &
    Partial<elasticsearch.UpdateDocumentParams> = {
    index: this.table,
    type: defaultType,
    refresh: true,
  };
  constructor(private table: table_names) {
    super();
    this.clear();
  }
  clear() {
    this.clearWhare();
    // this.cols = '';
    this.cols_num = 0;
  }

  next() {
    // if (this.cols.length === 0) return this;
    // this.oldQueries += this.getQuery() + ';';
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

  beforeExecute() {
    if (this.whr_id) {
      this.qry.rawOption('doc', this.cols);
      this.esBody.id = this.whr_id;
    } else {
      let val = '';
      for (let col in this.cols) {
        val += `ctx._source['${col}'] = params.${col};`;
      }
      this.qry.rawOption('script', { source: val, params: this.cols });
    }
    this.esBody.body = this.qry.build();
  }

  async x(): Promise<any> {
    this.beforeExecute();

    // console.log('this', this);
    let quName = 'update';
    if (!this.whr_id) {
      quName = 'updateByQuery';
      this.esBody.conflicts = 'proceed';
    } else {
      this.esBody.retryOnConflict = 10000;
    }

    if (cfg.es_debug) {
      console.log(colors.green(quName));
      console.log('-----------------------------');
      console.dir(this.esBody, { depth: null });
      console.log('-----------------------------');
    }

    let response = await es_connection.es_client[quName](this.esBody).catch(
      err => {
        db.es_error(err, quName, this.esBody);
        throw err;
      },
    );
    // console.log('response', response);
    return response;
  }
}
