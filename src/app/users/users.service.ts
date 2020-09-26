import { Eusers_group } from './../users_group/users_group.entity';
import { db_subEnt } from './../../utils/database/dbcommon';
import { HttpException } from '../../shared/exceptions/http.exception';
import { db } from '../../utils/database/database';
import { Injectable, HttpStatus } from '@nestjs/common';
import { Eusers, CreateUsersDTO } from './users.entity';
import { toArray, mapWithoutZeros } from 'src/utils/utils';
import { pg_is_uniqe_violation } from 'src/utils/database/postgres/pg_exception';
import { loginDTO } from 'src/shared/auth/auth.dto';

@Injectable()
export class UsersService {
  // >----------------------------------------<
  async getAll() {
    const list = await db.es_slc<Eusers>('users').o('i', 'DESC').x();
    return list;
  }
  // >----------------------------------------<
  handleErrors(err) {
    if (pg_is_uniqe_violation(err, 'user_name')) throw new HttpException({ msg: 'الاسم مكرر' }, HttpStatus.CONFLICT);
    // console.log('err', err);
    throw err;
  }
  // >------------------<
  async normRows(rws: Eusers[], isUpdate = false) {
    rws.forEach(async (rw) => {
      rw.group = <any>db.subEnt<Eusers_group>('users_group').c('i', 'name').w(rw.group.i);
      if (!rw.name || rw.name == '') rw.name = rw.user_name;
    });
  }
  // >----------------------------------------<
  // create
  async create(usersBody: CreateUsersDTO) {
    let res: Eusers[];
    const list = toArray(usersBody);
    await this.normRows(list);
    try {
      res = await db.co_ins<Eusers>('users', list).x();
    } catch (err) {
      this.handleErrors(err);
    }
    return res;
  }
  // >----------------------------------------<
  // update
  async update(id: number, usersBody: CreateUsersDTO) {
    let res;
    const list = toArray(usersBody);
    await this.normRows(list, true);
    try {
      res = await db.co_upd<Eusers>('users').set(usersBody).w(id).x();
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
      result = await db.co_del_flag<Eusers>('users').w(id).x();
      if (result[1] === 0) throw new HttpException({ msg: 'غير موجود' }, HttpStatus.NOT_FOUND);
    } catch (err) {
      this.handleErrors(err);
    }
    return result;
  }
  // >------------------<
  async deleteValidation(id: number) {}
  // >----------------------------------------<

  // >----------------------------------------<
}
