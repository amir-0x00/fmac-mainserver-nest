import { w_oprs } from '../database';

// ---------------------------
export class pg_where<Entity> {
  private whereStr = '';
  protected w_list: [];
  constructor(private nested = false) {}

  private appendLogicOpr(logic: string) {
    if (this.whereStr.length) {
      this.whereStr += ` ${this.logicOpr(logic)}`;
    }
  }
  private logicOpr(logic: string) {
    return logic == '&' ? 'AND' : 'OR';
  }

  protected clearWhare() {
    this.whereStr = '';
  }

  private wNorm(list: any[], logic = '&') {
    const [first] = list;
    if (typeof first === 'function') {
      const nestedWhere = new pg_where<Entity>(true);
      first(nestedWhere);
      this.appendLogicOpr(logic);
      this.whereStr += ` (${nestedWhere.toString()})`;
    } else if (list.length === 1) {
      this.wParse(['i', first], '&');
      // } else if (Array.isArray(first)) { for (let i = 0; i < list.length; i++) { const rw = list[i]; this.wParse(rw, logic); }
    } else {
      this.wParse(list, logic);
    }
  }

  w(nest: (w: pg_where<Entity>) => pg_where<Entity>): this;
  w(id: number): this;
  w(col: keyof Entity, value: any): this;
  w(col: keyof Entity, opr: w_oprs, value?: any): this;
  w(...list: any[]) {
    this.wNorm(list);
    return this;
  }

  wOr(nest: (w: pg_where<Entity>) => pg_where<Entity>): this;
  wOr(id: number): this;
  wOr(col: keyof Entity, value: any): this;
  wOr(col: keyof Entity, opr: w_oprs, value?: any): this;
  wOr(...list: any[]) {
    this.wNorm(list, '|');
    return this;
  }

  wAnd(nest: (w: pg_where<Entity>) => pg_where<Entity>): this;
  wAnd(id: number): this;
  wAnd(col: keyof Entity, value: any): this;
  wAnd(col: keyof Entity, opr: w_oprs, value?: any): this;
  wAnd(...list: any[]) {
    this.wNorm(list);
    return this;
  }

  protected wParse(list: any[], logic = '&') {
    let [col, opr, val] = list;
    if (list.length == 2) {
      val = opr;
      opr = '=';
    }
    if (typeof val === 'object') val = `'${JSON.stringify(val)}'`;
    else if (typeof val === 'string') val = `'${val.replace(/'/g, "''")}'`;
    this.appendLogicOpr(logic);
    this.whereStr += ` ${col} ${opr} ${val}`;
  }

  protected get where() {
    let str = this.whereStr;
    if (!this.nested && str.length) str = ' WHERE' + str;
    return str;
  }

  private toString() {
    return this.whereStr;
  }
}
// ---------------------------
