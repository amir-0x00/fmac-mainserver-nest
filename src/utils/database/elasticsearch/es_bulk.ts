import * as elasticsearch from 'elasticsearch';
import { table_names, db } from '../database';
import { defaultType, es_connection } from './es_common';
import * as colors from 'colors-cli/safe';

import cfg from 'src/config/config';

// ---------------------------
export class es_bulk<Entity> {
  protected bulk = [];

  private cols: Partial<Entity> = {};
  private whr_id = 0;
  private cols_num = 0;

  constructor(protected table: table_names, protected type: 'insert' | 'update' = 'insert') {}

  set(list: Partial<Entity>) {
    this.cols = list;
    this.cols_num++;
    return this;
  }

  w(id: number): this {
    this.whr_id = id;
    return this;
  }

  c(col: keyof Entity, value: any): this {
    this.cols[col] = value;
    this.cols_num++;
    return this;
  }
  clear() {
    this.cols = {};
    this.whr_id = 0;
    this.cols_num = 0;
  }

  check_rw() {
    return (this.whr_id > 0 || this.type === 'insert') && this.cols_num > 0;
  }

  next() {
    if (!this.check_rw()) {
      this.clear();
      return this;
    }
    let type: string = this.type;
    if (type === 'insert') {
      type = this.whr_id ? 'create' : 'index';
    }
    const header_rw: any = { [type]: { _index: this.table } };
    let body_rw;
    if (this.whr_id) {
      header_rw[type]._id = this.whr_id;
    }
    if (this.type === 'update') {
      body_rw = { doc: { ...this.cols } };
    } else if (this.type === 'insert') {
      body_rw = { ...this.cols };
    }
    this.bulk.push(header_rw, body_rw);
    this.clear();
    return this;
  }

  async x(): Promise<any> {
    if (this.check_rw()) this.next();
    const esBody: elasticsearch.BulkIndexDocumentsParams = {
      maxRetries: 10000,
      index: this.table,
      refresh: true,
      type: defaultType,
      body: this.bulk,
    };

    if (cfg.es_debug) {
      console.log(colors.green(`bulk (${this.table})`));
      console.log('-----------------------------');
      console.dir(esBody, { depth: null });
      console.log('-----------------------------');
    }

    // console.time('bulk');
    let response = await es_connection.es_client.bulk(esBody).catch((err) => {
      db.es_error(err, `bulk (${this.table})`, esBody);
      // error = true;
      throw err;
    });
    // console.timeEnd('bulk');
    if (response.errors) {
      db.es_error(response, `bulk (${this.table})`, esBody);
    }
    // console.log('response');
    // console.dir(response, { depth: null });
    return response;
  }
}
