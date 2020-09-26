import { Entity } from 'typeorm';
import { DBStorage } from './DBStorage';

export interface ISubEntity {
  target: any;
  // name: string;
}

export default function() {
  return function(target) {
    // const options =
    //   (typeof nameOrOptions === 'object' ? nameOrOptions : maybeOptions) || {};
    // const name =
    //   typeof nameOrOptions === 'string' ? nameOrOptions : options.name;
    // console.log('e', name);

    DBStorage.setSubEntity({ target });
    // Entity(nameOrOptions, maybeOptions)(target);
    // console.log('options', options);
    // console.log('object', object);
    // console.log('propertyName', propertyName);
    // console.log('-----------------------------------');
  };
}
