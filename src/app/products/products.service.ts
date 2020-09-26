import { db } from '../../utils/database/database';
import { Injectable } from '@nestjs/common';
import { Eproducts, CreateProductsDTO, UpdateProductsDTO } from './products.entity';
import { fill_created_date } from 'src/utils/utils';
import { co_create, co_update, co_delete } from 'src/shared/services';

@Injectable()
export class ProductsService {
  // >----------------------------------------<
  async getAll() {
    const list = await db
      .es_slc<Eproducts>(<any>'products')
      .o('i', 'DESC')
      .x();
    return list;
  }
  // >----------------------------------------<
  // handleErrors(err) {
  //   if (pg_is_uniqe_violation(err, 'code')) throw new HttpException({ msg: 'الكود مكرر' }, HttpStatus.CONFLICT);
  //   // console.log('err', err);
  //   throw err;
  // }
  // >------------------<
  async normRows(rws: Eproducts[], isUpdate = false) {
    // const parentsIds = mapWithoutZeros(rws, (r) => r.parent_id);
    // let parentsList = [];
    // if (parentsIds.length) parentsList = await db.es_slc<Eproducts>('products').w('i', parentsIds).x();
    rws.forEach(async (rw) => {
      // ----------------
      if (rw.is_auto === undefined) rw.is_auto = 0;
      if (!isUpdate) fill_created_date(rw);
      // ----------------
    });
  }
  // >----------------------------------------<
  // create
  async create(productsBody: CreateProductsDTO) {
    const index: any = 'products';
    let res: Eproducts[] = await co_create(this, index, productsBody);
    return res;
  }
  // >----------------------------------------<
  // update
  async update(id: number, productsBody: UpdateProductsDTO, user_id: number) {
    const index: any = 'products';
    let res: Eproducts[] = await co_update({ that: this, table: index, id, body: productsBody, user_id });
    return res;
  }
  // >----------------------------------------<
  // delete
  async delete(id: number) {
    const index: any = 'products';
    let res = await co_delete(this, index, id);
    return res;
  }
  // >------------------<
  // async deleteValidation(id: number) {}
  // >----------------------------------------<
}
