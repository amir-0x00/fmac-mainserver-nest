import { Column as ORMColumn, Index } from 'typeorm';
import { DBStorage } from './DBStorage';
import { ColumnMode } from 'typeorm/metadata-args/types/ColumnMode';
import { IESMapProperty, ESTypes } from 'src/utils/database/elasticsearch/es_map';
import * as _ from 'lodash';

export interface IColumn {
  object: any;
  target: any;
  propertyName: string;
  mode: ColumnMode;
  options: IColumnOptions;
  // options: ColumnOptions;
  subColumns?: IColumn[];
}

type ColumnTypes =
  | 'int'
  | 'text'
  | 'date'
  | 'datetime'
  | 'timestamp'
  | 'long'
  | 'float'
  | 'json'
  | 'json[]'
  | 'keyword';

export interface IColumnOptions {
  type?: ColumnTypes;
  unique?: boolean;
  primary?: boolean;
  array?: boolean;
  default?: any;
  es_map?: IESMapProperty;
  es_class?: any;
  es_assign?: IESMapProperty;
  es_type?: ESTypes;
}

export default function Column(typeOrOptions?: IColumnOptions);
export default function Column(typeOrOptions?: ColumnTypes, options?: IColumnOptions);
export default function Column(typeOrOptions?: ColumnTypes | IColumnOptions, options?: IColumnOptions) {
  if (typeof typeOrOptions === 'string') {
    if (!options) options = {};
    options.type = <any>typeOrOptions;
  } else if (typeof typeOrOptions === 'object') {
    options = typeOrOptions;
  }

  if (options?.type === 'datetime') options.type = 'timestamp';

  return function (object: any, propertyName: string) {
    // console.log('c', propertyName);
    // console.log('object.constructor', object.constructor);
    DBStorage.setColumn({
      object,
      target: object.constructor,
      propertyName: propertyName,
      mode: 'regular',
      options,
    });

    const ormOptions = _.clone(options);
    const ormTypeOrOptions = _.clone(typeOrOptions);

    if (ormOptions.unique) {
      Index(object.constructor.name + '__' + propertyName, { unique: true, where: `dl = 0` })(object, propertyName);
      ormOptions.unique = false;
      if (typeof ormTypeOrOptions === 'object') {
        ormTypeOrOptions.unique = false;
      }
    }

    // const x = Reflect.getMetadata('design:type', object, propertyName);
    // console.log('x', x);
    ORMColumn(<any>ormTypeOrOptions, ormOptions)(object, propertyName);
    // console.log('options', options);
    // console.log('object', object);
    // console.log('propertyName', propertyName);
    // console.log('-----------------------------------');
  };
}
