import type { TId } from '@/Shared/Types/TId';

import type { TPostRaw } from './TPostRaw';

export class Post implements TPostRaw {
  public userId: TId;
  public id: TId;
  public title: string;
  public body: string;

  constructor(userId: TId, id: TId, title: string, body: string) {
    this.userId = userId;
    this.id = id;
    this.title = title;
    this.body = body;
  }

  static fromRaw(obj: TPostRaw): Post {
    return new Post(obj.userId, obj.id, obj.title, obj.body);
  }

  toRaw(): TPostRaw {
    return {
      userId: this.userId,
      id: this.id,
      title: this.title,
      body: this.body,
    };
  }
}
