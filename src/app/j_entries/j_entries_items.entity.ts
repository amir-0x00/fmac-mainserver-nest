import { ECol__date } from './../../shared/types/Columns';
import { Entity, PrimaryColumn, Column } from 'src/shared/decorators/database';
import { ECol__dl, ECol__credit_debit, ECol__i_name } from 'src/shared/types/Columns';
import { j_entries__note_data, ECol_j_entries__is_auto, Ej_entries__j_type } from './j_entries.entity';

export const Ej_e_items__nest_type_arr = [null, 'treasury', 'vendors', 'customers', 'banks'];
export const enum Ej_e_items__nest_type {
  treasury = 1,
  vendors,
  customers,
  banks,
}

@Entity('j_entries_items')
export class Ej_entries_items {
  @PrimaryColumn()
  i?: number;

  /** ID القيد */
  @Column({ type: 'int' })
  entry_id: number;

  /** البيان */
  @Column({ type: 'text', default: '' })
  note: string;

  /** الحسابات في البيان */
  @Column({ type: 'json', default: [], es_class: j_entries__note_data })
  note_data: j_entries__note_data[];

  /** البيان القيد الرئيسي */
  @Column({ type: 'text', default: '' })
  j_note: string;

  /** الحسابات في البيان القيد الرئيسي */
  @Column({ type: 'json', default: [], es_class: j_entries__note_data })
  j_note_data: j_entries__note_data[];

  /** tags */
  @Column({ type: 'json', default: [], es_type: 'keyword' })
  tags?: string[];

  /** النوع */
  @Column({ type: 'int' })
  type: ECol__credit_debit;

  /** ID حساب الشجرة */
  @Column({ type: 'int' })
  tree_id: number;

  /** ID الحساب الفرعي من حساب الشجرة [العملاء - الموردين]... وهكذا */
  @Column({ type: 'int', default: 0 })
  tree_nest_id: number;

  /** نوع الحساب الفرعي من حساب الشجرة [العملاء - الموردين]... وهكذا */
  @Column({ type: 'int', default: 0 })
  tree_nest_type?: Ej_e_items__nest_type;

  /** نوع القيد [فاتورة بيع - تسديد فاتورة بيع]... وهكذا */
  @Column({ type: 'int', default: -1 })
  j_type?: Ej_entries__j_type;

  /** المبلغ */
  @Column({ type: 'float' })
  amount: number;

  /** التاريخ */
  @Column('json')
  date: ECol__date;

  /** القيد اوتوماتيك ؟ */
  @Column('int')
  is_auto: ECol_j_entries__is_auto;

  /** مركز التكلفة */
  @Column({ type: 'int', default: 1 })
  cost_center_id: number;

  /** المستخدم */
  @Column('json')
  user: ECol__i_name;

  /** الحذف */
  @Column({ type: 'int', default: 0 })
  dl?: ECol__dl;
}

export type CreateJ_entries_itemsDTO = Ej_entries_items & Ej_entries_items[];
export type UpdateJ_entries_itemsDTO = Ej_entries_items & Ej_entries_items[];
