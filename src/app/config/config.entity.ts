import { Entity, PrimaryColumn, Column } from 'src/shared/decorators/database';

@Entity('config', { noES: true })
export class Econfig {
  @PrimaryColumn()
  i?: number;

  /** الاسم */
  @Column({ type: 'text' })
  name: string;

  /** الحذف */
  @Column({ type: 'json' })
  value?: string;
}

export type CreateConfigDTO = Econfig & Econfig[];
export type UpdateConfigDTO = Econfig & Econfig[];
