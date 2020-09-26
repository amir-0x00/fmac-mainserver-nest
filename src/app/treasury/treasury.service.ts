import { db } from './../../utils/database/database';
import { Injectable } from '@nestjs/common';
import { CreateTreasuryDTO, Etreasury } from './treasury.entity';
import { toArray, dateTime, date } from 'src/utils/utils';

@Injectable()
export class TreasuryService {
  async getAll() {
    const list = await db.es_slc<Etreasury>('treasury').x();
    list.forEach((treasury) => {
      treasury.date = {
        date: date(treasury.date.date),
        created_date: dateTime(treasury.date.created_date),
      };
    });
    return list;
  }

  async create(createTreasuryDTO: CreateTreasuryDTO | CreateTreasuryDTO[]) {
    const list = toArray(createTreasuryDTO);

    // for (let i = 0; i < 200; i++) {
    list.forEach((treasury: Etreasury) => {
      // treasury.balance = treasury.initial_balance * i;
      treasury.balance = treasury.initial_balance;
      treasury.date.created_date = dateTime();
    });

    return await db.co_ins<CreateTreasuryDTO>('treasury', list).x();
  }
}
