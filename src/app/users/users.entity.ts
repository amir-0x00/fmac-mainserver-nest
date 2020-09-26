import { Entity, PrimaryColumn, Column } from 'src/shared/decorators/database';
import { ECol__dl } from 'src/shared/types/Columns';
import SubEntity from 'src/shared/decorators/database/SubEntity';

@SubEntity()
class users__group {
  @Column('int')
  i: number;

  /** الاسم */
  @Column({ type: 'text' })
  name: string;
}

@Entity('users')
export class Eusers {
  @PrimaryColumn()
  i?: number;

  /** الاسم */
  @Column({ type: 'text' })
  name: string;

  /** اسم الدخول */
  @Column({ type: 'text', unique: true })
  user_name: string;

  /** كلمة المرور */
  @Column({ type: 'text', es_type: 'keyword' })
  password: string;

  /** المجموعة */
  @Column({ type: 'json' })
  group: users__group;

  /** الحذف */
  @Column({ type: 'int', default: 0 })
  dl?: ECol__dl;
}

export type CreateUsersDTO = Eusers & Eusers[];
export type UpdateUsersDTO = Eusers & Eusers[];
