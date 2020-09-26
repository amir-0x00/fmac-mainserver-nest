import { es_remap, es_map_delete_cols, es_drop_index, es_create } from './../utils/database/elasticsearch';
import { db } from 'src/utils/database/database';
import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1601086479253 implements MigrationInterface {
    name = 'initial1601086479253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await db.es_connect('up')
        //create 'users' index
        await es_create('users', {"i":{"type":"long","fields":{"keyword":{"type":"keyword"}}},"name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"},"user_name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"},"password":{"type":"keyword"},"group":{"properties":{"i":{"type":"integer"},"name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"}}},"dl":{"type":"integer"}});
        //create 'tree' index
        await es_create('tree', {"i":{"type":"long","fields":{"keyword":{"type":"keyword"}}},"code":{"type":"keyword"},"name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"},"closing_account":{"type":"integer"},"parent_id":{"type":"integer"},"parent_list":{"type":"integer"},"level":{"type":"integer"},"normal_balance":{"type":"integer"},"type":{"type":"integer"},"disabled":{"type":"integer"},"debit":{"type":"float"},"credit":{"type":"float"},"dl":{"type":"integer"}});
        //create 'imp_vouchers' index
        await es_create('imp_vouchers', {"i":{"type":"long","fields":{"keyword":{"type":"keyword"}}},"entity_type":{"type":"integer"},"entity":{"properties":{"i":{"type":"integer"},"name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"}}},"payment_type":{"type":"integer"},"payment":{"properties":{"i":{"type":"integer"},"name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"}}},"cost_center":{"type":"integer"},"amount":{"type":"float"},"reciver_name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"},"tags":{"type":"keyword"},"date":{"properties":{"date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},"created_date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},"modified_date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},"deleted_date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"}}},"is_auto":{"type":"integer"},"user":{"properties":{"i":{"type":"integer"},"name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"}}},"dl":{"type":"integer"}});
        //create 'exp_vouchers' index
        await es_create('exp_vouchers', {"i":{"type":"long","fields":{"keyword":{"type":"keyword"}}},"entity_type":{"type":"integer"},"entity":{"properties":{"i":{"type":"integer"},"name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"}}},"payment_type":{"type":"integer"},"payment":{"properties":{"i":{"type":"integer"},"name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"}}},"cost_center":{"type":"integer"},"amount":{"type":"float"},"reciver_name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"},"tags":{"type":"keyword"},"date":{"properties":{"date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},"created_date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},"modified_date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},"deleted_date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"}}},"is_auto":{"type":"integer"},"user":{"properties":{"i":{"type":"integer"},"name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"}}},"dl":{"type":"integer"}});
        //create 'users_group' index
        await es_create('users_group', {"i":{"type":"long","fields":{"keyword":{"type":"keyword"}}},"name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"},"dl":{"type":"integer"}});
        //create 'treasury' index
        await es_create('treasury', {"i":{"type":"long","fields":{"keyword":{"type":"keyword"}}},"name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"},"initial_balance":{"type":"float"},"balance":{"type":"float"},"date":{"properties":{"date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},"created_date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},"modified_date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},"deleted_date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"}}},"dl":{"type":"integer"}});
        //create 'j_entries_items' index
        await es_create('j_entries_items', {"i":{"type":"long","fields":{"keyword":{"type":"keyword"}}},"entry_id":{"type":"integer"},"note":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"},"note_data":{"properties":{"i":{"type":"integer"},"table":{"type":"keyword"}}},"j_note":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"},"j_note_data":{"properties":{"i":{"type":"integer"},"table":{"type":"keyword"}}},"tags":{"type":"keyword"},"type":{"type":"integer"},"tree_id":{"type":"integer"},"tree_nest_id":{"type":"integer"},"tree_nest_type":{"type":"integer"},"j_type":{"type":"integer"},"amount":{"type":"float"},"date":{"properties":{"date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},"created_date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},"modified_date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},"deleted_date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"}}},"is_auto":{"type":"integer"},"cost_center_id":{"type":"integer"},"user":{"properties":{"i":{"type":"integer"},"name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"}}},"dl":{"type":"integer"}});
        //create 'products' index
        await es_create('products', {"i":{"type":"long","fields":{"keyword":{"type":"keyword"}}},"name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"},"entity_type":{"type":"integer"},"entity":{"properties":{"i":{"type":"integer"},"name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"}}},"payment_type":{"type":"integer"},"payment":{"properties":{"i":{"type":"integer"},"name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"}}},"cost_center":{"type":"integer"},"amount":{"type":"float"},"reciver_name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"},"tags":{"type":"keyword"},"date":{"properties":{"date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},"created_date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},"modified_date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},"deleted_date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"}}},"is_auto":{"type":"integer"},"user":{"properties":{"i":{"type":"integer"},"name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"}}},"dl":{"type":"integer"}});
        //create 'products_category' index
        await es_create('products_category', {"i":{"type":"long","fields":{"keyword":{"type":"keyword"}}},"name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"},"meta":{"properties":{"color":{"type":"keyword"},"icon":{"type":"keyword"}}},"dl":{"type":"integer"}});
        //create 'j_entries' index
        await es_create('j_entries', {"i":{"type":"long","fields":{"keyword":{"type":"keyword"}}},"amount":{"type":"float"},"note":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"},"note_data":{"properties":{"i":{"type":"integer"},"table":{"type":"keyword"}}},"tags":{"type":"keyword"},"date":{"properties":{"date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},"created_date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},"modified_date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},"deleted_date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"}}},"is_auto":{"type":"integer"},"type":{"type":"integer"},"user":{"properties":{"i":{"type":"integer"},"name":{"type":"text","fields":{"key":{"type":"text","analyzer":"arabic_clear_keyword"}},"analyzer":"arabic_clear"}}},"dl":{"type":"integer"},"old_log":{"properties":{"i":{"type":"integer"},"date":{"type":"date","format":"yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis"},"user_id":{"type":"integer"},"data":{"type":"keyword"}}}});
        await queryRunner.query(`CREATE TABLE "config" ("i" SERIAL NOT NULL, "name" text NOT NULL, "value" json NOT NULL, CONSTRAINT "PK_0e7c03e1c0009025df71413cd15" PRIMARY KEY ("i"))`);
        await queryRunner.query(`CREATE TABLE "j_entries" ("i" SERIAL NOT NULL, "amount" double precision NOT NULL DEFAULT 0, "note" text NOT NULL, "note_data" json NOT NULL, "tags" json NOT NULL DEFAULT '[]', "date" json NOT NULL, "is_auto" integer NOT NULL, "type" integer NOT NULL DEFAULT -1, "user" json NOT NULL, "dl" integer NOT NULL DEFAULT 0, "old_log" json NOT NULL DEFAULT '[]', CONSTRAINT "PK_a1931ecd699fa2078d6f94b8b6e" PRIMARY KEY ("i"))`);
        await queryRunner.query(`CREATE TABLE "j_entries_items" ("i" SERIAL NOT NULL, "entry_id" integer NOT NULL, "note" text NOT NULL DEFAULT '', "note_data" json NOT NULL DEFAULT '[]', "j_note" text NOT NULL DEFAULT '', "j_note_data" json NOT NULL DEFAULT '[]', "tags" json NOT NULL DEFAULT '[]', "type" integer NOT NULL, "tree_id" integer NOT NULL, "tree_nest_id" integer NOT NULL DEFAULT 0, "tree_nest_type" integer NOT NULL DEFAULT 0, "j_type" integer NOT NULL DEFAULT -1, "amount" double precision NOT NULL, "date" json NOT NULL, "is_auto" integer NOT NULL, "cost_center_id" integer NOT NULL DEFAULT 1, "user" json NOT NULL, "dl" integer NOT NULL DEFAULT 0, CONSTRAINT "PK_1e114c1a3859f71b2204eee6e2a" PRIMARY KEY ("i"))`);
        await queryRunner.query(`CREATE TABLE "products_category" ("i" SERIAL NOT NULL, "name" text NOT NULL, "meta" json NOT NULL, "dl" integer NOT NULL DEFAULT 0, CONSTRAINT "PK_6e9ad5853db5e512d78c432c853" PRIMARY KEY ("i"))`);
        await queryRunner.query(`CREATE TABLE "products" ("i" SERIAL NOT NULL, "name" text NOT NULL, "entity_type" integer NOT NULL, "entity" json NOT NULL, "payment_type" integer NOT NULL, "payment" json NOT NULL, "cost_center" integer NOT NULL, "amount" double precision NOT NULL, "reciver_name" text NOT NULL, "tags" json NOT NULL DEFAULT '[]', "date" json NOT NULL, "is_auto" integer NOT NULL, "user" json NOT NULL, "dl" integer NOT NULL DEFAULT 0, CONSTRAINT "PK_bdfcefa4f8e754302552735a0d2" PRIMARY KEY ("i"))`);
        await queryRunner.query(`CREATE TABLE "treasury" ("i" SERIAL NOT NULL, "name" text NOT NULL, "initial_balance" double precision NOT NULL, "balance" double precision NOT NULL, "date" json NOT NULL, "dl" integer NOT NULL DEFAULT 0, CONSTRAINT "PK_6c5795696b99f60a81cf4a7d34d" PRIMARY KEY ("i"))`);
        await queryRunner.query(`CREATE TABLE "tree" ("i" SERIAL NOT NULL, "code" text NOT NULL, "name" text NOT NULL, "closing_account" integer NOT NULL, "parent_id" integer NOT NULL, "parent_list" json NOT NULL DEFAULT '[]', "level" integer NOT NULL, "normal_balance" integer NOT NULL, "type" integer NOT NULL, "disabled" integer NOT NULL DEFAULT 0, "debit" double precision NOT NULL DEFAULT 0, "credit" double precision NOT NULL DEFAULT 0, "dl" integer NOT NULL DEFAULT 0, CONSTRAINT "PK_c0a2f2bb1e52e81c2274bb56eed" PRIMARY KEY ("i"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "Etree__code" ON "tree" ("code") WHERE dl = 0`);
        await queryRunner.query(`CREATE TABLE "users_group" ("i" SERIAL NOT NULL, "name" text NOT NULL, "dl" integer NOT NULL DEFAULT 0, CONSTRAINT "PK_15846f052f55acb2086369a87d0" PRIMARY KEY ("i"))`);
        await queryRunner.query(`CREATE TABLE "users" ("i" SERIAL NOT NULL, "name" text NOT NULL, "user_name" text NOT NULL, "password" text NOT NULL, "group" json NOT NULL, "dl" integer NOT NULL DEFAULT 0, CONSTRAINT "PK_49787a9c4311e6d475bdf8526c5" PRIMARY KEY ("i"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "Eusers__user_name" ON "users" ("user_name") WHERE dl = 0`);
        await queryRunner.query(`CREATE TABLE "exp_vouchers" ("i" SERIAL NOT NULL, "entity_type" integer NOT NULL, "entity" json NOT NULL, "payment_type" integer NOT NULL, "payment" json NOT NULL, "cost_center" integer NOT NULL, "amount" double precision NOT NULL, "reciver_name" text NOT NULL, "tags" json NOT NULL DEFAULT '[]', "date" json NOT NULL, "is_auto" integer NOT NULL, "user" json NOT NULL, "dl" integer NOT NULL DEFAULT 0, CONSTRAINT "PK_0a8a1286d8b0ae454790835d84f" PRIMARY KEY ("i"))`);
        await queryRunner.query(`CREATE TABLE "imp_vouchers" ("i" SERIAL NOT NULL, "entity_type" integer NOT NULL, "entity" json NOT NULL, "payment_type" integer NOT NULL, "payment" json NOT NULL, "cost_center" integer NOT NULL, "amount" double precision NOT NULL, "reciver_name" text NOT NULL, "tags" json NOT NULL DEFAULT '[]', "date" json NOT NULL, "is_auto" integer NOT NULL, "user" json NOT NULL, "dl" integer NOT NULL DEFAULT 0, CONSTRAINT "PK_390fc484f98d4ddb4308c612142" PRIMARY KEY ("i"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await db.es_connect('down')
        // drop 'users' index
        await es_drop_index('users');
        // drop 'tree' index
        await es_drop_index('tree');
        // drop 'imp_vouchers' index
        await es_drop_index('imp_vouchers');
        // drop 'exp_vouchers' index
        await es_drop_index('exp_vouchers');
        // drop 'users_group' index
        await es_drop_index('users_group');
        // drop 'treasury' index
        await es_drop_index('treasury');
        // drop 'j_entries_items' index
        await es_drop_index('j_entries_items');
        // drop 'products' index
        await es_drop_index('products');
        // drop 'products_category' index
        await es_drop_index('products_category');
        // drop 'j_entries' index
        await es_drop_index('j_entries');
        await queryRunner.query(`DROP TABLE "imp_vouchers"`);
        await queryRunner.query(`DROP TABLE "exp_vouchers"`);
        await queryRunner.query(`DROP INDEX "Eusers__user_name"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "users_group"`);
        await queryRunner.query(`DROP INDEX "Etree__code"`);
        await queryRunner.query(`DROP TABLE "tree"`);
        await queryRunner.query(`DROP TABLE "treasury"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "products_category"`);
        await queryRunner.query(`DROP TABLE "j_entries_items"`);
        await queryRunner.query(`DROP TABLE "j_entries"`);
        await queryRunner.query(`DROP TABLE "config"`);
    }

}
