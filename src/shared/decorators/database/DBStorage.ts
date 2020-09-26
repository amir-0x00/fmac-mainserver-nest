import * as fs from 'fs';
import { isEqual, cloneDeep, merge } from 'lodash';

import { db } from 'src/utils/database/database';

import { ISubEntity } from './SubEntity';
import { IColumn } from './Column';
import { IEntity } from './Entity';
import {
  IESMapProperty,
  IESMapping,
  IESMappingProperties,
  es_getmap,
  IESMappingList,
} from 'src/utils/database/elasticsearch/es_map';

// ---------------------------
// #region
interface getEntity_return {
  entity: IEntity;
  columnsList: IColumn[];
}

interface ISchema {
  columns: IColumn[];
  entities: IEntity[];
  subEntities: ISubEntity[];
}

type IDefaultsKeys = 'primary' | 'int' | 'text' | 'date' | 'datetime' | 'timestamp' | 'long' | 'float' | 'keyword';
type IDefaults = {
  [key in IDefaultsKeys]: IESMapProperty;
};
// #endregion
// ---------------------------

// ---------------------------
// #region
interface Ies_colNorm_return {
  body: IESMapProperty;
  isNew: boolean;
  isDiff: boolean;
  old?: IESMapProperty;
}
interface IColsAfterCompare extends Ies_colNorm_return {
  name: string;
}
interface IChangedIndex {
  name: string;
  cols: IColsAfterCompare[];
  isNew: boolean;
}
// #endregion
// ---------------------------

export class DBStorage {
  static readonly defaults: IDefaults = {
    primary: { type: 'long', fields: { keyword: { type: 'keyword' } } },
    text: {
      type: 'text',
      fields: {
        key: {
          type: 'text',
          analyzer: 'arabic_clear_keyword',
        },
      },
      analyzer: 'arabic_clear',
    },
    int: {
      type: 'integer',
    },
    keyword: {
      type: 'keyword',
    },
    long: {
      type: 'long',
    },
    float: {
      type: 'float',
    },
    date: {
      type: 'date',
      // "format": "yyyy-MM-dd"
      format: 'yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis',
    },
    datetime: {
      type: 'date',
      format: 'yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis',
    },
    timestamp: {
      type: 'date',
      format: 'yyyy-MM-dd HH:mm:ss||strict_date_optional_time||epoch_millis',
    },
  };

  private static schema: ISchema = {
    columns: [],
    entities: [],
    subEntities: [],
  };
  private static currentESindices: IESMappingList;
  private static changedList: IChangedIndex[] = [];
  // private static getESindices = false;
  static setColumn(data: IColumn) {
    // console.log('data', data);
    this.schema.columns.push(data);
    this.getColumns(data);
  }

  static getColumns(data: IColumn) {
    // TODO
    // if (!Object.getOwnPropertyDescriptor(data.object, '_sqtMetadata')) {
    //   data.object._sqtMetadata = {};
    // }
    // if (data.object._sqtMetadata.properties) {
    //   data.object._sqtMetadata.properties[data.propertyName] = data.options.type;
    // } else {
    //   data.object._sqtMetadata.properties = {
    //     [data.propertyName]: data.options.type,
    //   };
    // }
    // const parentobject = Object.getPrototypeOf(data.object);
    // const parentData = parentobject._sqtMetadata;
    // if (parentData) {
    //   if (parentData.properties) {
    //     Object.keys(parentData.properties).forEach(key => {
    //       if (!data.object._sqtMetadata.properties[key]) {
    //         data.object._sqtMetadata.properties[key] =
    //           parentData.properties[key];
    //       }
    //     });
    //   }
    // }
    // console.log('data.object', data.object._sqtMetadata);
  }

  static getColumnList(target: any) {
    const list = this.schema.columns.filter((r) => {
      // console.log('r', r);
      return r.target === target;
    });
    for (let i = 0; i < list.length; i++) {
      const col = list[i];
      if (col.options.es_class) col.subColumns = this.getColumnList(col.options.es_class);
      else {
        const metaData = Reflect.getMetadata('design:type', col.object, col.propertyName);
        const isClass = metaData.toString().startsWith('class');
        if (isClass) col.subColumns = this.getColumnList(metaData);
      }
    }
    return list;
  }

  static setEntity(data: IEntity) {
    // console.log('data', data);
    if (data.opts?.noES) return;
    this.schema.entities.push(data);
    // console.log('process.env.FMT_CLI', process.env.FMT_CLI);
    if (process.env.FMT_CLI && process.env.FMT_CLI === '1') return this.compEntity(data.name);
  }
  static setSubEntity(data: ISubEntity) {
    this.schema.subEntities.push(data);
  }

  static getEntity(name: string): getEntity_return {
    const entity = this.schema.entities.find((r) => r.name == name);
    const columnsList = this.getColumnList(entity.target);

    return { entity, columnsList };
  }

