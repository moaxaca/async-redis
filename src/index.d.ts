import { RedisClient, ClientOpts, ServerInfo } from 'redis';
import {EventEmitter} from "events";

type Callback<T> = (err: Error | null, reply: T) => void;
type AsyncCallback<T> = (err: Error | null, reply: T) => Promise<void>;
type OkOrError = 'OK'|Error

export interface OverloadedCommand<T, U, R> {
  (arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T, cb?: Callback<U>): R;
  (arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, cb?: Callback<U>): R;
  (arg1: T, arg2: T, arg3: T, arg4: T, cb?: Callback<U>): R;
  (arg1: T, arg2: T, arg3: T, cb?: Callback<U>): R;
  (arg1: T, arg2: T | T[], cb?: Callback<U>): R;
  (arg1: T | T[], cb?: Callback<U>): R;
  (...args: Array<T | Callback<U>>): R;
}

export interface OverloadedKeyCommand<T, U, R> {
  (key: string, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T, cb?: Callback<U>): Promise<R>;
  (key: string, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, cb?: Callback<U>): Promise<R>;
  (key: string, arg1: T, arg2: T, arg3: T, arg4: T, cb?: Callback<U>): Promise<R>;
  (key: string, arg1: T, arg2: T, arg3: T, cb?: Callback<U>): Promise<R>;
  (key: string, arg1: T, arg2: T, cb?: Callback<U>): Promise<R>;
  (key: string, arg1: T | T[], cb?: Callback<U>): Promise<R>;
  (key: string, ...args: Array<T | Callback<U>>): Promise<R>;
  (...args: Array<string | T | Callback<U>>): Promise<R>;
}

export interface OverloadedListCommand<T, U, R> {
  (arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T, cb?: Callback<U>): Promise<R>;
  (arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, cb?: Callback<U>): Promise<R>;
  (arg1: T, arg2: T, arg3: T, arg4: T, cb?: Callback<U>): Promise<R>;
  (arg1: T, arg2: T, arg3: T, cb?: Callback<U>): Promise<R>;
  (arg1: T, arg2: T, cb?: Callback<U>): Promise<R>;
  (arg1: T | T[], cb?: Callback<U>): Promise<R>;
  (...args: Array<T | Callback<U>>): Promise<R>;
}

export interface OverloadedSetCommand<T, U, R> {
  (key: string, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T, cb?: Callback<U>): Promise<R>;
  (key: string, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, cb?: Callback<U>): Promise<R>;
  (key: string, arg1: T, arg2: T, arg3: T, arg4: T, cb?: Callback<U>): Promise<R>;
  (key: string, arg1: T, arg2: T, arg3: T, cb?: Callback<U>): Promise<R>;
  (key: string, arg1: T, arg2: T, cb?: Callback<U>): Promise<R>;
  (key: string, arg1: T | { [key: string]: T } | T[], cb?: Callback<U>): Promise<R>;
  (key: string, ...args: Array<T | Callback<U>>): Promise<R>;
  (args: [string, ...T[]], cb?: Callback<U>): Promise<R>;
}

export interface OverloadedLastCommand<T1, T2, U, R> {
  (arg1: T1, arg2: T1, arg3: T1, arg4: T1, arg5: T1, arg6: T2, cb?: Callback<U>): Promise<R>;
  (arg1: T1, arg2: T1, arg3: T1, arg4: T1, arg5: T2, cb?: Callback<U>): Promise<R>;
  (arg1: T1, arg2: T1, arg3: T1, arg4: T2, cb?: Callback<U>): Promise<R>;
  (arg1: T1, arg2: T1, arg3: T2, cb?: Callback<U>): Promise<R>;
  (arg1: T1, arg2: T2 | Array<T1 | T2>, cb?: Callback<U>): Promise<R>;
  (args: Array<T1 | T2>, cb?: Callback<U>): Promise<R>;
  (...args: Array<T1 | T2 | Callback<U>>): Promise<R>;
}


