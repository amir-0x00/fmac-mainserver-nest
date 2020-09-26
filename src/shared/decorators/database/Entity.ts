import { table_names } from './../../../utils/database/database';
import { Entity as ORMEntity } from 'typeorm';
import { DBStorage } from './DBStorage';

export interface IEntity {
  target: any;
  name: table_names;
  opts: IEntity_Options;
}

interface IEntity_Options {
  noES?: boolean;
  name?: table_names;
}

export default function Entity(nameOrOptions, maybeOptions?: IEntity_Options) {
  return function (target) {
    const options = (typeof nameOrOptions === 'object' ? nameOrOptions : maybeOptions) || {};
    const name = typeof nameOrOptions === 'string' ? nameOrOptions : options.name;
    // console.log('e', name);

    DBStorage.setEntity({ target, name, opts: maybeOptions });
    ORMEntity(nameOrOptions, maybeOptions)(target);
  };
}
