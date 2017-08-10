import { IncomingMessage } from 'http';
import WebSocket, { Server } from 'ws';

import PostRepository, { Post } from './PostRepository';

export default class WebSocketExchange {
  private postRepository: PostRepository;

  constructor (
    private server: Server,
  ) {
    this.handleConnection = this.handleConnection.bind(this);
    this.postRepository = new PostRepository();
  }

  register() {
    this.server.on('connection', this.handleConnection);

    this.server.on('error', (err) => {
      console.error(err);
    });
  }

  handleConnection(ws: WebSocket, req: IncomingMessage) {
    ws.on('open', () => ws.send('connection successful!'));

    ws.on('message', data => this.messageTransformer(ws, data));

    ws.on(
      'sock_join',
      ((data: any) => this.broadcastToOthers(ws, JSON.stringify(data))) as any
    );
  }

  messageTransformer(ws: WebSocket, rawData: WebSocket.Data) {
    try {
      const data = JSON.parse(rawData.toString());
      if (data.action && data.payload) {
        ws.emit(`sock_${data.action}`, data.payload);
        return;
      }

      throw Error('invalid payload');
    } catch (err) {
      console.error(err);
      ws.emit(err.message);
    }
  }

  broadcastToOthers (ws: WebSocket, data: WebSocket.Data) {
    this.server.clients
      .forEach(c => ws !== c ? c.send(data) : null);
  }
}
