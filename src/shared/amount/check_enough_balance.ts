import { HttpException } from './../exceptions/http.exception';
import { table_names } from './../../utils/database/database';
import { Ej_e_items__nest_type, Ej_e_items__nest_type_arr } from 'src/app/j_entries/j_entries_items.entity';
import { HttpStatus } from '@nestjs/common';
import { CacheManager } from '../cache/CacheManager';

// type T_check_balance_indices = 'treasury' | 'banks';
type T_check_balance_indices = Ej_e_items__nest_type.treasury | Ej_e_items__nest_type.banks;

export async function check_enough_balance(
  table_inx: T_check_balance_indices,
  i: number,
  balance: number,
): Promise<void> {
  const table: table_names = <table_names>Ej_e_items__nest_type_arr[table_inx];
  const fromCache = await CacheManager.get<any>(table, i);
  if (fromCache.balance < Math.abs(balance)) {
    throw new HttpException({ msg: 'رصيد الخزنة اقل من المبلغ المطلوب' }, HttpStatus.FORBIDDEN);
  }
  // console.log('fromCache.balance', fromCache.balance);
}
