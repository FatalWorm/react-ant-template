import type { TId } from '@/Shared/Types/TId';

export type TPostRaw = {
  userId: TId;
  id: TId;
  title: string;
  body: string;
};
