import * as elasticsearch from 'elasticsearch';
import { table_names, orderByTypes, db } from '../database';
import { es_where } from './es_where';
import { defaultType, es_connection } from './es_common';
import * as colors from 'colors-cli/safe';

import cfg from 'src/config/config';

// ---------------------------
export class es_count<Entity> extends es_where<Entity> {
  private dl_only = true;

  constructor(private table: table_names) {
    super();
  }

  c(...list: (keyof Entity)[]) {
    this.qry.rawOption('_source', list);
    return this;
  }

  dl(value) {
    this.dl_only = value;
    return this;
  }

  /** OrderBy */
  o(col: keyof Entity, type: orderByTypes) {
    this.qry.sort(<string>col, type);
    return this;
  }

  // beforeExecute() {
  //   this.qry.size(this.limitNumber);
  // }

  async x(): Promise<number> {
    // this.beforeExecute();
    if (this.dl_only) this.w(<any>'dl', 0);
    const qryBuilder = this.qry.build();
    // console.log('qryBuilder');
    // console.dir(qryBuilder, { depth: null });
    let esBody: elasticsearch.CountParams = {
      index: this.table,
      body: qryBuilder,
      type: defaultType,
    };

    if (cfg.es_debug) {
      console.log(colors.blue('count'));
      console.log('-----------------------------');
      console.dir(qryBuilder, { depth: null });
      console.log('-----------------------------');
    }
    let response = await es_connection.es_client.count(esBody).catch(err => {
      db.es_error(err, 'count', esBody);
      throw err;
    });

    return response.count;
  }
}