  private static async compEntity(name: string) {
    const { entity, columnsList } = this.getEntity(name);
    // setTimeout(async () => {
    // console.log('before sleep');
    await this.es_wait();
    await this.es_getDiffs(entity, columnsList);
    // console.log('after sleep');
    // }, 1000);
    // } else {
    // this.es_getDiffs(entity, columnsList);
    // }
  }

  public static async es_wait() {
    return new Promise(async (ok) => {
      // console.log('db.es_connected', db.es_connected);
      if (db.es_connected) return ok(true);
      else if (process.env.FMT_CLI) await db.es_connect();
      let interval = setInterval(() => {
        if (db.es_connected) {
          ok(true);
          clearInterval(interval);
        }
      }, 200);
    });
  }

  private static async es_getDiffs(entity: IEntity, entity_map: IColumn[]) {
    if (!this.currentESindices) this.currentESindices = await es_getmap('_all');
    // console.log('this.currentESindices', this.currentESindices);
    // console.log('r', entity);
    // console.dir(columns, { depth: null });
    const current_map = this.currentESindices[entity.name];
    const res_map = this.es_diffCols(current_map, entity_map);

    let isNewIndex = false,
      changedIndex: IChangedIndex = {
        name: entity.name,
        cols: res_map,
        isNew: !current_map,
      };
    // if (current_map) {
    //   console.log(entity.name + ' found');
    //   // console.log(res_map);
    //   if (Object.keys(res_map).length) {
    //     // await es_remap(entity.name, res_map);
    //     // console.log('res_map', res_map);
    //     // console.log('res_map');
    //     // console.dir(res_map, { depth: null });
    //   }
    // } else {
    //   console.log(entity.name + ' not found');
    //   isNewIndex = true;
    //   // await es_create(entity.name, res_map);
    // }

    // console.log('changedIndex', changedIndex);
    this.changedList.push(changedIndex);
    // this.appendToFile('1597865174864-new.ts', changedIndex, isNewIndex);
    // console.log('>-------------------------<');
    // this.defaults.primary;
    // console.log('lodash', lodash);
    // const comp = isEqual();
    // console.log('comp', comp);

    // console.log('this.currentESindices', this.currentESindices);
    // this.currentESindices.
    // console.log('columnsList', columns);
    // console.log('entity', entity);
  }

  private static es_diffCols(current_map: IESMapping, entity_map: IColumn[]): IColsAfterCompare[] {
    const c_map = current_map?.mappings.properties,
      e_map = entity_map,
      n_map: IColsAfterCompare[] = [];
    // let modified_map = {};

    e_map.forEach((e_col) => {
      const c_col = c_map && c_map[e_col.propertyName];
      // console.log('IColumn[]', e_col);
      // console.log('c_find', c_col);
      // if (c_col) {
      const new_col_map = this.es_colNorm(e_col, c_col);
      // new_col: IESMappingProperties = {
      //   [e_col.propertyName]: new_col_map.body,
      // };
      // console.log('new_col_map', e_col.propertyName, new_col_map);
      if (new_col_map.isDiff) n_map.push({ ...new_col_map, name: e_col.propertyName });
      // if (new_col_map !== null) modified_map = { ...modified_map, ...new_col };
      // console.log('new_col');
      // console.dir(new_col, { depth: null });
      // }
    });

    // const newCols = n_map.filter(r => r.isNew);
    // console.log('newCols');
    // console.dir(newCols, { depth: null });
    // const reCols = n_map.filter(r => !r.isNew && r.isDiff);
    // console.log('reCols');
    // console.dir(reCols, { depth: null });
    // console.log('n_map');
    // console.dir(n_map, { depth: null });
    return n_map;
    // console.log('es_diffCols', entity_map, '\n\n\n', c_map);
    // console.log('es_diffCols', c_map);
  }

  private static es_colNorm(e_col: IColumn, c_col?: IESMapProperty): Ies_colNorm_return {
    let dist_map: Partial<IESMapProperty> = {};
    const type = e_col.options.type;
    if (e_col.options.primary) {
      dist_map = cloneDeep(this.defaults.primary);
      // console.log('dist_map', dist_map, this.defaults.primary);
      // }else if(e_col.options.type)
    } else if (e_col.options.es_map) {
      dist_map = e_col.options.es_map;
    } else if (e_col.options.es_type) {
      dist_map = { type: e_col.options.es_type };
    } else if (
      type === 'text' ||
      type === 'float' ||
      type === 'int' ||
      type === 'long' ||
      type === 'timestamp' ||
      type === 'datetime' ||
      type === 'date'
    ) {
      dist_map = cloneDeep(this.defaults[type]);
      if (e_col.options.es_assign) {
        dist_map = merge(dist_map, e_col.options.es_assign);
      }
    } else if (type === 'json' && e_col.subColumns) {
      // console.log('e_col.subColumns', e_col.subColumns);
      dist_map = { properties: {} };
      // TODO
      e_col.subColumns.forEach((subCol) => {
        dist_map.properties[subCol.propertyName] = {
          ...this.es_colNorm(subCol).body,
        };
      });
    }
    // console.log('e_col.options.type', e_col.propertyName, e_col.options.type);
    // console.log('c_col', c_col, !c_col, isEqual(dist_map, c_col));
    let isNew = !c_col;
    // console.dir(c_col, { depth: null });
    const isDiff = !isNew ? !isEqual(dist_map, c_col) : true;
    // console.log('isNew', isNew, isDiff, e_col.propertyName);
    return { body: <IESMapProperty>dist_map, isNew, old: c_col, isDiff };
    // console.log('e_col', e_col, 'c_col', c_col);
  }

