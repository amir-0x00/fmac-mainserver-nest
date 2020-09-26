import { pg_error } from './../../../shared/constrants';
export const pg_is_uniqe_violation = (err: any, column: string) =>
  err.code === pg_error.UNIQUE_VIOLATION && err.constraint.toString().split('__')[1] === column;
