import * as _ from 'lodash';
import { db, table_names } from 'src/utils/database/database';

export class CacheManager {
  private static list = {};

  static async fetch(table: table_names) {
    // console.log('fetch');
    this.list[table] = await db.es_slc(table).x();
  }

  static async get<Entity>(table: table_names, iOrWhr: number): Promise<Entity> {
    if (typeof iOrWhr === 'number' || typeof iOrWhr === 'string') {
      const data = this.list[table];
      if (!data) await this.fetch(table);
      const rw = data.find((r) => r.i == iOrWhr);
      return rw;
    }
  }

  static async set(table: table_names, bdy_arr?: any[]) {
    const data = this.list[table];
    let fetch_all = false;
    if (!data) return;
    if (bdy_arr) {
      for (let bdy of bdy_arr) {
        const rw = data.find((r) => r.i === bdy.i);
        if (rw && (bdy.dl === undefined || rw.dl === bdy.dl)) {
          _.merge(rw, bdy);
          // return;
        } else {
          fetch_all = true;
          break;
        }
      }
    } else fetch_all = true;
    if (fetch_all) await this.fetch(table);
  }
}
