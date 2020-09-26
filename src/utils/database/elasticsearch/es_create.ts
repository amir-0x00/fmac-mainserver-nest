import { es_connection } from './es_common';
import { IndicesCreateParams } from 'elasticsearch';
import { IESMappingProperties } from './es_map';

type es_create_opts = {
  noArabic?: boolean;
};
// ---------------------------
export const es_create = async (
  index,
  map: IESMappingProperties,
  options: es_create_opts = {},
) => {
  const opts: es_create_opts = Object.assign({ noArabic: false }, options);
  const body: any = {};
  body.settings = {
    index: {
      refresh_interval: -1,
      number_of_shards: 1,
      number_of_replicas: 0,
    },
  };
  if (!opts.noArabic) {
    body.settings.analysis = {
      filter: {
        word_joiner: {
          output_unigrams: 'true',
          token_separator: '',
          type: 'shingle',
        },
        arabic_stemmer: { type: 'stemmer', language: 'arabic' },
      },
      analyzer: {
        arabic_clear_keyword: {
          filter: [
            'lowercase',
            'decimal_digit',
            'word_joiner',
            'arabic_normalization',
            'arabic_stemmer',
          ],
          char_filter: ['arabic_char_filter'],
          tokenizer: 'keyword',
        },
        arabic_clear: {
          filter: [
            'lowercase',
            'decimal_digit',
            // "arabic_stop",
            'word_joiner',
            'arabic_normalization',
            // "arabic_stemmer"
          ],
          char_filter: ['arabic_char_filter'],
          tokenizer: 'standard',
        },
      },
      char_filter: {
        arabic_char_filter: {
          type: 'mapping',
          mappings: ['ة => ه', 'ي => ى', 'عبد\\u0020 => عبد'],
        },
      },
    };
  }
  Object.assign(body, {
    mappings: {
      properties: map,
    },
  });
  const create_body: IndicesCreateParams = {
    index,
    body,
  };
  // console.log('cMap');
  // console.dir(create_body, { depth: null });
  // console.log('----------------------');

  await es_connection.es_client.indices.create(create_body);
};
// ---------------------------
