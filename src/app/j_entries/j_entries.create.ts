import { fill_created_date, get_user_i_nm } from 'src/utils/utils';
import { Ej_entries_items, Ej_e_items__nest_type } from './j_entries_items.entity';
import { Ej_entries } from './j_entries.entity';
import { db, table_names } from './../../utils/database/database';
import * as _ from 'lodash';
import { ECol__credit_debit } from 'src/shared/types/Columns';
import { check_enough_balance } from 'src/shared/amount/check_enough_balance';
import { add_balance } from 'src/shared/amount/change_balance';

export const EJAutoNotes = {
  inital_balance_banks: 'رصيد إفتتاحي لبنك ${0}',
  treasury_initial_balance: 'رصيد إفتتاحي لخزنة ${0}',
  vendors_initial_balance: 'رصيد إفتتاحي لمورد ${0}',
  customers_initial_balance: 'رصيد إفتتاحي لعميل ${0}',
  banks_initial_balance: 'رصيد إفتتاحي لبنك ${0}',
  imp_vouchers: 'سند قبض رقم ${0}',
  exp_vouchers: 'سند صرف رقم ${0}',
  inv_purchase: 'فاتورة شراء رقم ${0}',
  inv_sales: 'فاتورة بيع رقم ${0}',
  inv_rev_purchase: 'فاتورة مرتجع شراء رقم ${0}',
  inv_rev_sales: 'فاتورة مرتجع بيع رقم ${0}',
  inv_sales_payment: 'سداد فاتورة بيع رقم ${0}',
  inv_purchase_payment: 'سداد فاتورة شراء رقم ${0}',
  inv_rev_purchase_payment: 'سداد فاتورة مرتجع شراء رقم ${0}',
  inv_rev_sales_payment: 'سداد فاتورة مرتجع بيع رقم ${0}',
  imp_w_transaction: 'إذن اضافة بالمخزن رقم ${0}',
  exp_w_transaction: 'إذن صرف من المخزن رقم ${0}',
  inv_sales_banks_point: 'عمولات بنكية علي فاتورة بيع رقم ${0}',
  transfer_money: 'تحويل نقدية رقم ${0}',
  trn_expenses: 'سند مصروفات رقم ${0}',
  trn_revenues: 'سند إرادات رقم ${0}',
};

interface IJ_entries_options {
  /** نص الملاحظات التلقائية */
  notes_txt?: string;
  /** الاسم في البيان .. اسم العميل ، المورد.. إلخ */
  notes_nm?: string;
  /** الاي دي في البيان .. اي دي العميل ، المورد.. إلخ */
  notes_id?: number;

  /** عكس الاطراف */
  revese?: boolean;
  index?: table_names;
  not_auto?: boolean;
}
// interface IJ_entries_body {
//   i?: number;
// }
export type IJ_entries_body = Partial<Ej_entries>;

export interface IJ_entries_item extends Partial<Ej_entries_items> {
  /** ID حساب الشجرة */
  tree_id: number;

  /** المبلغ */
  amount: number;
}
type IJ_entries_items = IJ_entries_item[];

export class JEntry {
  private bdy: IJ_entries_body = {};
  private itms: IJ_entries_items = [];
  constructor(private index: table_names, private opts?: IJ_entries_options) {
    console.log('index', index);
    return this;
  }
  set_bdy(n_bdy: IJ_entries_body) {
    this.bdy = this.norm_bdy(n_bdy);
    return this;
  }
  set_itms(itms: IJ_entries_items) {
    this.itms.push(...itms);
    return this;
  }
  set_itm(itms: IJ_entries_item) {
    this.itms.push(itms);
    return this;
  }

