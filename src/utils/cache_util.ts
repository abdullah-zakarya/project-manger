import * as redis from 'redis';

export class CacheUtil {
  private static client = redis.createClient({
    url: 'redis://localhost:6379',
  });

  constructor() {
    CacheUtil.client.connect().catch(console.error);
  }

  public static async get(cacheName: string, key: string) {
    try {
      const data = await CacheUtil.client.json.get(`${cacheName}:${key}`);
      return data;
    } catch (err) {
      console.error(`Error getting cache: ${err}`);
      return null;
    }
  }

  public static async set(cacheName: string, key: string, value: any) {
    try {
      await CacheUtil.client.json.set(`${cacheName}:${key}`, '.', value);
    } catch (err) {
      console.error(`Error setting cache: ${err}`);
    }
  }

  public static async remove(cacheName: string, key: string) {
    try {
      await CacheUtil.client.del(`${cacheName}:${key}`);
    } catch (err) {
      console.error(`Error deleting cache: ${err}`);
    }
  }
}

// ✅ Test code
const JsonTest = async () => {
  const cli = redis.createClient({
    url: 'redis://localhost:6379',
  });

  await cli.connect();
  await cli.json.set('Test', '.', { a: 1, b: 2, c: 3 });
  const data = await cli.json.get('Test');
  console.log('data', data);
};

JsonTest();
