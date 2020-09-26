import { Injectable } from '@nestjs/common';
import io from '../scoket/io';

interface LockList {
  [key: string]: true;
}
@Injectable()
class LockManager {
  // TODO: timeout
  private list: LockList = {};
  private intervalTime = 100;

  private start(url: string) {
    // console.log(`[LockInterceptor] lock`);
    // io.emit('');
    this.list[url] = true;
  }

  private isExist(url: string): boolean {
    return this.list[url];
  }

  public end(url: string) {
    // console.log(`[LockInterceptor] unlock`);
    delete this.list[url];
  }

  public async wait_for(url: string): Promise<true> {
    if (!this.isExist(url)) {
      this.start(url);
      return true;
    }
    // console.log('wating for ', url);
    return new Promise((ok) => {
      let timeinterval = setInterval(() => {
        if (this.isExist(url)) return true;
        this.start(url);
        ok(true);
        clearInterval(timeinterval);
      }, this.intervalTime);
    });
  }
}
export default new LockManager();
