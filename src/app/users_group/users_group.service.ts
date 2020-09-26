import { HttpException } from '../../shared/exceptions/http.exception';
import { db } from '../../utils/database/database';
import { Injectable, HttpStatus } from '@nestjs/common';
import { Eusers_group, CreateUsers_groupDTO } from './users_group.entity';
import { toArray, mapWithoutZeros } from 'src/utils/utils';
import { pg_is_uniqe_violation } from 'src/utils/database/postgres/pg_exception';

@Injectable()
export class Users_groupService {
  // >----------------------------------------<
  async getAll() {
    const list = await db.es_slc<Eusers_group>('users_group').o('i', 'DESC').x();
    // list.forEach(users_group => {
    //   users_group.date = date(users_group.date);
    //   users_group.created_date = dateTime(users_group.created_date);
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
  async normRows(rws: Eusers_group[], isUpdate = false) {
    // const parentsIds = mapWithoutZeros(rws, (r) => r.parent_id);
    // let parentsList = [];
    // if (parentsIds.length) parentsList = await db.es_slc<Eusers_group>('users_group').w('i', parentsIds).x();
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
  async create(users_groupBody: CreateUsers_groupDTO) {
    let res: Eusers_group[];
    const list = toArray(users_groupBody);
    await this.normRows(list);
    try {
      res = await db.co_ins<Eusers_group>('users_group', list).x();
    } catch (err) {
      this.handleErrors(err);
    }
    return res;
  }
  // >----------------------------------------<
  // update
  async update(id: number, users_groupBody: CreateUsers_groupDTO) {
    let res;
    const list = toArray(users_groupBody);
    await this.normRows(list, true);
    try {
      res = await db.co_upd<Eusers_group>('users_group').set(users_groupBody).w(id).x();
      if (res[1] === 0) throw new HttpException({ msg: 'غير موجود' }, HttpStatus.NOT_FOUND);
    } catch (err) {
      this.handleErrors(err);
    }
    return res;
  }
  // >----------------------------------------<
  // delete
  async delete(id: number) {
    let result = [];
    try {
      await this.deleteValidation(id);
      result = await db.co_del_flag<Eusers_group>('users_group').w(id).x();
      if (result[1] === 0) throw new HttpException({ msg: 'غير موجود' }, HttpStatus.NOT_FOUND);
    } catch (err) {
      this.handleErrors(err);
    }
    return result;
  }
  // >------------------<
  async deleteValidation(id: number) {}
  // >----------------------------------------<
}
