import { table_names } from './../../utils/database/database';
import { ECol__date, ECol__old_log } from './../../shared/types/Columns';
import { Entity, PrimaryColumn, Column } from 'src/shared/decorators/database';
import { ECol__dl, ECol__i_name } from 'src/shared/types/Columns';
import SubEntity from 'src/shared/decorators/database/SubEntity';

@SubEntity()
export class j_entries__note_data {
  @Column('int')
  i: number;

  /** الجدول */
  @Column({ type: 'text', es_type: 'keyword' })
  table: table_names;
}

@Entity('j_entries')
export class Ej_entries {
  @PrimaryColumn()
  i?: number;

  /** المبلغ */
  @Column({ type: 'float', default: 0 })
  amount: number;

  /** البيان */
  @Column({ type: 'text' })
  note: string;

  /** الحسابات في البيان */
  @Column({ type: 'json', es_class: j_entries__note_data })
  note_data: j_entries__note_data[];

  /** tags */
  @Column({ type: 'json', default: [], es_type: 'keyword' })
  tags?: string[];

  /** التاريخ */
  @Column('json')
  date: ECol__date;

  /** القيد اوتوماتيك ؟ */
  @Column('int')
  is_auto: ECol_j_entries__is_auto;

  /** نوع القيد [فاتورة بيع - تسديد فاتورة بيع]... وهكذا */
  @Column({ type: 'int', default: -1 })
  type: Ej_entries__j_type;

  /** المستخدم */
  @Column('json')
  user: ECol__i_name;

  /** الحذف */
  @Column({ type: 'int', default: 0 })
  dl?: ECol__dl;

  /** log */
  @Column('json', { es_class: ECol__old_log, default: '[]' })
  old_log?: ECol__old_log[];
}

export type CreateJ_entriesDTO = Ej_entries & Ej_entries[];
export type UpdateJ_entriesDTO = Ej_entries & Ej_entries[];

/** عدم القدرة علي اختياره في الحركات اليدوية - شجرة الحسابات */
export enum ECol_j_entries__is_auto {
  /** يدوي */
  manual,
  /** اوتوماتك */
  auto,
}

export enum Ej_entries__j_type {
  inital_balance_banks,
  treasury_initial_balance,
  vendors_initial_balance,
  customers_initial_balance,
  banks_initial_balance,
  imp_vouchers,
  exp_vouchers,
  inv_purchase,
  inv_sales,
  inv_rev_purchase,
  inv_rev_sales,
  inv_sales_payment,
  inv_purchase_payment,
  inv_rev_purchase_payment,
  inv_rev_sales_payment,
  imp_w_transaction,
  exp_w_transaction,
  inv_sales_banks_point,
  transfer_money,
  trn_expenses,
  trn_revenues,
}
