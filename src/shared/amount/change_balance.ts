import { Ej_e_items__nest_type, Ej_e_items__nest_type_arr } from 'src/app/j_entries/j_entries_items.entity';
import { db, table_names } from 'src/utils/database/database';

type T_balance_indices = Ej_e_items__nest_type;
export async function add_balance(table_inx: T_balance_indices, i: number, balance: number): Promise<void> {
  const table: table_names = <table_names>Ej_e_items__nest_type_arr[table_inx];
  await db.co_upd<any>(table).c('balance', '+', balance).w(i).x();
  // console.log('add_balance', table, i, balance);
}
