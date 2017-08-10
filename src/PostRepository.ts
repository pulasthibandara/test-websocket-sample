import mongo from 'mongodb';
import MongoConnector from './connectors/MongoConnector';

export interface Post {
  threadId: string;
  message: string;
}

export default class PostRepository {
  private _db: mongo.Collection<Post>;

  constructor () {
    this._db = MongoConnector.Instance.client.collection('chats');
  }

  async create (post: Post) {
    return await this._db.insert(post);
  }

  async getByThreadId(threadId: string): Promise<Post[]> {
    return await this._db.find({ threadId }).toArray();
  }
}
