import SubEntity from '../decorators/database/SubEntity';
import { Column } from '../decorators/database';

/** log */
@SubEntity()
export class ECol__old_log {
  @Column('int')
  i: number;

  /** تاريخ الإنشاء */
  @Column('datetime')
  date: string;

  /** user id */
  @Column('int')
  user_id: number;

  /** تاريخ الحذف */
  @Column('text', { es_type: 'keyword' })
  data: string;
}

/** التاريخ */
@SubEntity()
export class ECol__date {
  /** تاريخ الإنشاء - يدوي */
  @Column('date')
  date: string;

  /** تاريخ الإنشاء */
  @Column('datetime')
  created_date?: string;

  /** تاريخ اخر تعديل */
  @Column('datetime')
  modified_date?: string;

  /** تاريخ الحذف */
  @Column('datetime')
  deleted_date?: string;
}

/** i & name */
@SubEntity()
export class ECol__i_name {
  @Column('int')
  i: number;

  /** الاسم */
  @Column({ type: 'text' })
  name: string;
}

/** مدين / دائن */
export enum ECol__credit_debit {
  /** دائن - صرف المبلغ (تأكد من وجود رصيد في الخزنة) */
  credit,
  /** مدين - قبض المبلغ */
  debit,
}

export enum ECol__dl {
  /** لم يتم الحذف */
  NOT_DELETED,
  /** تم الحذف */
  DELETED,
}

// export type TCol_dl = typeof ECol_dl;
