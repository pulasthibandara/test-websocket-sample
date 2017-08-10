import { Duplex } from 'stream';
import { createClient, RedisClient } from 'redis';

const URL = 'redis://:redis:6379';
const CHANNEL = 'messages';

export default class RedisConnector {

  private _pub: RedisClient;
  get pub() {
    return this._pub;
  }

  private _sub: RedisClient;
  get sub() {
    return this._sub;
  }

  private constructor() {
    // super();
  }

  private static _instance: RedisConnector;
  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public register() {
    this._sub = createClient(URL);
    this._pub = createClient(URL);
  }

  // public _write(chunk: any, encoding: string, cb: Function) {
  //   try {
  //     this._pub.publish(CHANNEL, chunk, cb);
  //   } catch (err) {
  //     cb();

  //   }
  // }

  // public _read() {

  // }

}
