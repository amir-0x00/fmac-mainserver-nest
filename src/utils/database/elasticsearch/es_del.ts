import * as elasticsearch from 'elasticsearch';
import * as colors from 'colors-cli/safe';

import { table_names, db } from '../database';
import { es_where } from './es_where';
import { defaultType, es_connection } from './es_common';

import cfg from 'src/config/config';

// ---------------------------
export class es_del<Entity> extends es_where<Entity> {
  es_type = 'es_del';

  esBody: elasticsearch.DeleteDocumentByQueryParams &
    Partial<elasticsearch.DeleteDocumentParams> = {
    index: this.table,
    type: defaultType,
    refresh: true,
  };

  constructor(private table: table_names) {
    super();
  }

  /** Get One */
  // async one(): Promise<Entity> {
  //   const this_x = await this.l(1).x();
  //   if (this_x.length) return this_x[0];
  //   return {} as Entity;
  // }

  beforeExecute() {
    if (this.whr_id) {
      this.esBody.id = this.whr_id;
    } else {
      this.esBody.body = this.qry.build();
    }
  }

  async x(): Promise<any> {
    this.beforeExecute();
    // console.log('qryBuilder');
    // console.dir(qryBuilder, { depth: null });

    // console.log('this', this);
    let quName = 'delete';

    if (!this.whr_id) quName = 'deleteByQuery';

    if (cfg.es_debug) {
      console.log(colors.green(quName));
      console.log('-----------------------------');
      console.dir(this.esBody, { depth: null });
      console.log('-----------------------------');
    }

    await es_connection.es_client[quName](this.esBody).catch(err => {
      db.es_error(err, quName, this.esBody);
      throw err;
    });
    // let result: Entity[] = [];

    // const qryStr = `SELECT ${this.cols} FROM ${this.table}${this.where}${this.orderBy}${this.getLimit}`;
    // if (cfg.postgres_debug) db.my_logQuery(postgres_log_types.select, qryStr);
    // const res = await pg_general.getConnection.query( qryStr );
    // console.log('qry', qryStr);

    // return result;
  }
}
// ---------------------------
