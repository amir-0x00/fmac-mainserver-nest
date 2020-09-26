import { es_create } from './es_create';
import { es_connection, defaultType } from './es_common';
import { db, table_names_all, table_names } from '../database';
import * as _ from 'lodash';

// ---------------------------
// #region types
export type ESTypes =
  | 'integer'
  | 'text'
  | 'keyword'
  | 'long'
  | 'float'
  | 'date';
export interface IESMapProperty {
  type?: ESTypes;
  fields?: {
    [key: string]: {
      type: ESTypes;
      analyzer?: 'arabic_clear_keyword';
    };
  };
  analyzer?: 'arabic_clear';
  properties?: IESMappingProperties;
  format?: string;
}

export type IESMappingProperties = Record<string, IESMapProperty>;

export interface IESMapping {
  mappings: {
    properties: IESMappingProperties;
  };
}

export type IESMappingList = {
  [key in table_names]: IESMapping;
};
// #endregion
// ---------------------------
// #region es_getmap
export async function es_getmap(index: '_all'): Promise<IESMappingList>;
export async function es_getmap(
  index: table_names_all,
): Promise<IESMappingProperties>;
export async function es_getmap(
  index: table_names_all,
  get_all_data: 'all',
): Promise<IESMapping>;
export async function es_getmap(
  index: table_names_all,
  get_all_data: 'map_only',
): Promise<IESMappingProperties>;
export async function es_getmap(
  index: table_names_all,
  get_all_data: 'map_only' | 'all' = 'map_only',
): Promise<IESMapping | IESMappingProperties | IESMappingList> {
  const getMap = await db.es_que(c => c.indices.get({ index }));
  if (get_all_data === 'all' || index === '_all') {
    return getMap;
  }
  console.log('getMap', getMap);
  return getMap[index].mappings.properties;
}
// #endregion
// ---------------------------
interface es_remap_opts {
  reIndex?: boolean;
}
export const es_remap = async (
  index: table_names,
  assign_map: IESMappingProperties,
  options: es_remap_opts = {},
) => {
  const opts: es_remap_opts = Object.assign({ reIndex: false }, options);
  let reIndex = opts.reIndex;
  const current_map = await es_getmap(index),
    current_cols = Object.keys(current_map),
    assign_cols = Object.keys(assign_map),
    conflictList = _.intersection(current_cols, assign_cols);

  reIndex = reIndex || conflictList.length > 0;

  if (reIndex) {
    const tempIndex =
      index +
      '_' +
      Math.random()
        .toString()
        .replace('.', '');

    conflictList.forEach(ccol => {
      if (current_map[ccol].properties) {
        assign_map[ccol].properties = Object.assign(
          _.cloneDeep(current_map[ccol].properties),
          _.cloneDeep(assign_map[ccol].properties),
        );
      }
    });
    const fullMap: IESMappingProperties = Object.assign(
      _.cloneDeep(current_map),
      _.cloneDeep(assign_map),
    );
    await es_reindex(index, fullMap);
    console.log('done !!');
  } else {
    await es_connection.es_client.indices.putMapping(<any>{
      index,
      type: defaultType,
      include_type_name: true,
      body: { properties: assign_map },
    });
  }
};

// ---------------------------
interface es_reindex_opts {
  script?: string;
}
export const es_reindex = async (
  index: table_names,
  map: IESMappingProperties,
  options: es_reindex_opts = {},
) => {
  const opts: es_reindex_opts = Object.assign({}, options);

  const tempIndex =
    index +
    '_' +
    Math.random()
      .toString()
      .replace('.', '');

  await es_create(tempIndex, map);

  await es_connection.es_client.reindex({
    body: { source: { index }, dest: { index: tempIndex } },
    refresh: true,
  });

  await es_connection.es_client.indices.delete({ index });

  await es_create(index, map);

  let script;
  if (opts.script) script = { inline: opts.script, lang: 'painless' };
  await es_connection.es_client.reindex({
    body: {
      source: { index: tempIndex },
      dest: { index },
      script,
    },
    refresh: true,
  });

  await es_connection.es_client.indices.delete({ index: tempIndex });
};
// ---------------------------
export const es_map_delete_cols = async (
  index: table_names,
  col_list: string[],
) => {
  const map = await es_getmap(index);
  let script = '';
  col_list.forEach(col => {
    let col_text = col,
      prefix = '';
    if (col.includes('.')) {
      let cols = col.split('.');
      prefix = '.' + cols[0];
      col_text = cols[1];
      delete map[cols[0]].properties[cols[1]];
    } else {
      delete map[col];
    }
    script += `ctx._source${prefix}.remove('${col_text}');`;
  });
  console.log('map', map, script);
  await es_reindex(index, map, { script });
  // console.log('map', map);
};
// ---------------------------