  public static appendToFile(fileName: string) {
    let filePath = fileName;
    let fileContent = fs.readFileSync(filePath, 'utf-8'),
      splitLines = fileContent.split('\n');
    // add imports
    const importList = [
      `import { es_remap, es_map_delete_cols, es_drop_index, es_create } from './../utils/database/elasticsearch';`,
      `import { db } from 'src/utils/database/database';`,
    ];
    // console.log('changedList', this.changedList);
    importList.reverse().forEach((imp) => {
      if (splitLines.indexOf(imp) < 0) splitLines.unshift(imp);
    });
    // >------------------------------<

    // console.log('this.changedList', this.changedList);
    this.changedList.forEach((changedIndex) => {
      this.appendUpQuery(splitLines, changedIndex);
      this.appendDownQuery(splitLines, changedIndex);
    });
    this.appendUpQuery(splitLines);
    this.appendDownQuery(splitLines);
    // console.log(splitLines);

    fs.writeFileSync(filePath, splitLines.join('\n'));
    // console.log('fileContent', splitLines, upFunctionLine, indentSize);
    // console.log('file', fileName);
  }
  private static appendUpQuery(content: string[], changedIndex?: IChangedIndex) {
    const FunctionLine = content.findIndex((r) => r.includes('public async up(queryRunner:'));
    const indentSize = content[FunctionLine].match(/^\s+/)[0].length + 4,
      startIntends = ' '.repeat(indentSize);
    const connectFunc = `${startIntends}await db.es_connect('up')`;

    if (!changedIndex && content.indexOf(connectFunc) < 0) return content.splice(FunctionLine + 1, 0, connectFunc);

    const upMap: IESMappingProperties = {},
      funcName = changedIndex.isNew ? 'es_create' : 'es_remap';
    if (changedIndex.cols.length) {
      changedIndex.cols.forEach((r) => {
        upMap[r.name] = r.body;
      });

      const comment = changedIndex.isNew
        ? `create '${changedIndex.name}' index`
        : `remap '${Object.keys(upMap).join(', ')}' columns of '${changedIndex.name}' index`;
      const upRemap = `${startIntends}//${comment}\n${startIntends}await ${funcName}('${
        changedIndex.name
      }', ${JSON.stringify(upMap)});`;
      // console.log('cols', JSON.stringify(upMap));

      content.splice(FunctionLine + 1, 0, upRemap);
    }
  }
  private static appendDownQuery(content: string[], changedIndex?: IChangedIndex) {
    const FunctionLine = content.findIndex((r) => r.includes('public async down(queryRunner:'));
    const indentSize = content[FunctionLine].match(/^\s+/)[0].length + 4,
      startIntends = ' '.repeat(indentSize),
      connectFunc = `${startIntends}await db.es_connect('down')`;

    if (!changedIndex && content.indexOf(connectFunc) < 0) return content.splice(FunctionLine + 1, 0, connectFunc);

    if (changedIndex.isNew) {
      const downDrop = `${startIntends}// drop '${changedIndex.name}' index\n${startIntends}await es_drop_index('${changedIndex.name}');`;
      content.splice(FunctionLine + 1, 0, downDrop);
    } else {
      const downEditCols: IESMappingProperties = {};
      const downDeleteCols: string[] = [];
      changedIndex.cols.forEach((r) => {
        if (r.isNew) {
          downDeleteCols.push(r.name);
        } else {
          downEditCols[r.name] = r.old;
        }
      });
      if (Object.keys(downEditCols).length) {
        const downRemap = `${startIntends}// revert '${Object.keys(downEditCols).join(', ')}' columns of '${
          changedIndex.name
        }' map\n${startIntends}await es_remap('${changedIndex.name}', ${JSON.stringify(downEditCols)});`;
        content.splice(FunctionLine + 1, 0, downRemap);
      }
      if (downDeleteCols.length) {
        const downDelete = `${startIntends}// delete '${downDeleteCols.join(', ')}' columns of '${
          changedIndex.name
        }' index\n${startIntends}await es_map_delete_cols('${changedIndex.name}', ${JSON.stringify(downDeleteCols)});`;
        content.splice(FunctionLine + 1, 0, downDelete);
      }
    }
  }
}
