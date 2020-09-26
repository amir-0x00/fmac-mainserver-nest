import * as elasticsearch from 'elasticsearch';
import { es_connection } from './es_common';
import * as colors from 'colors-cli/safe';

import cfg from 'src/config/config';
import { isDev } from 'src/utils/utils';

// ---------------------------
export class es_general {
  static tring = false;
  // ---------------------------
  static async connect() {
    if (this.tring) {
      return new Promise(ok => {
        let interval = setInterval(async () => {
          if (this.tring) return;
          clearInterval(interval);
          ok();
        });
      });
    }
    this.tring = true;
    es_connection.es_client = new elasticsearch.Client({
      ...cfg.es_connection,
      requestTimeout: 600000,
    });
    return new Promise(async resolve => {
      const elastic_checkShards = async () => {
        let hlth = await es_connection.es_client.cluster.health({
          waitForStatus: 'yellow',
          masterTimeout: '500s',
        });
        // let hlth=await client.cluster.health()
        // console.log('[ELASTICSEARCH] shards are activate'.green)
        let letency = isDev ? 0 : 1000;
        // setTimeout(resolve, letency);
        if (!isDev && !process.env.FMT_CLI) console.log('hlth', hlth);
        // if(!hlth.timed_out){
        if (!hlth.timed_out && hlth.status != 'red') {
          console.log(`${colors.green('[ELASTICSEARCH]')}:shards are activate`);
          setTimeout(() => {
            resolve();
            this.tring = false;
          }, letency);
        } else {
          console.log(colors.red(`[ELASTICSEARCH] :shards are not activate`));
          setTimeout(elastic_checkShards, isDev ? 0 : 1000);
        }
      };

      function elasticPing() {
        es_connection.es_client.ping(
          {
            requestTimeout: 30000,
            // undocumented params are appended to the query string
            // hello: "elasticsearch"
          },
          async function(error) {
            if (error) {
              console.log(colors.red('[ELASTICSEARCH] Cluster is down!'));
              console.log(error);

              setTimeout(elasticPing, isDev ? 0 : 1000);
            } else {
              elastic_checkShards();
              console.log(`${colors.green('[ELASTICSEARCH]')} connected`);
            }
          },
        );
      }
      elasticPing();
    });
  }
}
// ---------------------------
