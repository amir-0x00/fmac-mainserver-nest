import { Entity, PrimaryColumn, Column } from 'src/shared/decorators/database';
import { ECol__dl } from 'src/shared/types/Columns';

@Entity('users_group')
export class Eusers_group {
  @PrimaryColumn()
  i?: number;

  /** الاسم */
  @Column({ type: 'text' })
  name: string;

  /** الحذف */
  @Column({ type: 'int', default: 0 })
  dl?: ECol__dl;
}

export type CreateUsers_groupDTO = Eusers_group & Eusers_group[];
export type UpdateUsers_groupDTO = Eusers_group & Eusers_group[];
