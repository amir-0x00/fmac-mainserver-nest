import * as glob_main from 'glob';
import { IOptions } from 'glob';

export default async function glob(
  patten: string,
  options?: IOptions,
): Promise<string[]> {
  return new Promise(ok => {
    glob_main(patten, options, (err, files) => {
      ok(files);
    });
  });
}
