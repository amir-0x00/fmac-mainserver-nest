import { Entity, PrimaryColumn, Column } from 'src/shared/decorators/database';

class product_category_meta {
  /** اللون */
  @Column('text', { es_type: 'keyword' })
  color: string;

  /** الايكونة */
  @Column('text', { es_type: 'keyword' })
  icon: string;
}

@Entity('products_category')
export class Eproduct_category {
  @PrimaryColumn()
  i?: number;

  /** الاسم */
  @Column('text')
  name: string;

  /** آخرى */
  @Column({ type: 'json' })
  meta?: product_category_meta;

  /** الحذف */
  @Column({ type: 'int', default: 0 })
  dl?: number;
}