interface AsyncRedisConstructor {
  new (port: number, host?: string, options?: ClientOpts): AsyncRedis;
  new (unix_socket: string, options?: ClientOpts): AsyncRedis;
  new (redis_url: string, options?: ClientOpts): AsyncRedis;
  new (options?: ClientOpts): AsyncRedis;

  createClient(port: number, host?: string, options?: ClientOpts): AsyncRedis;
  createClient(unix_socket: string, options?: ClientOpts): AsyncRedis;
  createClient(redis_url: string, options?: ClientOpts): AsyncRedis;
  createClient(options?: ClientOpts): AsyncRedis;

  decorate: (client: RedisClient) => AsyncRedis;
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
   * Get array of Redis command details.
   *
   * COUNT - Get total number of Redis commands.
   * GETKEYS - Extract keys given a full Redis command.
   * INFO - Get array of specific REdis command details.
   */
  command(cb?: Callback<Array<[string, number, string[], number, number, number]>>): Promise<R>;
  COMMAND(cb?: Callback<Array<[string, number, string[], number, number, number]>>): Promise<R>;

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
  config: OverloadedCommand<string | number, any, R>;
  CONFIG: OverloadedCommand<string | number, any, R>;

  /**
   * Return the number of keys in the selected database.
   */
  dbsize(): Promise<number>;
  DBSIZE(): Promise<number>;

  /**
   * OBJECT - Get debugging information about a key.
   * SEGFAULT - Make the server crash.
   */
  debug: OverloadedCommand<string | number, any, R>;
  DEBUG: OverloadedCommand<string | number, any, R>;

  /**
   * Return a serialized version of the value stored at the specified key.
   */
  dump(key: string, cb?: Callback<string>): Promise<R>;
  DUMP(key: string, cb?: Callback<string>): Promise<R>;

  /**
   * Echo the given string.
   */
  echo<T extends string>(message: T, cb?: Callback<T>): Promise<R>;
  ECHO<T extends string>(message: T, cb?: Callback<T>): Promise<R>;

  /**
   * Execute a Lua script server side.
   */
  eval: OverloadedCommand<string | number, any, R>;
  EVAL: OverloadedCommand<string | number, any, R>;

  /**
   * Execute a Lue script server side.
   */
  evalsha: OverloadedCommand<string | number, any, R>;
  EVALSHA: OverloadedCommand<string | number, any, R>;

  /**
   * PubSub Commands TODO
   */

  /**
   * Post a message to a channel.
   */
  publish(channel: string, value: string): Promise<number|boolean>;
  PUBLISH(channel: string, value: string): Promise<number|boolean>;

  /**
   * Discard all commands issued after MULTI.
   */
  discard(cb?: Callback<'OK'>): Promise<R>;
  DISCARD(cb?: Callback<'OK'>): Promise<R>;
}

interface CountingCommands<R> {
  /**
   * Decrement the integer value of a key by one.
   */
  decr(key: string, cb?: Callback<number>): Promise<R>;
  DECR(key: string, cb?: Callback<number>): Promise<R>;

  /**
   * Decrement the integer value of a key by the given number.
   */
  decrby(key: string, decrement: number, cb?: Callback<number>): Promise<R>;
  DECRBY(key: string, decrement: number, cb?: Callback<number>): Promise<R>;

  /**
   * Increment the integer value of a key by one.
   */
  incr(key: string, cb?: Callback<number>): Promise<R>;
  INCR(key: string, cb?: Callback<number>): Promise<R>;

  /**
   * Increment the integer value of a key by the given amount.
   */
  incrby(key: string, increment: number, cb?: Callback<number>): Promise<R>;
  INCRBY(key: string, increment: number, cb?: Callback<number>): Promise<R>;

  /**
   * Increment the float value of a key by the given amount.
   */
  incrbyfloat(key: string, increment: number, cb?: Callback<string>): Promise<R>;
  INCRBYFLOAT(key: string, increment: number, cb?: Callback<string>): Promise<R>;
}