  // private get_bdy_note(): {note:string, note_data: j_entries__note_data[]} {
  //   if
  //   return {note:'', note_data:[{table:'test', i:2}]}
  // }
  private norm_bdy(n_bdy: IJ_entries_body): IJ_entries_body {
    const bdy: IJ_entries_body = { ...n_bdy },
      opts = this.opts;
    // ----------------
    // amount
    // bdy.amount = this.itms.reduce((o, n) => (n.type !== 0 ? o : o + parseFloat(<any>n.amount)), 0);
    // ----------------
    // note
    if (opts.notes_txt) {
      bdy.note = opts.notes_txt;
      bdy.note = bdy.note.replace('${0}', '${' + opts.notes_nm + '}');
      bdy.note_data = [{ i: opts.notes_id, table: opts.index }];
    } else if (!bdy.note) {
      bdy.note = '';
      bdy.note_data = [];
    }
    // ----------------
    // tags
    if (!bdy.tags) bdy.tags = [];
    bdy.tags = [...bdy.tags, opts.index, opts.index + '/' + opts.notes_id];
    // ----------------
    // is_auto
    bdy.is_auto = opts.not_auto ? 0 : 1;
    // ----------------
    // date
    if (!bdy.i) {
      fill_created_date(bdy);
    }
    // ----------------
    if (typeof bdy.user === 'number') {
      bdy.user = get_user_i_nm(bdy.user);
    }
    // ----------------
    return bdy;
  }

  private async get_itms(): Promise<IJ_entries_items> {
    const list: IJ_entries_items = [];
    for (let raw_itm of this.itms) {
      const itm: IJ_entries_item = { ...raw_itm };
      // ----------------
      // amount & if reverse
      if (itm.type === ECol__credit_debit.credit && itm.amount > 0) itm.amount *= -1;
      if (this.opts.revese) {
        itm.type = itm.type === ECol__credit_debit.credit ? ECol__credit_debit.debit : ECol__credit_debit.credit;
        itm.amount *= -1;
      }
      // ----------------
      // notes
      if (!itm.note || itm.note === '') {
        itm.note = this.bdy.note;
        itm.note_data = this.bdy.note_data;
      }
      itm.j_note = this.bdy.note;
      itm.j_note_data = this.bdy.note_data;
      // ----------------
      // j_type
      if (this.bdy.type !== undefined) itm.j_type = this.bdy.type;
      // ----------------
      // other
      if (!itm.tree_nest_type) itm.tree_nest_type = 0;
      if (!itm.tree_nest_id) itm.tree_nest_id = 0;
      itm.is_auto = this.bdy.is_auto;
      // ----------------
      // if amount > 0 && (banks || treasury)
      if (
        itm.amount !== 0 &&
        itm.type === ECol__credit_debit.credit &&
        (itm.tree_nest_type === 1 || itm.tree_nest_type === 2)
      ) {
        await check_enough_balance(<any>itm.tree_nest_type, itm.tree_nest_id, itm.amount);
      }
      // ----------------
      list.push(itm);
    }
    return list;
  }

  private async last_norm_itms(itms: IJ_entries_items, j_res: Partial<Ej_entries>) {
    for (let itm of itms) {
      // ----------------
      itm.entry_id = j_res.i;
      itm.user = j_res.user;
      itm.date = j_res.date;
      // ----------------
      // add_balance
      if (itm.tree_nest_type > 0 && itm.tree_nest_id > 0) {
        await add_balance(itm.tree_nest_type, itm.tree_nest_id, itm.amount);
      }
      // ----------------
    }
  }

  async x() {
    const bdy = this.bdy,
      itms = await this.get_itms();
    // ----------------
    // amount
    bdy.amount = this.itms.reduce((o, n) => (n.type !== 0 ? o : o + parseFloat(<any>n.amount)), 0);
    bdy.amount = Math.abs(bdy.amount);
    // ----------------
    // console.log('bdy', bdy);
    const [j_res] = await db.co_ins('j_entries', bdy).x();
    // id.i
    // TODO: Remove await;
    await this.last_norm_itms(itms, j_res);
    await db.co_ins('j_entries_items', itms).x();
    // console.log('itms', itms);
    // console.log('id', id);
    // await db.co_ins('j_entries', bdy).x();
    // ----------------
  }
}
// export async function j_entries_create(options: IJ_entries_options, body?: IJ_entries_body, items?: IJ_entries_items) {
//   // _.clone();
// }

// const j_entry = new JEntry('treasury', { notes_txt: EJAutoNotes.customers_initial_balance })
//   .set_bdy({ i: 2 })
//   .set_itms([{ tree_id: 2, tree_nest_id: 2, amount: 200 }])
//   .x();
// j_entries_create({ index: 'j_entries' });
