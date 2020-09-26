import { DBStorage } from './DBStorage';
import { PrimaryGeneratedColumn } from 'typeorm';
export default function PrimaryColumn(options?: any) {
  return function(object: any, propertyName: string) {
    DBStorage.setColumn({
      object,
      target: object.constructor,
      propertyName: propertyName,
      // mode: 'primary',
      mode: 'regular',
      options: { ...options, primary: true },
    });
    PrimaryGeneratedColumn(options)(object, propertyName);
  };
}
