import { ECol__date } from './../../shared/types/Columns';
import { Entity, PrimaryColumn, Column } from 'src/shared/decorators/database';

@Entity('treasury')
export class Etreasury {
  @PrimaryColumn()
  i?: number;

  /** الاسم */
  @Column('text')
  name: string;

  /** الرصيد الافتتاحي */
  @Column('float')
  initial_balance: number;

  /** الرصيد */
  @Column('float')
  balance: number;

  /** التاريخ */
  @Column('json')
  date: ECol__date;

  /** الحذف */
  @Column({ type: 'int', default: 0 })
  dl?: number;
}

export class CreateTreasuryDTO {
  name: string;
  initial_balance: number;
  balance?: number;
  date: ECol__date;
}

export class UpdateTreasuryDTO extends Etreasury {}
