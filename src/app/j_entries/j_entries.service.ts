import { BaseService } from './../../shared/services/co_service_class';
import { HttpException } from '../../shared/exceptions/http.exception';
import { db, table_names } from '../../utils/database/database';
import { Injectable, HttpStatus } from '@nestjs/common';
import { Ej_entries, CreateJ_entriesDTO, UpdateJ_entriesDTO } from './j_entries.entity';
import { toArray } from 'src/utils/utils';
import { pg_is_uniqe_violation } from 'src/utils/database/postgres/pg_exception';

@Injectable()
export class J_entriesService extends BaseService {
  table: table_names = 'j_entries';
  // >----------------------------------------<
  async getAll() {
    const list = await db.es_slc<Ej_entries>('j_entries').o('i', 'DESC').x();
    console.log('list');
    console.dir(list, { depth: null });
    // list.forEach(j_entries => {
    //   j_entries.date = date(j_entries.date);
    //   j_entries.created_date = dateTime(j_entries.created_date);
    // });
    return list;
  }
  // >----------------------------------------<
  handleErrors(err) {
    if (pg_is_uniqe_violation(err, 'code')) throw new HttpException({ msg: 'الكود مكرر' }, HttpStatus.CONFLICT);
    // console.log('err', err);
    throw err;
  }
  // >------------------<
  async normRows(rws: Ej_entries[], isUpdate = false) {
    // const parentsIds = mapWithoutZeros(rws, (r) => r.parent_id);
    // let parentsList = [];
    // if (parentsIds.length) parentsList = await db.es_slc<Ej_entries>('j_entries').w('i', parentsIds).x();
    // rws.forEach(async (rw) => {
    //   // ----------------
    //   rw.parent_list = [];
    //   rw.level = 0;
    //   // ----------------
    //   delete rw['haveTransActions'];
    //   // ----------------
    //   if (rw.parent_id > 0) {
    //     const parentRow = parentsList.find((r) => r.i == rw.parent_id);
    //     if (parentRow) {
    //       rw.parent_list = parentRow.parent_list;
    //       rw.parent_list.push(rw.parent_id);
    //       rw.level = rw.parent_list.length;
    //       rw.code = parentRow.code.toString() + rw.code.toString();
    //     }
    //   }
    //   // ----------------
    //   delete rw['debit'];
    //   delete rw['credit'];
    //   // ----------------
    // });
  }
  // >----------------------------------------<
  // create
  async create(body: CreateJ_entriesDTO, user_id: number) {
    let res: Ej_entries[] = await this.co_create({ body, user_id });
    return res;
  }
  // >----------------------------------------<
  // update
  async update(id: number, body: UpdateJ_entriesDTO, user_id: number) {
    let res: UpdateJ_entriesDTO[] = await this.co_update({ id, body, user_id });
    return res;
  }
  // >----------------------------------------<
  // delete
  async delete(id: number) {
    let res = await this.co_delete({ id });
    return res;
  }
  // >------------------<
  // async deleteValidation(id: number) {}
  // >----------------------------------------<
}
