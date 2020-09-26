import { EJAutoNotes } from './../j_entries/j_entries.create';
import { HttpException } from '../../shared/exceptions/http.exception';
import { db } from '../../utils/database/database';
import { Injectable, HttpStatus } from '@nestjs/common';
import { Evouchers, CreateVouchersDTO, UpdateVouchersDTO } from './vouchers.entity';
import { fill_created_date, mapWithoutZeros } from 'src/utils/utils';
import { pg_is_uniqe_violation } from 'src/utils/database/postgres/pg_exception';
import { co_create, co_update, co_delete } from 'src/shared/services';
import { TVouchers_types } from './vouchers.controller';
import { JEntry } from '../j_entries/j_entries.create';
import { ECol__credit_debit } from 'src/shared/types/Columns';
import { Ej_entries__j_type } from '../j_entries/j_entries.entity';
import { Ej_e_items__nest_type } from '../j_entries/j_entries_items.entity';

@Injectable()
export class VouchersService {
  // >----------------------------------------<
  async getAll(type: TVouchers_types) {
    const list = await db
      .es_slc<Evouchers>(<any>(type + '_vouchers'))
      .o('i', 'DESC')
      .x();
    return list;
  }
  // >----------------------------------------<
  // handleErrors(err) {
  //   if (pg_is_uniqe_violation(err, 'code')) throw new HttpException({ msg: 'الكود مكرر' }, HttpStatus.CONFLICT);
  //   // console.log('err', err);
  //   throw err;
  // }
  // >------------------<
  async normRows(rws: Evouchers[], isUpdate = false) {
    // const parentsIds = mapWithoutZeros(rws, (r) => r.parent_id);
    // let parentsList = [];
    // if (parentsIds.length) parentsList = await db.es_slc<Evouchers>('vouchers').w('i', parentsIds).x();
    rws.forEach(async (rw) => {
      // ----------------
      if (rw.is_auto === undefined) rw.is_auto = 0;
      if (!isUpdate) fill_created_date(rw);
      // ----------------
    });
  }
  // >----------------------------------------<
  // create
  async create(type: TVouchers_types, vouchersBody: CreateVouchersDTO) {
    const index: any = type + '_vouchers';

    await new JEntry('treasury', {
      notes_txt: EJAutoNotes.treasury_initial_balance,
      notes_id: 2,
      notes_nm: 'خزنة نقطة البيع',
      index: 'treasury',
      // revese: true,
      revese: type === 'imp',
    })
      .set_bdy({ date: { date: '2020-09-10' }, user: <any>1, type: Ej_entries__j_type.treasury_initial_balance })
      .set_itms([
        {
          tree_id: 1,
          amount: vouchersBody.amount,
          tree_nest_id: 2,
          type: ECol__credit_debit.credit,
          tree_nest_type: Ej_e_items__nest_type.treasury,
        },
        { tree_id: 2, amount: vouchersBody.amount, type: ECol__credit_debit.debit },
      ])
      .x();

    let res: Evouchers[] = await co_create(this, index, vouchersBody);
    return res;
  }
  // >----------------------------------------<
  // update
  async update(type: TVouchers_types, id: number, vouchersBody: UpdateVouchersDTO, user_id: number) {
    const index: any = type + '_vouchers';
    let res: Evouchers[] = await co_update({ that: this, table: index, id, body: vouchersBody, user_id });
    return res;
  }
  // >----------------------------------------<
  // delete
  async delete(type: TVouchers_types, id: number) {
    const index: any = type + '_vouchers';
    let res = await co_delete(this, index, id);
    return res;
  }
  // >------------------<
  // async deleteValidation(id: number) {}
  // >----------------------------------------<
}
