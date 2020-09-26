import { table_names } from '../../utils/database/database';
import { CoUpdate_base } from './CoUpdate_base';
import { CoCreate_base } from './CoCreate_base';
import { applyMixins } from './applyMixins';
import { CoDelete_base } from './CoDelete_base';

export class BaseService {}
export interface BaseService extends CoUpdate_base, CoCreate_base, CoDelete_base {}
applyMixins(BaseService, [CoUpdate_base, CoCreate_base, CoDelete_base]);

export interface IBaseService {
  table: table_names;
  normRows?(rws: any, isUpdate?: boolean): Promise<void>;
  handleErrors?(err: any): void;
  deleteValidation?(id: number | number[]): Promise<void>;
}
