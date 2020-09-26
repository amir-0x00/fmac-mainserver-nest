import * as bodybuilder from 'bodybuilder';
import { w_oprs } from '../database';

export interface ObjectLiteral {
  [key: string]: any;
}

export class es_where<Entity extends ObjectLiteral> {
  protected es_type = '';
  private whereStr = '';
  protected w_list: [];
  protected whr_id = '';
  constructor(private nested = false, protected qry: bodybuilder.Bodybuilder = bodybuilder()) {}

  // private appendLogicOpr(logic: string) {
  //   if (this.whereStr.length) {
  //     this.whereStr += ` ${this.logicOpr(logic)}`;
  //   }
  // }
  // private logicOpr(logic: string) {
  //   return logic == '&' ? 'AND' : 'OR';
  // }

  protected clearWhare() {
    this.whereStr = '';
  }

  private wNorm(list: any[], logic = '&') {
    const [first] = list;
    if (typeof first === 'function') {
      // on id only, example w(w => w.wAnd('gi',2).wOr('ty',1))
      let pre_clause = this.logicOpr(logic),
        clause = 'Filter';
      this.qry[pre_clause + clause]('bool', (q) => {
        const nestedWhere = new es_where<Entity>(true, <bodybuilder.Bodybuilder>q);
        first(nestedWhere);
        return q;
      });
    } else if (list.length === 1) {
      // on id only, example w(150)
      const obj = list[0];
      if (typeof obj === 'object' && !Array.isArray(obj)) {
        for (const key in obj) {
          const val = obj[key];
          this.wParse([key, val], logic);
        }
      } else {
        if (this.es_type === 'db_es_upd' || this.es_type === 'db_es_del') {
          this.whr_id = first;
        } else {
          this.qry.filter('term', 'i', first);
        }
      }
    } else {
      this.wParse(list, logic);
    }
  }

  /** Where */
  w(obj: Partial<Entity>): this;
  w(nest: (w: es_where<Entity>) => es_where<Entity>): this;
  w(id: number): this;
  w(col: keyof Entity, value: any): this;
  w(col: keyof Entity, opr: w_oprs, value?: any): this;
  w(...list: any[]) {
    this.wNorm(list);
    return this;
  }

  wOr(nest: (w: es_where<Entity>) => es_where<Entity>): this;
  wOr(id: number): this;
  wOr(col: keyof Entity, value: any): this;
  wOr(col: keyof Entity, opr: w_oprs, value?: any): this;
  wOr(...list: any[]) {
    this.wNorm(list, '|');
    return this;
  }

  wAnd(nest: (w: es_where<Entity>) => es_where<Entity>): this;
  wAnd(id: number): this;
  wAnd(col: keyof Entity, value: any): this;
  wAnd(col: keyof Entity, opr: w_oprs, value?: any): this;
  wAnd(...list: any[]) {
    this.wNorm(list);
    return this;
  }

  protected wParse(list: any[], logic = '&') {
    let [col, opr, val] = list,
      pre_clause = this.logicOpr(logic),
      clause = 'Filter',
      method_name = 'term';
    if (list.length == 2) {
      val = opr;
      opr = '=';
    }
    let cvl = val;
    if (Array.isArray(val)) {
      method_name = 'terms';
    } else if (opr !== '=') {
      switch (<w_oprs>opr) {
        case '>':
          method_name = 'range';
          cvl = { gt: cvl };
          break;
        case '>=':
          method_name = 'range';
          cvl = { gte: cvl };
          break;
        case '<':
          method_name = 'range';
          cvl = { lt: cvl };
          break;
        case '<=':
          method_name = 'range';
          cvl = { lte: cvl };
          break;
        case '!=':
          pre_clause = 'not';
          break;
      }
    }
    // if (Array.isArray(val)) method_name = 'terms';
    this.qry[pre_clause + clause](method_name, col, cvl);
  }

  private logicOpr(logic: string) {
    return logic == '&' ? 'and' : 'or';
  }
}
