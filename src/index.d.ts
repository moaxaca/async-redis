import { Commands, RedisClient, ClientOpts, ServerInfo } from 'redis';
import {EventEmitter} from "events";

type Callback<T> = (err: Error | null, reply: T) => void;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Omitted = Omit<RedisClient, keyof Commands<boolean>>;
type OkOrError = 'OK'|Error

interface OverloadedCommand<T, R> {
  (arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T): R;
  (arg1: T, arg2: T, arg3: T, arg4: T, arg5: T): R;
  (arg1: T, arg2: T, arg3: T, arg4: T): R;
  (arg1: T, arg2: T, arg3: T): R;
  (arg1: T, arg2: T | T[]): R;
  (arg1: T | T[]): R;
  (...args: Array<T>): R;
}

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

interface AsyncRedisEventHandlers extends EventEmitter {
  on(event: 'message' | 'message_buffer', listener: (channel: string, message: string) => void): this;
  on(event: 'pmessage' | 'pmessage_buffer', listener: (pattern: string, channel: string, message: string) => void): this;
  on(event: 'subscribe' | 'unsubscribe', listener: (channel: string, count: number) => void): this;
  on(event: 'psubscribe' | 'punsubscribe', listener: (pattern: string, count: number) => void): this;
  on(event: string, listener: (...args: any[]) => void): this;
}

interface AsyncRedisCommands<R> {
  /**
   * Listen for all requests received by the server in real time.
   */
  monitor(cb?: Callback<undefined>): any;
  MONITOR(cb?: Callback<undefined>): any;

  /**
   * Get information and statistics about the server.
   */
  info(): Promise<ServerInfo|boolean>;
  info(section?: string | string[]): Promise<ServerInfo|boolean>;
  INFO(): Promise<ServerInfo|boolean>;
  INFO(section?: string | string[]): Promise<ServerInfo|boolean>;

  /**
   * Ping the server.
   */
  ping(): Promise<string|boolean>;
  ping(message: string): Promise<string|boolean>;
  PING(): Promise<string|boolean>;
  PING(message: string): Promise<string|boolean>;

  /**
   * Authenticate to the server.
   */
  auth(password: string): Promise<string>;
  AUTH(password: string): Promise<string>;

  /**
   * Get array of Redis command details.
   *
   * COUNT - Get total number of Redis commands.
   * GETKEYS - Extract keys given a full Redis command.
   * INFO - Get array of specific REdis command details.
   */
  command(cb?: Callback<Array<[string, number, string[], number, number, number]>>): R;
  COMMAND(cb?: Callback<Array<[string, number, string[], number, number, number]>>): R;

  /**
   * Get array of Redis command details.
   *
   * COUNT - Get array of Redis command details.
   * GETKEYS - Extract keys given a full Redis command.
   * INFO - Get array of specific Redis command details.
   * GET - Get the value of a configuration parameter.
   * REWRITE - Rewrite the configuration file with the in memory configuration.
   * SET - Set a configuration parameter to the given value.
   * RESETSTAT - Reset the stats returned by INFO.
   */
  config: OverloadedCommand<string, boolean>;
  CONFIG: OverloadedCommand<string, boolean>;

  /**
   * Return the number of keys in the selected database.
   */
  dbsize(): Promise<number>;
  DBSIZE(): Promise<number>;

  /**
   * OBJECT - Get debugging information about a key.
   * SEGFAULT - Make the server crash.
   */
  debug: OverloadedCommand<string, boolean>;
  DEBUG: OverloadedCommand<string, boolean>;

  /**
   * PubSub Commands
   */
  /**
   * Post a message to a channel.
   */
  publish(channel: string, value: string): Promise<number|boolean>;
  PUBLISH(channel: string, value: string): Promise<number|boolean>;

  /**
   * CRUD Commands
   */

  /**
   * Append a value to a key.
   */
  append(key: string, value: string): Promise<number>;
  APPEND(key: string, value: string): Promise<number>;

  /**
   * Asynchronously rewrite the append-only file.
   */
  bgrewriteaof(): Promise<OkOrError>;
  BGREWRITEAOF(): Promise<OkOrError>;

  /**
   * Asynchronously save the dataset to disk.
   */
  bgsave(): Promise<OkOrError>;
  BGSAVE(): Promise<OkOrError>;

  /**
   * Determine if a key exists.
   */
  exists: OverloadedCommand<string, R>;
  EXISTS: OverloadedCommand<string, R>;

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

interface AsyncRedisInterface extends AsyncRedisConstructor, AsyncRedisEventHandlers, AsyncRedisCommands<boolean> {}
declare const AsyncRedis: AsyncRedisInterface;
export = AsyncRedis;