interface CrudCommands<R> {
  /**
   * Append a value to a key.
   */
  append(key: string, value: string): Promise<number>;
  APPEND(key: string, value: string): Promise<number>;

  /**
   * Determine if a key exists.
   */
  exists: OverloadedCommand<string | number, any, R>;
  EXISTS: OverloadedCommand<string | number, any, R>;

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

  /**
   * Set a key's time to live in seconds.
   */
  expire(key: string, seconds: number, cb?: Callback<number>): Promise<R>;
  EXPIRE(key: string, seconds: number, cb?: Callback<number>): Promise<R>;

  /**
   * Set the expiration for a key as a UNIX timestamp.
   */
  expireat(key: string, timestamp: number, cb?: Callback<number>): Promise<R>;
  EXPIREAT(key: string, timestamp: number, cb?: Callback<number>): Promise<R>;

  /**
   * Remove all keys from all databases.
   */
  flushall(cb?: Callback<string>): Promise<R>;
  flushall(async: "ASYNC", cb?: Callback<string>): Promise<R>;
  FLUSHALL(cb?: Callback<string>): Promise<R>;
  FLUSHALL(async: 'ASYNC', cb?: Callback<string>): Promise<R>;

  /**
   * Remove all keys from the current database.
   */
  flushdb(cb?: Callback<'OK'>): Promise<R>;
  flushdb(async: "ASYNC", cb?: Callback<string>): Promise<R>;
  FLUSHDB(cb?: Callback<'OK'>): Promise<R>;
  FLUSHDB(async: 'ASYNC', cb?: Callback<string>): Promise<R>;

  /**
   * Get the value of a key.
   */
  get(key: string, cb?: Callback<string | null>): Promise<R>;
  GET(key: string, cb?: Callback<string | null>): Promise<R>;

  /**
   * Returns the bit value at offset in the string value stored at key.
   */
  getbit(key: string, offset: number, cb?: Callback<number>): Promise<R>;
  GETBIT(key: string, offset: number, cb?: Callback<number>): Promise<R>;

  /**
   * Get a substring of the string stored at a key.
   */
  getrange(key: string, start: number, end: number, cb?: Callback<string>): Promise<R>;
  GETRANGE(key: string, start: number, end: number, cb?: Callback<string>): Promise<R>;

  /**
   * Set the string value of a key and return its old value.
   */
  getset(key: string, value: string, cb?: Callback<string>): Promise<R>;
  GETSET(key: string, value: string, cb?: Callback<string>): Promise<R>;

  /**
   * Find all keys matching the given pattern.
   */
  keys(pattern: string, cb?: Callback<string[]>): Promise<R>;
  KEYS(pattern: string, cb?: Callback<string[]>): Promise<R>;
}

interface HashCrudCommands<R> {
  /**
   * Delete on or more hash fields.
   */
  hdel: OverloadedKeyCommand<string, number, R>;
  HDEL: OverloadedKeyCommand<string, number, R>;

  /**
   * Determine if a hash field exists.
   */
  hexists(key: string, field: string, cb?: Callback<number>): Promise<R>;
  HEXISTS(key: string, field: string, cb?: Callback<number>): Promise<R>;

  /**
   * Get the value of a hash field.
   */
  hget(key: string, field: string, cb?: Callback<string | null>): Promise<R>;
  HGET(key: string, field: string, cb?: Callback<string | null>): Promise<R>;

  /**
   * Get all fields and values in a hash.
   */
  hgetall(key: string, cb?: Callback<{ [key: string]: string } | null>): Promise<R>;
  HGETALL(key: string, cb?: Callback<{ [key: string]: string } | null>): Promise<R>;

  /**
   * Increment the integer value of a hash field by the given number.
   */
  hincrby(key: string, field: string, increment: number, cb?: Callback<number>): Promise<R>;
  HINCRBY(key: string, field: string, increment: number, cb?: Callback<number>): Promise<R>;

