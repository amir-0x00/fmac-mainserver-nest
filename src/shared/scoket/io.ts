import * as CreateSocket from 'socket.io';
import { Socket } from 'socket.io';

class io {
  private socket: Socket;
  async create(server) {
    this.socket = <any>CreateSocket(server, { pingTimeout: 60000 });
    this.socket.on('connection', () => console.log('khhh'));
  }
  public emit(event: string | symbol, ...args: any[]) {
    this.socket.emit(event, ...args);
  }
}
export default new io();
