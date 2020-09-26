import { Entity, PrimaryColumn, Column } from 'src/shared/decorators/database';
import { ECol__dl, ECol__i_name, ECol__date } from 'src/shared/types/Columns';
import { ECol_j_entries__is_auto } from '../j_entries/j_entries.entity';

@Entity('products')
export class Eproducts {
  @PrimaryColumn()
  i?: number;

  /** الاسم */
  @Column('text')
  name: string;

  /** الجهة */
  @Column('int')
  entity_type: ECol_products__entity_type;

  /** الجهة */
  @Column('json')
  entity: ECol__i_name;

  /** طريقة الدفع */
  @Column('int')
  payment_type: ECol_products__payment_type;

  /** جهة الدفع */
  @Column('json')
  payment: ECol__i_name;

  /** مركز التكلفة */
  @Column('int')
  cost_center: number;

  /** المبلغ */
  @Column('float')
  amount: number;

  /** اسم المستلم */
  @Column('text')
  reciver_name: string;

  /** tags */
  @Column({ type: 'json', default: [], es_type: 'keyword' })
  tags?: string[];

  /** التاريخ */
  @Column('json')
  date: ECol__date;

  /** السند اوتوماتيك ؟ */
  @Column('int')
  is_auto: ECol_j_entries__is_auto;

  /** المستخدم */
  @Column('json')
  user: ECol__i_name;

  /** الحذف */
  @Column({ type: 'int', default: 0 })
  dl?: ECol__dl;
}

export type CreateProductsDTO = Eproducts & Eproducts[];
export type UpdateProductsDTO = Eproducts & Eproducts[];

/** الجهة - السندات */
export enum ECol_products__entity_type {
  /** عميل */
  customer,
  /** مورد */
  vendor,
  /** حساب */
  tree_account,
}

/** جهات الدفع - السندات */
export enum ECol_products__payment_type {
  /** خزنة */
  treasury,
  /** بنك */
  bank,
}