  /**
   * Increment the float value of a hash field by the given amount.
   */
  hincrbyfloat(key: string, field: string, increment: number, cb?: Callback<string>): Promise<R>;
  HINCRBYFLOAT(key: string, field: string, increment: number, cb?: Callback<string>): Promise<R>;

  /**
   * Get all the fields of a hash.
   */
  hkeys(key: string, cb?: Callback<string[]>): Promise<R>;
  HKEYS(key: string, cb?: Callback<string[]>): Promise<R>;

  /**
   * Get the number of fields in a hash.
   */
  hlen(key: string, cb?: Callback<number>): Promise<R>;
  HLEN(key: string, cb?: Callback<number>): Promise<R>;

  /**
   * Get the values of all the given hash fields.
   */
  hmget: OverloadedKeyCommand<string, string[], R>;
  HMGET: OverloadedKeyCommand<string, string[], R>;

  /**
   * Set the string value of a hash field.
   */
  hset: OverloadedSetCommand<string, number, R>;
  HSET: OverloadedSetCommand<string, number, R>;

  /**
   * Set the value of a hash field, only if the field does not exist.
   */
  hsetnx(key: string, field: string, value: string, cb?: Callback<number>): Promise<R>;
  HSETNX(key: string, field: string, value: string, cb?: Callback<number>): Promise<R>;

  /**
   * Get the length of the value of a hash field.
   */
  hstrlen(key: string, field: string, cb?: Callback<number>): Promise<R>;
  HSTRLEN(key: string, field: string, cb?: Callback<number>): Promise<R>;

  /**
   * Get all the values of a hash.
   */
  hvals(key: string, cb?: Callback<string[]>): Promise<R>;
  HVALS(key: string, cb?: Callback<string[]>): Promise<R>;
}

interface GeoCommands<R> {
  /**
   * Add one or more geospatial items in the geospatial index represented using a sorted set.
   */
  geoadd: OverloadedKeyCommand<string | number, number, R>;
  GEOADD: OverloadedKeyCommand<string | number, number, R>;

  /**
   * Returns members of a geospatial index as standard geohash strings.
   */
  geohash: OverloadedKeyCommand<string, string, R>;
  GEOHASH: OverloadedKeyCommand<string, string, R>;

  /**
   * Returns longitude and latitude of members of a geospatial index.
   */
  geopos: OverloadedKeyCommand<string, Array<[number, number]>, R>;
  GEOPOS: OverloadedKeyCommand<string, Array<[number, number]>, R>;

  /**
   * Returns the distance between two members of a geospatial index.
   */
  geodist: OverloadedKeyCommand<string, string, R>;
  GEODIST: OverloadedKeyCommand<string, string, R>;

  /**
   * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a point.
   */
  georadius: OverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>, R>;
  GEORADIUS: OverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>, R>;

  /**
   * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a member.
   */
  georadiusbymember: OverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>, R>;
  GEORADIUSBYMEMBER: OverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>, R>;
}

export const AsyncRedis: new (options: ClientOpts) => AsyncRedis;
export interface AsyncRedis extends AsyncRedisConstructor, AsyncRedisEventHandlers, AsyncRedisCommands<boolean> {
  /**
   * Mark the start of a transaction block.
   */
  multi(args?: Array<Array<string | number | Callback<any>>>): Multi;
  MULTI(args?: Array<Array<string | number | Callback<any>>>): Multi;

  batch(args?: Array<Array<string | number | Callback<any>>>): Multi;
  BATCH(args?: Array<Array<string | number | Callback<any>>>): Multi;
}

export const Multi: new () => Multi;
export interface Multi extends AsyncRedisEventHandlers, AsyncRedisCommands<boolean>
{
  exec(): Promise<number|boolean>;
  EXEC(): Promise<number|boolean>;

  exec_atomic(): Promise<number|boolean>;
  EXEC_ATOMIC(): Promise<number|boolean>;
}
