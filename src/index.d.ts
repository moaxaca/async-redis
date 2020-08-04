import { Commands, RedisClient, ClientOpts } from 'redis';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Omitted = Omit<RedisClient, keyof Commands<boolean>>;

interface Promisified<T = RedisClient> extends Omitted, Commands<Promise<boolean>> {}

interface AsyncRedisConstructor {
  new (port: number, host?: string, options?: ClientOpts): Promisified;
  new (unix_socket: string, options?: ClientOpts): Promisified;
  new (redis_url: string, options?: ClientOpts): Promisified;
  new (options?: ClientOpts): Promisified;

  createClient(port: number, host?: string, options?: ClientOpts): Promisified;
  createClient(unix_socket: string, options?: ClientOpts): Promisified;
  createClient(redis_url: string, options?: ClientOpts): Promisified;
  createClient(options?: ClientOpts): Promisified;

  decorate: (client: RedisClient) => Promisified;
}

interface AsyncRedisCommands {
  /**
   * CRUD Commands
   */
  /**
   * Set the string value of a key.
   */
  set(key: string, value: string): Promise<string|boolean>;
  set(key: string, value: string, flag: string): Promise<string|boolean>;
  set(key: string, value: string, mode: string, duration: number): Promise<string|undefined>;
  set(key: string, value: string, mode: string, duration: number, flag: string): Promise<string|undefined>;
  SET(key: string, value: string): Promise<string|boolean>;
  SET(key: string, value: string, flag: string): Promise<string|boolean>;
  SET(key: string, value: string, mode: string, duration: number): Promise<string|undefined>;
  SET(key: string, value: string, mode: string, duration: number, flag: string): Promise<string|undefined>;
}

declare const AsyncRedis: AsyncRedisConstructor;
export = AsyncRedis;
