import mongo, { MongoClient } from 'mongodb';

const URL = 'mongodb://mongo:27017/chat';

export default class MongoConnector {

  private _client: mongo.Db;
  get client() {
    return this._client;
  }


  private constructor() {
      
  }

  private static _instance: MongoConnector;
  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  async connect () {
    this._client = await MongoClient.connect(URL);
  }
}
