import * as moment from 'moment-hijri';
import { db } from './database/database';

export const isDev = process.env.NODE_DEV || false;

export function mapWithoutZeros<T>(list: T[], cb: (r: T) => number) {
  return list.map(cb).filter((r) => r != 0);
}

export function sleep(ms: number) {
  return new Promise((ok) => setTimeout(ok, ms));
}

export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function dateTime(date?: Date | string): string {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

export function date(date?: Date | string): string {
  return moment(date).format('YYYY-MM-DD');
}

interface IurlParseReturn {
  action: 'edit' | 'add' | 'delete';
  tableName: string;
  id: string;
}

export function urlExtractData(url: string): IurlParseReturn {
  const [, tableName, action, id]: any = url.split('/');
  return { action, tableName, id };
}

export function fill_created_date(rw: any) {
  if (!rw.date) rw.date = {};
  rw.date.created_date = dateTime();
}

export function get_user_i_nm(i: number): any {
  return db.subEnt<any>('users').c('i', 'name').w(i);
}
