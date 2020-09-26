import * as elasticsearch from 'elasticsearch';
import { table_names, orderByTypes, db } from '../database';
import { es_where } from './es_where';
import { defaultType, es_connection } from './es_common';
import * as colors from 'colors-cli/safe';

import cfg from 'src/config/config';

// ---------------------------
export class es_slc<Entity> extends es_where<Entity> {
  private sourceOnly = true;
  private limitNumber = 9999;
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

  /** Limit */
  l(num: number) {
    this.limitNumber = num;
    return this;
  }

  /** OrderBy */
  o(col: keyof Entity, type: orderByTypes) {
    this.qry.sort(<string>col, type);
    return this;
  }

  /** Get One */
  async one(): Promise<Entity> {
    const this_x = await this.l(1).x();
    if (this_x.length) return this_x[0];
    return {} as Entity;
  }

  beforeExecute() {
    this.qry.size(this.limitNumber);
  }

  async x(): Promise<Entity[]> {
    this.beforeExecute();
    if (this.dl_only) this.w(<any>'dl', 0);
    const qryBuilder = this.qry.build();
    // console.log('qryBuilder');
    // console.dir(qryBuilder, { depth: null });
    let esBody: elasticsearch.SearchParams = {
      index: this.table,
      body: qryBuilder,
      type: defaultType,
    };
    if (this.sourceOnly) {
      esBody.filterPath = ['hits.hits._source', 'hits.hits._id', 'aggregations'];
      // if (is_inx_arr) { esBody.filterPath.push('hits.hits._index'); }
    }

    if (cfg.es_debug) {
      console.log(colors.green('search'));
      console.log('-----------------------------');
      console.dir(qryBuilder, { depth: null });
      console.log('-----------------------------');
    }
    let response = await es_connection.es_client.search(esBody).catch((err) => {
      db.es_error(err, 'select', esBody);
      throw err;
    });
    let result: Entity[] = [];
    if (this.sourceOnly && response.hits && response.hits.hits) {
      for (let i = 0; i < response.hits.hits.length; i++) {
        const row = response.hits.hits[i];
        let srcRow: any = row._source;
        if (srcRow.i === undefined) {
          srcRow.i = row._id;
        }
        result.push(srcRow);
      }
    }
    return result;
  }
}
