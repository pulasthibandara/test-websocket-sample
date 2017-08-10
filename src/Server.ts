import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import * as WebSocket from 'ws';
import { createServer, Server as HttpServer } from 'http';

import MongoConnector from './connectors/MongoConnector';
import PostRepository from './PostRepository';
import WebSocketExchange from './WebSocketExchange';

export default class Server {
  private app: Koa;
  private router: Router;
  private mongo: MongoConnector;
  private postRepository: PostRepository;
  private httpServer: HttpServer;
  private wsServer: WebSocket.Server;
  private socketExchange: WebSocketExchange;

  constructor () {
    this.app = new Koa();
    this.router = new Router();
    this.mongo = MongoConnector.Instance;
  }

  public async register () {
    this.app.use(bodyParser());
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
    
    await this.mongo.connect();

    this.registerRouter();
    this.httpServer = createServer(this.app.callback());
    this.wsServer = new WebSocket.Server({ server: this.httpServer });
    this.socketExchange = new WebSocketExchange(this.wsServer);
    this.socketExchange.register();

    this.postRepository = new PostRepository();
    this.listen();
  }

  private registerRouter () {
    this.router.post('/chat', async ({ request, response }, next) => {
      const { threadId, message } = request.body;
      
      // write to db
      response.body = await this.postRepository.create({
        threadId,
        message,
      });
      
      // push to redis
    });

    this.router.get('/chat/:id', async ({ request, response, params }, next) => {
      // respond with db
      response.body = await this.postRepository
        .getByThreadId(params.id);
    });
  }

  private listen () {
    this.httpServer.listen(3000, () => {
      console.log(`starting on 3000`);
    });
  }
}
