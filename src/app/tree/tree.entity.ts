import { Entity, PrimaryColumn, Column } from 'src/shared/decorators/database';
import { ECol__dl, ECol__credit_debit } from 'src/shared/types/Columns';

@Entity('tree')
export class Etree {
  @PrimaryColumn()
  i?: number;

  /** الكود */
  @Column({ type: 'text', unique: true, es_type: 'keyword' })
  code: string;

  /** الاسم */
  @Column({ type: 'text' })
  name: string;

  /** الحساب الختامي */
  @Column('int')
  closing_account: ECol_tree__closeing_account;

  /** الحساب المتفرع منه */
  @Column('int')
  parent_id: number;

  /** قائمة الحسابات المتفرع منها بالتدريج */
  @Column({ type: 'json', default: [], es_type: 'integer' })
  parent_list?: number[];

  /** مستوى الحساب */
  @Column('int')
  level?: number;

  /** طبيعة الحساب */
  @Column('int')
  normal_balance: ECol__credit_debit;

  /** نوع الحساب */
  @Column('int')
  type: ECol_tree__type;

  /** عدم القدرة علي اختياره في الحركات اليدوية */
  @Column({ type: 'int', default: 0 })
  disabled?: ECol_tree__disalbed;

  /** مدين */
  @Column({ type: 'float', default: 0 })
  debit: number;

  /** دائن */
  @Column({ type: 'float', default: 0 })
  credit: number;

  /** الحذف */
  @Column({ type: 'int', default: 0 })
  dl?: ECol__dl;
}

export type CreateTreeDTO = Etree & Etree[];
export type UpdateTreeDTO = Etree & Etree[];

/** الحساب الختامي - شجرة الحسابات */
export enum ECol_tree__closeing_account {
  /** غير محدد */
  none,
  /** الميزانية */
  budget,
  /** ارباح وخسائر */
  profit_loss,
  /** متاجرة */
  trade,
  /** قائمة الدخل */
  income_list,
}

/** نوع الحساب - شجرة الحسابات */
export enum ECol_tree__type {
  /** رئيسي */
  parent,
  /** فرعي */
  child,
}

/** عدم القدرة علي اختياره في الحركات اليدوية - شجرة الحسابات */
export enum ECol_tree__disalbed {
  /** مسموح باختياره */
  no,
  /** غير مسموح باختياره */
  yes,
}
