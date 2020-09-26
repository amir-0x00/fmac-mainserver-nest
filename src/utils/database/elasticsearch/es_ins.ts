import { table_names, db } from '../database';
import { defaultType, es_connection } from './es_common';

import { es_bulk } from './es_bulk';

// ---------------------------
export class es_ins<Entity> {
  // private cols: Partial<Entity> = {};
  // private cols_num = 0;

  constructor(table: table_names, list: Entity[]);
  constructor(table: table_names, list: Entity);
  constructor(private table: table_names, private list: Entity | Entity[]) {
    if (list) {
      if (Array.isArray(list)) {
      } else {
        this.set(list);
      }
    }
  }

  set(list: Entity) {
    this.list = list;
    // this.cols_num++;
    return this;
  }

  bulk(): es_bulk<Entity> {
    return new es_bulk<Entity>(this.table, 'insert').set(<Entity>this.list);
  }
  // Returning

  async x(): Promise<any> {
    if (Array.isArray(this.list)) {
      // if (this.list.length > 1) {
      const bulk = new es_bulk<Entity>(this.table, 'insert');
      for (let i = 0; i < this.list.length; i++) {
        const rw: any = this.list[i];
        bulk.next().set(rw);
        if (rw.i) bulk.w(rw.i);
      }
      return await bulk.x();
      // } else {
      //   this.list = this.list[0];
      // }
    }
    // -------------
    const body: any = this.list;
    let id = body.i,
      esOrder = 'index';
    // -------------
    let quBody: any = {
      index: this.table,
      type: defaultType,
      refresh: true,
      body,
    };
    // -------------
    if (id != undefined) {
      quBody.id = id;
      esOrder = 'create';
    }
    // -------------
    let result,
      error = false;
    // console.time('es_ins');
    let response = await es_connection.es_client[esOrder](quBody).catch((err) => {
      db.es_error(err, `insert (insert)`, quBody);
      error = true;
      throw err;
    });
    // console.timeEnd('es_ins');

    // -------------
    // if(opts.refresh === true){
    // }
    // client[index].refresh()

    if (!error) {
      result = response._id;
    }
    return result;
  }
}
// ---------------------------
