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
    ws.on('open', () => {
      ws.send('connection successful!');
    });

    ws.on('message', (data) => {
      try {
        const post = <Post>JSON.parse(data.toString());
        // console.log(this.postRepository);
        this.postRepository.create(post).then((post) => {
          // ws.send(JSON.stringify(post.ops));
          this.server.clients.forEach(c => c.send(JSON.stringify(post.ops)));
        });
      } catch (err) {
        console.error(err);
        ws.send('error');
      }
    });
  }
}
