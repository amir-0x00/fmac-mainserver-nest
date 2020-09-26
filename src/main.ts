import { CacheManager } from './shared/cache/CacheManager';
import { IoInterceptor } from './shared/interceptors/io.interceptor';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { db } from './utils/database/database';
import io from './shared/scoket/io';
import * as moment from 'moment-hijri';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { EJAutoNotes, JEntry } from './app/j_entries/j_entries.create';
import { ECol__credit_debit } from './shared/types/Columns';
import { Ej_entries__j_type } from './app/j_entries/j_entries.entity';
import { Ej_e_items__nest_type } from './app/j_entries/j_entries_items.entity';

moment.locale('en-US', {
  week: { dow: 6 },
  // meridiem: (hours, minutes, isLower) => (hours < 12 ? 'ص' : 'م'),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new IoInterceptor());
  // ------------------------
  // app.getHttpServer()
  io.create(app.getHttpServer());
  await db.connect();
  // ------------------------
  await CacheManager.fetch('treasury');
  // ------------------------
  await app.listen(3000);
  // ------------------------
  // new JEntry('treasury', {
  //   notes_txt: EJAutoNotes.treasury_initial_balance,
  //   notes_id: 2,
  //   notes_nm: 'خزنة نقطة البيع',
  //   index: 'treasury',
  //   // revese: true,
  // })
  //   .set_bdy({ date: { date: '2020-09-10' }, user: <any>1, type: Ej_entries__j_type.treasury_initial_balance })
  //   .set_itms([
  //     {
  //       tree_id: 1,
  //       amount: 200,
  //       tree_nest_id: 2,
  //       type: ECol__credit_debit.credit,
  //       tree_nest_type: Ej_e_items__nest_type.treasury,
  //     },
  //     { tree_id: 2, amount: 200, type: ECol__credit_debit.debit },
  //   ])
  //   .x();
  // ------------------------
  // const list = [{ i: 0 }, { i: 0 }, { i: 0 }, { i: 0 }, { i: 0 }, { i: 0 }];
  // const mapeList = mapWithoutZeros(list, r => r.i);
  // console.log('mapeList', mapeList);
  // ------------------------
  // console.time('es_slc');
  // const res4 = await db
  //   .es_ins('products', [
  //     { i: 501, nm: 'xeee', gi: 1 },
  //     { i: 502, nm: 'xeee 9', gi: 2 },
  //   ])
  //   .x();
  // console.timeEnd('es_slc');
  // console.log('res', res4);
  // ------------------------
}
bootstrap();
