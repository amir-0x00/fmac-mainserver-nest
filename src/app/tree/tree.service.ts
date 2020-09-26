import { HttpException } from './../../shared/exceptions/http.exception';
import { db } from '../../utils/database/database';
import { Injectable, HttpStatus } from '@nestjs/common';
import { Etree, CreateTreeDTO } from './tree.entity';
import { mapWithoutZeros } from 'src/utils/utils';
import { pg_is_uniqe_violation } from 'src/utils/database/postgres/pg_exception';
import { co_create, co_update, co_delete } from 'src/shared/services';

@Injectable()
export class TreeService {
  // >----------------------------------------<
  async getAll() {
    const list = await db.es_slc<Etree>('tree').o('i', 'DESC').x();
    return list;
  }
  // >----------------------------------------<
  handleErrors(err) {
    if (pg_is_uniqe_violation(err, 'code')) throw new HttpException({ msg: 'الكود مكرر' }, HttpStatus.CONFLICT);
    // console.log('err', err);
    throw err;
  }
  // >------------------<
  async normRows(rws: Etree[]) {
    const parentsIds = mapWithoutZeros(rws, (r) => r.parent_id);
    let parentsList = [];
    if (parentsIds.length) parentsList = await db.es_slc<Etree>('tree').w('i', parentsIds).x();

    rws.forEach(async (rw) => {
      // ----------------
      rw.parent_list = [];
      rw.level = 0;
      // ----------------
      delete rw['haveTransActions'];
      // ----------------
      if (rw.parent_id > 0) {
        const parentRow = parentsList.find((r) => r.i == rw.parent_id);
        if (parentRow) {
          rw.parent_list = parentRow.parent_list;
          rw.parent_list.push(rw.parent_id);
          rw.level = rw.parent_list.length;
          rw.code = parentRow.code.toString() + rw.code.toString();
        }
      }
      // ----------------
      delete rw['debit'];
      delete rw['credit'];
      // ----------------
    });
  }
  // >----------------------------------------<
  // create
  async create(treeBody: CreateTreeDTO): Promise<Etree[]> {
    let res = await co_create<Etree>(this, 'tree', treeBody);
    return res;
  }
  // >----------------------------------------<
  // update
  async update(id: number, treeBody: CreateTreeDTO, user_id: number) {
    let res = await co_update<Etree>({ that: this, table: 'tree', id, body: treeBody, user_id });
    return res;
  }
  // >----------------------------------------<
  // delete
  async delete(id: number) {
    let res = await co_delete<Etree>(this, 'tree', id);
    return res;
  }
  // >------------------<
  // async deleteValidation(id: number) {}
  // >----------------------------------------<
}
