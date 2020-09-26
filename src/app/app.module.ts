import { VouchersService } from './vouchers/vouchers.service';
import { VouchersModule } from './vouchers/vouchers.module';
import { AuthService } from './../shared/auth/auth.service';
import { AuthModule } from './../shared/auth/auth.module';
import { Users_groupService } from './users_group/users_group.service';
import { Users_groupModule } from './users_group/users_group.module';
import { J_entriesService } from './j_entries/j_entries.service';
import { J_entriesModule } from './j_entries/j_entries.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsCategoryController } from './products-category/products-category.controller';
import { ProductsCategoryModule } from './products-category/products-category.module';
import { TreasuryService } from './treasury/treasury.service';
import { TreasuryModule } from './treasury/treasury.module';
import { TreeModule } from './tree/tree.module';
import { TreeService } from './tree/tree.service';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ProductsCategoryModule,
    TreasuryModule,
    TreeModule,
    J_entriesModule,
    UsersModule,
    Users_groupModule,
    AuthModule,
    VouchersModule,
  ],
  controllers: [AppController, ProductsCategoryController],
  providers: [
    AppService,
    TreasuryService,
    TreeService,
    J_entriesService,
    UsersService,
    Users_groupService,
    AuthService,
    VouchersService,
  ],
})
export class AppModule {}
