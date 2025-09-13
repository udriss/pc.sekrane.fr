
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Conquete
 * 
 */
export type Conquete = $Result.DefaultSelection<Prisma.$ConquetePayload>
/**
 * Model Structure
 * 
 */
export type Structure = $Result.DefaultSelection<Prisma.$StructurePayload>
/**
 * Model Rebus
 * 
 */
export type Rebus = $Result.DefaultSelection<Prisma.$RebusPayload>
/**
 * Model Enigmes
 * 
 */
export type Enigmes = $Result.DefaultSelection<Prisma.$EnigmesPayload>
/**
 * Model EscapeGameSession
 * 
 */
export type EscapeGameSession = $Result.DefaultSelection<Prisma.$EscapeGameSessionPayload>
/**
 * Model Partie
 * 
 */
export type Partie = $Result.DefaultSelection<Prisma.$PartiePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Conquetes
 * const conquetes = await prisma.conquete.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Conquetes
   * const conquetes = await prisma.conquete.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.conquete`: Exposes CRUD operations for the **Conquete** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Conquetes
    * const conquetes = await prisma.conquete.findMany()
    * ```
    */
  get conquete(): Prisma.ConqueteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.structure`: Exposes CRUD operations for the **Structure** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Structures
    * const structures = await prisma.structure.findMany()
    * ```
    */
  get structure(): Prisma.StructureDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.rebus`: Exposes CRUD operations for the **Rebus** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Rebuses
    * const rebuses = await prisma.rebus.findMany()
    * ```
    */
  get rebus(): Prisma.RebusDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.enigmes`: Exposes CRUD operations for the **Enigmes** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Enigmes
    * const enigmes = await prisma.enigmes.findMany()
    * ```
    */
  get enigmes(): Prisma.EnigmesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.escapeGameSession`: Exposes CRUD operations for the **EscapeGameSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EscapeGameSessions
    * const escapeGameSessions = await prisma.escapeGameSession.findMany()
    * ```
    */
  get escapeGameSession(): Prisma.EscapeGameSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.partie`: Exposes CRUD operations for the **Partie** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Parties
    * const parties = await prisma.partie.findMany()
    * ```
    */
  get partie(): Prisma.PartieDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.15.0
   * Query Engine version: 85179d7826409ee107a6ba334b5e305ae3fba9fb
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Conquete: 'Conquete',
    Structure: 'Structure',
    Rebus: 'Rebus',
    Enigmes: 'Enigmes',
    EscapeGameSession: 'EscapeGameSession',
    Partie: 'Partie'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    dbEscapeGame?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "conquete" | "structure" | "rebus" | "enigmes" | "escapeGameSession" | "partie"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Conquete: {
        payload: Prisma.$ConquetePayload<ExtArgs>
        fields: Prisma.ConqueteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConqueteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConquetePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConqueteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConquetePayload>
          }
          findFirst: {
            args: Prisma.ConqueteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConquetePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConqueteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConquetePayload>
          }
          findMany: {
            args: Prisma.ConqueteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConquetePayload>[]
          }
          create: {
            args: Prisma.ConqueteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConquetePayload>
          }
          createMany: {
            args: Prisma.ConqueteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ConqueteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConquetePayload>
          }
          update: {
            args: Prisma.ConqueteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConquetePayload>
          }
          deleteMany: {
            args: Prisma.ConqueteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConqueteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ConqueteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConquetePayload>
          }
          aggregate: {
            args: Prisma.ConqueteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConquete>
          }
          groupBy: {
            args: Prisma.ConqueteGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConqueteGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConqueteCountArgs<ExtArgs>
            result: $Utils.Optional<ConqueteCountAggregateOutputType> | number
          }
        }
      }
      Structure: {
        payload: Prisma.$StructurePayload<ExtArgs>
        fields: Prisma.StructureFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StructureFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StructurePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StructureFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StructurePayload>
          }
          findFirst: {
            args: Prisma.StructureFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StructurePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StructureFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StructurePayload>
          }
          findMany: {
            args: Prisma.StructureFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StructurePayload>[]
          }
          create: {
            args: Prisma.StructureCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StructurePayload>
          }
          createMany: {
            args: Prisma.StructureCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.StructureDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StructurePayload>
          }
          update: {
            args: Prisma.StructureUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StructurePayload>
          }
          deleteMany: {
            args: Prisma.StructureDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StructureUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StructureUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StructurePayload>
          }
          aggregate: {
            args: Prisma.StructureAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStructure>
          }
          groupBy: {
            args: Prisma.StructureGroupByArgs<ExtArgs>
            result: $Utils.Optional<StructureGroupByOutputType>[]
          }
          count: {
            args: Prisma.StructureCountArgs<ExtArgs>
            result: $Utils.Optional<StructureCountAggregateOutputType> | number
          }
        }
      }
      Rebus: {
        payload: Prisma.$RebusPayload<ExtArgs>
        fields: Prisma.RebusFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RebusFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RebusPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RebusFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RebusPayload>
          }
          findFirst: {
            args: Prisma.RebusFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RebusPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RebusFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RebusPayload>
          }
          findMany: {
            args: Prisma.RebusFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RebusPayload>[]
          }
          create: {
            args: Prisma.RebusCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RebusPayload>
          }
          createMany: {
            args: Prisma.RebusCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.RebusDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RebusPayload>
          }
          update: {
            args: Prisma.RebusUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RebusPayload>
          }
          deleteMany: {
            args: Prisma.RebusDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RebusUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RebusUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RebusPayload>
          }
          aggregate: {
            args: Prisma.RebusAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRebus>
          }
          groupBy: {
            args: Prisma.RebusGroupByArgs<ExtArgs>
            result: $Utils.Optional<RebusGroupByOutputType>[]
          }
          count: {
            args: Prisma.RebusCountArgs<ExtArgs>
            result: $Utils.Optional<RebusCountAggregateOutputType> | number
          }
        }
      }
      Enigmes: {
        payload: Prisma.$EnigmesPayload<ExtArgs>
        fields: Prisma.EnigmesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EnigmesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnigmesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EnigmesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnigmesPayload>
          }
          findFirst: {
            args: Prisma.EnigmesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnigmesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EnigmesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnigmesPayload>
          }
          findMany: {
            args: Prisma.EnigmesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnigmesPayload>[]
          }
          create: {
            args: Prisma.EnigmesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnigmesPayload>
          }
          createMany: {
            args: Prisma.EnigmesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.EnigmesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnigmesPayload>
          }
          update: {
            args: Prisma.EnigmesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnigmesPayload>
          }
          deleteMany: {
            args: Prisma.EnigmesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EnigmesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EnigmesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnigmesPayload>
          }
          aggregate: {
            args: Prisma.EnigmesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEnigmes>
          }
          groupBy: {
            args: Prisma.EnigmesGroupByArgs<ExtArgs>
            result: $Utils.Optional<EnigmesGroupByOutputType>[]
          }
          count: {
            args: Prisma.EnigmesCountArgs<ExtArgs>
            result: $Utils.Optional<EnigmesCountAggregateOutputType> | number
          }
        }
      }
      EscapeGameSession: {
        payload: Prisma.$EscapeGameSessionPayload<ExtArgs>
        fields: Prisma.EscapeGameSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EscapeGameSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscapeGameSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EscapeGameSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscapeGameSessionPayload>
          }
          findFirst: {
            args: Prisma.EscapeGameSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscapeGameSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EscapeGameSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscapeGameSessionPayload>
          }
          findMany: {
            args: Prisma.EscapeGameSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscapeGameSessionPayload>[]
          }
          create: {
            args: Prisma.EscapeGameSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscapeGameSessionPayload>
          }
          createMany: {
            args: Prisma.EscapeGameSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.EscapeGameSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscapeGameSessionPayload>
          }
          update: {
            args: Prisma.EscapeGameSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscapeGameSessionPayload>
          }
          deleteMany: {
            args: Prisma.EscapeGameSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EscapeGameSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EscapeGameSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscapeGameSessionPayload>
          }
          aggregate: {
            args: Prisma.EscapeGameSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEscapeGameSession>
          }
          groupBy: {
            args: Prisma.EscapeGameSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<EscapeGameSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.EscapeGameSessionCountArgs<ExtArgs>
            result: $Utils.Optional<EscapeGameSessionCountAggregateOutputType> | number
          }
        }
      }
      Partie: {
        payload: Prisma.$PartiePayload<ExtArgs>
        fields: Prisma.PartieFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PartieFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartiePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PartieFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartiePayload>
          }
          findFirst: {
            args: Prisma.PartieFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartiePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PartieFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartiePayload>
          }
          findMany: {
            args: Prisma.PartieFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartiePayload>[]
          }
          create: {
            args: Prisma.PartieCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartiePayload>
          }
          createMany: {
            args: Prisma.PartieCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PartieDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartiePayload>
          }
          update: {
            args: Prisma.PartieUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartiePayload>
          }
          deleteMany: {
            args: Prisma.PartieDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PartieUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PartieUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartiePayload>
          }
          aggregate: {
            args: Prisma.PartieAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePartie>
          }
          groupBy: {
            args: Prisma.PartieGroupByArgs<ExtArgs>
            result: $Utils.Optional<PartieGroupByOutputType>[]
          }
          count: {
            args: Prisma.PartieCountArgs<ExtArgs>
            result: $Utils.Optional<PartieCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    conquete?: ConqueteOmit
    structure?: StructureOmit
    rebus?: RebusOmit
    enigmes?: EnigmesOmit
    escapeGameSession?: EscapeGameSessionOmit
    partie?: PartieOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model Conquete
   */

  export type AggregateConquete = {
    _count: ConqueteCountAggregateOutputType | null
    _avg: ConqueteAvgAggregateOutputType | null
    _sum: ConqueteSumAggregateOutputType | null
    _min: ConqueteMinAggregateOutputType | null
    _max: ConqueteMaxAggregateOutputType | null
  }

  export type ConqueteAvgAggregateOutputType = {
    id: number | null
  }

  export type ConqueteSumAggregateOutputType = {
    id: number | null
  }

  export type ConqueteMinAggregateOutputType = {
    id: number | null
    question: string | null
    reponse: string | null
  }

  export type ConqueteMaxAggregateOutputType = {
    id: number | null
    question: string | null
    reponse: string | null
  }

  export type ConqueteCountAggregateOutputType = {
    id: number
    question: number
    reponse: number
    _all: number
  }


  export type ConqueteAvgAggregateInputType = {
    id?: true
  }

  export type ConqueteSumAggregateInputType = {
    id?: true
  }

  export type ConqueteMinAggregateInputType = {
    id?: true
    question?: true
    reponse?: true
  }

  export type ConqueteMaxAggregateInputType = {
    id?: true
    question?: true
    reponse?: true
  }

  export type ConqueteCountAggregateInputType = {
    id?: true
    question?: true
    reponse?: true
    _all?: true
  }

  export type ConqueteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Conquete to aggregate.
     */
    where?: ConqueteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conquetes to fetch.
     */
    orderBy?: ConqueteOrderByWithRelationInput | ConqueteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConqueteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conquetes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conquetes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Conquetes
    **/
    _count?: true | ConqueteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ConqueteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ConqueteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConqueteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConqueteMaxAggregateInputType
  }

  export type GetConqueteAggregateType<T extends ConqueteAggregateArgs> = {
        [P in keyof T & keyof AggregateConquete]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConquete[P]>
      : GetScalarType<T[P], AggregateConquete[P]>
  }




  export type ConqueteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConqueteWhereInput
    orderBy?: ConqueteOrderByWithAggregationInput | ConqueteOrderByWithAggregationInput[]
    by: ConqueteScalarFieldEnum[] | ConqueteScalarFieldEnum
    having?: ConqueteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConqueteCountAggregateInputType | true
    _avg?: ConqueteAvgAggregateInputType
    _sum?: ConqueteSumAggregateInputType
    _min?: ConqueteMinAggregateInputType
    _max?: ConqueteMaxAggregateInputType
  }

  export type ConqueteGroupByOutputType = {
    id: number
    question: string
    reponse: string
    _count: ConqueteCountAggregateOutputType | null
    _avg: ConqueteAvgAggregateOutputType | null
    _sum: ConqueteSumAggregateOutputType | null
    _min: ConqueteMinAggregateOutputType | null
    _max: ConqueteMaxAggregateOutputType | null
  }

  type GetConqueteGroupByPayload<T extends ConqueteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConqueteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConqueteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConqueteGroupByOutputType[P]>
            : GetScalarType<T[P], ConqueteGroupByOutputType[P]>
        }
      >
    >


  export type ConqueteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question?: boolean
    reponse?: boolean
  }, ExtArgs["result"]["conquete"]>



  export type ConqueteSelectScalar = {
    id?: boolean
    question?: boolean
    reponse?: boolean
  }

  export type ConqueteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "question" | "reponse", ExtArgs["result"]["conquete"]>

  export type $ConquetePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Conquete"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      question: string
      reponse: string
    }, ExtArgs["result"]["conquete"]>
    composites: {}
  }

  type ConqueteGetPayload<S extends boolean | null | undefined | ConqueteDefaultArgs> = $Result.GetResult<Prisma.$ConquetePayload, S>

  type ConqueteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConqueteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConqueteCountAggregateInputType | true
    }

  export interface ConqueteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Conquete'], meta: { name: 'Conquete' } }
    /**
     * Find zero or one Conquete that matches the filter.
     * @param {ConqueteFindUniqueArgs} args - Arguments to find a Conquete
     * @example
     * // Get one Conquete
     * const conquete = await prisma.conquete.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConqueteFindUniqueArgs>(args: SelectSubset<T, ConqueteFindUniqueArgs<ExtArgs>>): Prisma__ConqueteClient<$Result.GetResult<Prisma.$ConquetePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Conquete that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConqueteFindUniqueOrThrowArgs} args - Arguments to find a Conquete
     * @example
     * // Get one Conquete
     * const conquete = await prisma.conquete.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConqueteFindUniqueOrThrowArgs>(args: SelectSubset<T, ConqueteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConqueteClient<$Result.GetResult<Prisma.$ConquetePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Conquete that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConqueteFindFirstArgs} args - Arguments to find a Conquete
     * @example
     * // Get one Conquete
     * const conquete = await prisma.conquete.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConqueteFindFirstArgs>(args?: SelectSubset<T, ConqueteFindFirstArgs<ExtArgs>>): Prisma__ConqueteClient<$Result.GetResult<Prisma.$ConquetePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Conquete that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConqueteFindFirstOrThrowArgs} args - Arguments to find a Conquete
     * @example
     * // Get one Conquete
     * const conquete = await prisma.conquete.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConqueteFindFirstOrThrowArgs>(args?: SelectSubset<T, ConqueteFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConqueteClient<$Result.GetResult<Prisma.$ConquetePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Conquetes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConqueteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Conquetes
     * const conquetes = await prisma.conquete.findMany()
     * 
     * // Get first 10 Conquetes
     * const conquetes = await prisma.conquete.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const conqueteWithIdOnly = await prisma.conquete.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConqueteFindManyArgs>(args?: SelectSubset<T, ConqueteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConquetePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Conquete.
     * @param {ConqueteCreateArgs} args - Arguments to create a Conquete.
     * @example
     * // Create one Conquete
     * const Conquete = await prisma.conquete.create({
     *   data: {
     *     // ... data to create a Conquete
     *   }
     * })
     * 
     */
    create<T extends ConqueteCreateArgs>(args: SelectSubset<T, ConqueteCreateArgs<ExtArgs>>): Prisma__ConqueteClient<$Result.GetResult<Prisma.$ConquetePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Conquetes.
     * @param {ConqueteCreateManyArgs} args - Arguments to create many Conquetes.
     * @example
     * // Create many Conquetes
     * const conquete = await prisma.conquete.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConqueteCreateManyArgs>(args?: SelectSubset<T, ConqueteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Conquete.
     * @param {ConqueteDeleteArgs} args - Arguments to delete one Conquete.
     * @example
     * // Delete one Conquete
     * const Conquete = await prisma.conquete.delete({
     *   where: {
     *     // ... filter to delete one Conquete
     *   }
     * })
     * 
     */
    delete<T extends ConqueteDeleteArgs>(args: SelectSubset<T, ConqueteDeleteArgs<ExtArgs>>): Prisma__ConqueteClient<$Result.GetResult<Prisma.$ConquetePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Conquete.
     * @param {ConqueteUpdateArgs} args - Arguments to update one Conquete.
     * @example
     * // Update one Conquete
     * const conquete = await prisma.conquete.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConqueteUpdateArgs>(args: SelectSubset<T, ConqueteUpdateArgs<ExtArgs>>): Prisma__ConqueteClient<$Result.GetResult<Prisma.$ConquetePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Conquetes.
     * @param {ConqueteDeleteManyArgs} args - Arguments to filter Conquetes to delete.
     * @example
     * // Delete a few Conquetes
     * const { count } = await prisma.conquete.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConqueteDeleteManyArgs>(args?: SelectSubset<T, ConqueteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Conquetes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConqueteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Conquetes
     * const conquete = await prisma.conquete.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConqueteUpdateManyArgs>(args: SelectSubset<T, ConqueteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Conquete.
     * @param {ConqueteUpsertArgs} args - Arguments to update or create a Conquete.
     * @example
     * // Update or create a Conquete
     * const conquete = await prisma.conquete.upsert({
     *   create: {
     *     // ... data to create a Conquete
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Conquete we want to update
     *   }
     * })
     */
    upsert<T extends ConqueteUpsertArgs>(args: SelectSubset<T, ConqueteUpsertArgs<ExtArgs>>): Prisma__ConqueteClient<$Result.GetResult<Prisma.$ConquetePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Conquetes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConqueteCountArgs} args - Arguments to filter Conquetes to count.
     * @example
     * // Count the number of Conquetes
     * const count = await prisma.conquete.count({
     *   where: {
     *     // ... the filter for the Conquetes we want to count
     *   }
     * })
    **/
    count<T extends ConqueteCountArgs>(
      args?: Subset<T, ConqueteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConqueteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Conquete.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConqueteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConqueteAggregateArgs>(args: Subset<T, ConqueteAggregateArgs>): Prisma.PrismaPromise<GetConqueteAggregateType<T>>

    /**
     * Group by Conquete.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConqueteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConqueteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConqueteGroupByArgs['orderBy'] }
        : { orderBy?: ConqueteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConqueteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConqueteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Conquete model
   */
  readonly fields: ConqueteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Conquete.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConqueteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Conquete model
   */
  interface ConqueteFieldRefs {
    readonly id: FieldRef<"Conquete", 'Int'>
    readonly question: FieldRef<"Conquete", 'String'>
    readonly reponse: FieldRef<"Conquete", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Conquete findUnique
   */
  export type ConqueteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conquete
     */
    select?: ConqueteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conquete
     */
    omit?: ConqueteOmit<ExtArgs> | null
    /**
     * Filter, which Conquete to fetch.
     */
    where: ConqueteWhereUniqueInput
  }

  /**
   * Conquete findUniqueOrThrow
   */
  export type ConqueteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conquete
     */
    select?: ConqueteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conquete
     */
    omit?: ConqueteOmit<ExtArgs> | null
    /**
     * Filter, which Conquete to fetch.
     */
    where: ConqueteWhereUniqueInput
  }

  /**
   * Conquete findFirst
   */
  export type ConqueteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conquete
     */
    select?: ConqueteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conquete
     */
    omit?: ConqueteOmit<ExtArgs> | null
    /**
     * Filter, which Conquete to fetch.
     */
    where?: ConqueteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conquetes to fetch.
     */
    orderBy?: ConqueteOrderByWithRelationInput | ConqueteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Conquetes.
     */
    cursor?: ConqueteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conquetes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conquetes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conquetes.
     */
    distinct?: ConqueteScalarFieldEnum | ConqueteScalarFieldEnum[]
  }

  /**
   * Conquete findFirstOrThrow
   */
  export type ConqueteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conquete
     */
    select?: ConqueteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conquete
     */
    omit?: ConqueteOmit<ExtArgs> | null
    /**
     * Filter, which Conquete to fetch.
     */
    where?: ConqueteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conquetes to fetch.
     */
    orderBy?: ConqueteOrderByWithRelationInput | ConqueteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Conquetes.
     */
    cursor?: ConqueteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conquetes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conquetes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conquetes.
     */
    distinct?: ConqueteScalarFieldEnum | ConqueteScalarFieldEnum[]
  }

  /**
   * Conquete findMany
   */
  export type ConqueteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conquete
     */
    select?: ConqueteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conquete
     */
    omit?: ConqueteOmit<ExtArgs> | null
    /**
     * Filter, which Conquetes to fetch.
     */
    where?: ConqueteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conquetes to fetch.
     */
    orderBy?: ConqueteOrderByWithRelationInput | ConqueteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Conquetes.
     */
    cursor?: ConqueteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conquetes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conquetes.
     */
    skip?: number
    distinct?: ConqueteScalarFieldEnum | ConqueteScalarFieldEnum[]
  }

  /**
   * Conquete create
   */
  export type ConqueteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conquete
     */
    select?: ConqueteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conquete
     */
    omit?: ConqueteOmit<ExtArgs> | null
    /**
     * The data needed to create a Conquete.
     */
    data: XOR<ConqueteCreateInput, ConqueteUncheckedCreateInput>
  }

  /**
   * Conquete createMany
   */
  export type ConqueteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Conquetes.
     */
    data: ConqueteCreateManyInput | ConqueteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Conquete update
   */
  export type ConqueteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conquete
     */
    select?: ConqueteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conquete
     */
    omit?: ConqueteOmit<ExtArgs> | null
    /**
     * The data needed to update a Conquete.
     */
    data: XOR<ConqueteUpdateInput, ConqueteUncheckedUpdateInput>
    /**
     * Choose, which Conquete to update.
     */
    where: ConqueteWhereUniqueInput
  }

  /**
   * Conquete updateMany
   */
  export type ConqueteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Conquetes.
     */
    data: XOR<ConqueteUpdateManyMutationInput, ConqueteUncheckedUpdateManyInput>
    /**
     * Filter which Conquetes to update
     */
    where?: ConqueteWhereInput
    /**
     * Limit how many Conquetes to update.
     */
    limit?: number
  }

  /**
   * Conquete upsert
   */
  export type ConqueteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conquete
     */
    select?: ConqueteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conquete
     */
    omit?: ConqueteOmit<ExtArgs> | null
    /**
     * The filter to search for the Conquete to update in case it exists.
     */
    where: ConqueteWhereUniqueInput
    /**
     * In case the Conquete found by the `where` argument doesn't exist, create a new Conquete with this data.
     */
    create: XOR<ConqueteCreateInput, ConqueteUncheckedCreateInput>
    /**
     * In case the Conquete was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConqueteUpdateInput, ConqueteUncheckedUpdateInput>
  }

  /**
   * Conquete delete
   */
  export type ConqueteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conquete
     */
    select?: ConqueteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conquete
     */
    omit?: ConqueteOmit<ExtArgs> | null
    /**
     * Filter which Conquete to delete.
     */
    where: ConqueteWhereUniqueInput
  }

  /**
   * Conquete deleteMany
   */
  export type ConqueteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Conquetes to delete
     */
    where?: ConqueteWhereInput
    /**
     * Limit how many Conquetes to delete.
     */
    limit?: number
  }

  /**
   * Conquete without action
   */
  export type ConqueteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conquete
     */
    select?: ConqueteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conquete
     */
    omit?: ConqueteOmit<ExtArgs> | null
  }


  /**
   * Model Structure
   */

  export type AggregateStructure = {
    _count: StructureCountAggregateOutputType | null
    _avg: StructureAvgAggregateOutputType | null
    _sum: StructureSumAggregateOutputType | null
    _min: StructureMinAggregateOutputType | null
    _max: StructureMaxAggregateOutputType | null
  }

  export type StructureAvgAggregateOutputType = {
    id: number | null
  }

  export type StructureSumAggregateOutputType = {
    id: number | null
  }

  export type StructureMinAggregateOutputType = {
    id: number | null
    question: string | null
    reponse: string | null
  }

  export type StructureMaxAggregateOutputType = {
    id: number | null
    question: string | null
    reponse: string | null
  }

  export type StructureCountAggregateOutputType = {
    id: number
    question: number
    reponse: number
    _all: number
  }


  export type StructureAvgAggregateInputType = {
    id?: true
  }

  export type StructureSumAggregateInputType = {
    id?: true
  }

  export type StructureMinAggregateInputType = {
    id?: true
    question?: true
    reponse?: true
  }

  export type StructureMaxAggregateInputType = {
    id?: true
    question?: true
    reponse?: true
  }

  export type StructureCountAggregateInputType = {
    id?: true
    question?: true
    reponse?: true
    _all?: true
  }

  export type StructureAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Structure to aggregate.
     */
    where?: StructureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Structures to fetch.
     */
    orderBy?: StructureOrderByWithRelationInput | StructureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StructureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Structures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Structures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Structures
    **/
    _count?: true | StructureCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StructureAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StructureSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StructureMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StructureMaxAggregateInputType
  }

  export type GetStructureAggregateType<T extends StructureAggregateArgs> = {
        [P in keyof T & keyof AggregateStructure]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStructure[P]>
      : GetScalarType<T[P], AggregateStructure[P]>
  }




  export type StructureGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StructureWhereInput
    orderBy?: StructureOrderByWithAggregationInput | StructureOrderByWithAggregationInput[]
    by: StructureScalarFieldEnum[] | StructureScalarFieldEnum
    having?: StructureScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StructureCountAggregateInputType | true
    _avg?: StructureAvgAggregateInputType
    _sum?: StructureSumAggregateInputType
    _min?: StructureMinAggregateInputType
    _max?: StructureMaxAggregateInputType
  }

  export type StructureGroupByOutputType = {
    id: number
    question: string
    reponse: string
    _count: StructureCountAggregateOutputType | null
    _avg: StructureAvgAggregateOutputType | null
    _sum: StructureSumAggregateOutputType | null
    _min: StructureMinAggregateOutputType | null
    _max: StructureMaxAggregateOutputType | null
  }

  type GetStructureGroupByPayload<T extends StructureGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StructureGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StructureGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StructureGroupByOutputType[P]>
            : GetScalarType<T[P], StructureGroupByOutputType[P]>
        }
      >
    >


  export type StructureSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question?: boolean
    reponse?: boolean
  }, ExtArgs["result"]["structure"]>



  export type StructureSelectScalar = {
    id?: boolean
    question?: boolean
    reponse?: boolean
  }

  export type StructureOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "question" | "reponse", ExtArgs["result"]["structure"]>

  export type $StructurePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Structure"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      question: string
      reponse: string
    }, ExtArgs["result"]["structure"]>
    composites: {}
  }

  type StructureGetPayload<S extends boolean | null | undefined | StructureDefaultArgs> = $Result.GetResult<Prisma.$StructurePayload, S>

  type StructureCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StructureFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StructureCountAggregateInputType | true
    }

  export interface StructureDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Structure'], meta: { name: 'Structure' } }
    /**
     * Find zero or one Structure that matches the filter.
     * @param {StructureFindUniqueArgs} args - Arguments to find a Structure
     * @example
     * // Get one Structure
     * const structure = await prisma.structure.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StructureFindUniqueArgs>(args: SelectSubset<T, StructureFindUniqueArgs<ExtArgs>>): Prisma__StructureClient<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Structure that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StructureFindUniqueOrThrowArgs} args - Arguments to find a Structure
     * @example
     * // Get one Structure
     * const structure = await prisma.structure.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StructureFindUniqueOrThrowArgs>(args: SelectSubset<T, StructureFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StructureClient<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Structure that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StructureFindFirstArgs} args - Arguments to find a Structure
     * @example
     * // Get one Structure
     * const structure = await prisma.structure.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StructureFindFirstArgs>(args?: SelectSubset<T, StructureFindFirstArgs<ExtArgs>>): Prisma__StructureClient<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Structure that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StructureFindFirstOrThrowArgs} args - Arguments to find a Structure
     * @example
     * // Get one Structure
     * const structure = await prisma.structure.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StructureFindFirstOrThrowArgs>(args?: SelectSubset<T, StructureFindFirstOrThrowArgs<ExtArgs>>): Prisma__StructureClient<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Structures that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StructureFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Structures
     * const structures = await prisma.structure.findMany()
     * 
     * // Get first 10 Structures
     * const structures = await prisma.structure.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const structureWithIdOnly = await prisma.structure.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StructureFindManyArgs>(args?: SelectSubset<T, StructureFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Structure.
     * @param {StructureCreateArgs} args - Arguments to create a Structure.
     * @example
     * // Create one Structure
     * const Structure = await prisma.structure.create({
     *   data: {
     *     // ... data to create a Structure
     *   }
     * })
     * 
     */
    create<T extends StructureCreateArgs>(args: SelectSubset<T, StructureCreateArgs<ExtArgs>>): Prisma__StructureClient<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Structures.
     * @param {StructureCreateManyArgs} args - Arguments to create many Structures.
     * @example
     * // Create many Structures
     * const structure = await prisma.structure.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StructureCreateManyArgs>(args?: SelectSubset<T, StructureCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Structure.
     * @param {StructureDeleteArgs} args - Arguments to delete one Structure.
     * @example
     * // Delete one Structure
     * const Structure = await prisma.structure.delete({
     *   where: {
     *     // ... filter to delete one Structure
     *   }
     * })
     * 
     */
    delete<T extends StructureDeleteArgs>(args: SelectSubset<T, StructureDeleteArgs<ExtArgs>>): Prisma__StructureClient<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Structure.
     * @param {StructureUpdateArgs} args - Arguments to update one Structure.
     * @example
     * // Update one Structure
     * const structure = await prisma.structure.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StructureUpdateArgs>(args: SelectSubset<T, StructureUpdateArgs<ExtArgs>>): Prisma__StructureClient<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Structures.
     * @param {StructureDeleteManyArgs} args - Arguments to filter Structures to delete.
     * @example
     * // Delete a few Structures
     * const { count } = await prisma.structure.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StructureDeleteManyArgs>(args?: SelectSubset<T, StructureDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Structures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StructureUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Structures
     * const structure = await prisma.structure.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StructureUpdateManyArgs>(args: SelectSubset<T, StructureUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Structure.
     * @param {StructureUpsertArgs} args - Arguments to update or create a Structure.
     * @example
     * // Update or create a Structure
     * const structure = await prisma.structure.upsert({
     *   create: {
     *     // ... data to create a Structure
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Structure we want to update
     *   }
     * })
     */
    upsert<T extends StructureUpsertArgs>(args: SelectSubset<T, StructureUpsertArgs<ExtArgs>>): Prisma__StructureClient<$Result.GetResult<Prisma.$StructurePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Structures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StructureCountArgs} args - Arguments to filter Structures to count.
     * @example
     * // Count the number of Structures
     * const count = await prisma.structure.count({
     *   where: {
     *     // ... the filter for the Structures we want to count
     *   }
     * })
    **/
    count<T extends StructureCountArgs>(
      args?: Subset<T, StructureCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StructureCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Structure.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StructureAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StructureAggregateArgs>(args: Subset<T, StructureAggregateArgs>): Prisma.PrismaPromise<GetStructureAggregateType<T>>

    /**
     * Group by Structure.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StructureGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StructureGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StructureGroupByArgs['orderBy'] }
        : { orderBy?: StructureGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StructureGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStructureGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Structure model
   */
  readonly fields: StructureFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Structure.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StructureClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Structure model
   */
  interface StructureFieldRefs {
    readonly id: FieldRef<"Structure", 'Int'>
    readonly question: FieldRef<"Structure", 'String'>
    readonly reponse: FieldRef<"Structure", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Structure findUnique
   */
  export type StructureFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * Filter, which Structure to fetch.
     */
    where: StructureWhereUniqueInput
  }

  /**
   * Structure findUniqueOrThrow
   */
  export type StructureFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * Filter, which Structure to fetch.
     */
    where: StructureWhereUniqueInput
  }

  /**
   * Structure findFirst
   */
  export type StructureFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * Filter, which Structure to fetch.
     */
    where?: StructureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Structures to fetch.
     */
    orderBy?: StructureOrderByWithRelationInput | StructureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Structures.
     */
    cursor?: StructureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Structures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Structures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Structures.
     */
    distinct?: StructureScalarFieldEnum | StructureScalarFieldEnum[]
  }

  /**
   * Structure findFirstOrThrow
   */
  export type StructureFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * Filter, which Structure to fetch.
     */
    where?: StructureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Structures to fetch.
     */
    orderBy?: StructureOrderByWithRelationInput | StructureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Structures.
     */
    cursor?: StructureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Structures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Structures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Structures.
     */
    distinct?: StructureScalarFieldEnum | StructureScalarFieldEnum[]
  }

  /**
   * Structure findMany
   */
  export type StructureFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * Filter, which Structures to fetch.
     */
    where?: StructureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Structures to fetch.
     */
    orderBy?: StructureOrderByWithRelationInput | StructureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Structures.
     */
    cursor?: StructureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Structures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Structures.
     */
    skip?: number
    distinct?: StructureScalarFieldEnum | StructureScalarFieldEnum[]
  }

  /**
   * Structure create
   */
  export type StructureCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * The data needed to create a Structure.
     */
    data: XOR<StructureCreateInput, StructureUncheckedCreateInput>
  }

  /**
   * Structure createMany
   */
  export type StructureCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Structures.
     */
    data: StructureCreateManyInput | StructureCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Structure update
   */
  export type StructureUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * The data needed to update a Structure.
     */
    data: XOR<StructureUpdateInput, StructureUncheckedUpdateInput>
    /**
     * Choose, which Structure to update.
     */
    where: StructureWhereUniqueInput
  }

  /**
   * Structure updateMany
   */
  export type StructureUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Structures.
     */
    data: XOR<StructureUpdateManyMutationInput, StructureUncheckedUpdateManyInput>
    /**
     * Filter which Structures to update
     */
    where?: StructureWhereInput
    /**
     * Limit how many Structures to update.
     */
    limit?: number
  }

  /**
   * Structure upsert
   */
  export type StructureUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * The filter to search for the Structure to update in case it exists.
     */
    where: StructureWhereUniqueInput
    /**
     * In case the Structure found by the `where` argument doesn't exist, create a new Structure with this data.
     */
    create: XOR<StructureCreateInput, StructureUncheckedCreateInput>
    /**
     * In case the Structure was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StructureUpdateInput, StructureUncheckedUpdateInput>
  }

  /**
   * Structure delete
   */
  export type StructureDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
    /**
     * Filter which Structure to delete.
     */
    where: StructureWhereUniqueInput
  }

  /**
   * Structure deleteMany
   */
  export type StructureDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Structures to delete
     */
    where?: StructureWhereInput
    /**
     * Limit how many Structures to delete.
     */
    limit?: number
  }

  /**
   * Structure without action
   */
  export type StructureDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Structure
     */
    select?: StructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Structure
     */
    omit?: StructureOmit<ExtArgs> | null
  }


  /**
   * Model Rebus
   */

  export type AggregateRebus = {
    _count: RebusCountAggregateOutputType | null
    _avg: RebusAvgAggregateOutputType | null
    _sum: RebusSumAggregateOutputType | null
    _min: RebusMinAggregateOutputType | null
    _max: RebusMaxAggregateOutputType | null
  }

  export type RebusAvgAggregateOutputType = {
    id: number | null
  }

  export type RebusSumAggregateOutputType = {
    id: number | null
  }

  export type RebusMinAggregateOutputType = {
    id: number | null
    reponse: string | null
  }

  export type RebusMaxAggregateOutputType = {
    id: number | null
    reponse: string | null
  }

  export type RebusCountAggregateOutputType = {
    id: number
    reponse: number
    _all: number
  }


  export type RebusAvgAggregateInputType = {
    id?: true
  }

  export type RebusSumAggregateInputType = {
    id?: true
  }

  export type RebusMinAggregateInputType = {
    id?: true
    reponse?: true
  }

  export type RebusMaxAggregateInputType = {
    id?: true
    reponse?: true
  }

  export type RebusCountAggregateInputType = {
    id?: true
    reponse?: true
    _all?: true
  }

  export type RebusAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rebus to aggregate.
     */
    where?: RebusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rebuses to fetch.
     */
    orderBy?: RebusOrderByWithRelationInput | RebusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RebusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rebuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rebuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Rebuses
    **/
    _count?: true | RebusCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RebusAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RebusSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RebusMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RebusMaxAggregateInputType
  }

  export type GetRebusAggregateType<T extends RebusAggregateArgs> = {
        [P in keyof T & keyof AggregateRebus]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRebus[P]>
      : GetScalarType<T[P], AggregateRebus[P]>
  }




  export type RebusGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RebusWhereInput
    orderBy?: RebusOrderByWithAggregationInput | RebusOrderByWithAggregationInput[]
    by: RebusScalarFieldEnum[] | RebusScalarFieldEnum
    having?: RebusScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RebusCountAggregateInputType | true
    _avg?: RebusAvgAggregateInputType
    _sum?: RebusSumAggregateInputType
    _min?: RebusMinAggregateInputType
    _max?: RebusMaxAggregateInputType
  }

  export type RebusGroupByOutputType = {
    id: number
    reponse: string
    _count: RebusCountAggregateOutputType | null
    _avg: RebusAvgAggregateOutputType | null
    _sum: RebusSumAggregateOutputType | null
    _min: RebusMinAggregateOutputType | null
    _max: RebusMaxAggregateOutputType | null
  }

  type GetRebusGroupByPayload<T extends RebusGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RebusGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RebusGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RebusGroupByOutputType[P]>
            : GetScalarType<T[P], RebusGroupByOutputType[P]>
        }
      >
    >


  export type RebusSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reponse?: boolean
  }, ExtArgs["result"]["rebus"]>



  export type RebusSelectScalar = {
    id?: boolean
    reponse?: boolean
  }

  export type RebusOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "reponse", ExtArgs["result"]["rebus"]>

  export type $RebusPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Rebus"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      reponse: string
    }, ExtArgs["result"]["rebus"]>
    composites: {}
  }

  type RebusGetPayload<S extends boolean | null | undefined | RebusDefaultArgs> = $Result.GetResult<Prisma.$RebusPayload, S>

  type RebusCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RebusFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RebusCountAggregateInputType | true
    }

  export interface RebusDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Rebus'], meta: { name: 'Rebus' } }
    /**
     * Find zero or one Rebus that matches the filter.
     * @param {RebusFindUniqueArgs} args - Arguments to find a Rebus
     * @example
     * // Get one Rebus
     * const rebus = await prisma.rebus.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RebusFindUniqueArgs>(args: SelectSubset<T, RebusFindUniqueArgs<ExtArgs>>): Prisma__RebusClient<$Result.GetResult<Prisma.$RebusPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Rebus that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RebusFindUniqueOrThrowArgs} args - Arguments to find a Rebus
     * @example
     * // Get one Rebus
     * const rebus = await prisma.rebus.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RebusFindUniqueOrThrowArgs>(args: SelectSubset<T, RebusFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RebusClient<$Result.GetResult<Prisma.$RebusPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Rebus that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RebusFindFirstArgs} args - Arguments to find a Rebus
     * @example
     * // Get one Rebus
     * const rebus = await prisma.rebus.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RebusFindFirstArgs>(args?: SelectSubset<T, RebusFindFirstArgs<ExtArgs>>): Prisma__RebusClient<$Result.GetResult<Prisma.$RebusPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Rebus that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RebusFindFirstOrThrowArgs} args - Arguments to find a Rebus
     * @example
     * // Get one Rebus
     * const rebus = await prisma.rebus.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RebusFindFirstOrThrowArgs>(args?: SelectSubset<T, RebusFindFirstOrThrowArgs<ExtArgs>>): Prisma__RebusClient<$Result.GetResult<Prisma.$RebusPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Rebuses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RebusFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Rebuses
     * const rebuses = await prisma.rebus.findMany()
     * 
     * // Get first 10 Rebuses
     * const rebuses = await prisma.rebus.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rebusWithIdOnly = await prisma.rebus.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RebusFindManyArgs>(args?: SelectSubset<T, RebusFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RebusPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Rebus.
     * @param {RebusCreateArgs} args - Arguments to create a Rebus.
     * @example
     * // Create one Rebus
     * const Rebus = await prisma.rebus.create({
     *   data: {
     *     // ... data to create a Rebus
     *   }
     * })
     * 
     */
    create<T extends RebusCreateArgs>(args: SelectSubset<T, RebusCreateArgs<ExtArgs>>): Prisma__RebusClient<$Result.GetResult<Prisma.$RebusPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Rebuses.
     * @param {RebusCreateManyArgs} args - Arguments to create many Rebuses.
     * @example
     * // Create many Rebuses
     * const rebus = await prisma.rebus.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RebusCreateManyArgs>(args?: SelectSubset<T, RebusCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Rebus.
     * @param {RebusDeleteArgs} args - Arguments to delete one Rebus.
     * @example
     * // Delete one Rebus
     * const Rebus = await prisma.rebus.delete({
     *   where: {
     *     // ... filter to delete one Rebus
     *   }
     * })
     * 
     */
    delete<T extends RebusDeleteArgs>(args: SelectSubset<T, RebusDeleteArgs<ExtArgs>>): Prisma__RebusClient<$Result.GetResult<Prisma.$RebusPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Rebus.
     * @param {RebusUpdateArgs} args - Arguments to update one Rebus.
     * @example
     * // Update one Rebus
     * const rebus = await prisma.rebus.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RebusUpdateArgs>(args: SelectSubset<T, RebusUpdateArgs<ExtArgs>>): Prisma__RebusClient<$Result.GetResult<Prisma.$RebusPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Rebuses.
     * @param {RebusDeleteManyArgs} args - Arguments to filter Rebuses to delete.
     * @example
     * // Delete a few Rebuses
     * const { count } = await prisma.rebus.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RebusDeleteManyArgs>(args?: SelectSubset<T, RebusDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rebuses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RebusUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Rebuses
     * const rebus = await prisma.rebus.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RebusUpdateManyArgs>(args: SelectSubset<T, RebusUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Rebus.
     * @param {RebusUpsertArgs} args - Arguments to update or create a Rebus.
     * @example
     * // Update or create a Rebus
     * const rebus = await prisma.rebus.upsert({
     *   create: {
     *     // ... data to create a Rebus
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Rebus we want to update
     *   }
     * })
     */
    upsert<T extends RebusUpsertArgs>(args: SelectSubset<T, RebusUpsertArgs<ExtArgs>>): Prisma__RebusClient<$Result.GetResult<Prisma.$RebusPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Rebuses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RebusCountArgs} args - Arguments to filter Rebuses to count.
     * @example
     * // Count the number of Rebuses
     * const count = await prisma.rebus.count({
     *   where: {
     *     // ... the filter for the Rebuses we want to count
     *   }
     * })
    **/
    count<T extends RebusCountArgs>(
      args?: Subset<T, RebusCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RebusCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Rebus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RebusAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RebusAggregateArgs>(args: Subset<T, RebusAggregateArgs>): Prisma.PrismaPromise<GetRebusAggregateType<T>>

    /**
     * Group by Rebus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RebusGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RebusGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RebusGroupByArgs['orderBy'] }
        : { orderBy?: RebusGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RebusGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRebusGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Rebus model
   */
  readonly fields: RebusFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Rebus.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RebusClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Rebus model
   */
  interface RebusFieldRefs {
    readonly id: FieldRef<"Rebus", 'Int'>
    readonly reponse: FieldRef<"Rebus", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Rebus findUnique
   */
  export type RebusFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rebus
     */
    select?: RebusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rebus
     */
    omit?: RebusOmit<ExtArgs> | null
    /**
     * Filter, which Rebus to fetch.
     */
    where: RebusWhereUniqueInput
  }

  /**
   * Rebus findUniqueOrThrow
   */
  export type RebusFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rebus
     */
    select?: RebusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rebus
     */
    omit?: RebusOmit<ExtArgs> | null
    /**
     * Filter, which Rebus to fetch.
     */
    where: RebusWhereUniqueInput
  }

  /**
   * Rebus findFirst
   */
  export type RebusFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rebus
     */
    select?: RebusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rebus
     */
    omit?: RebusOmit<ExtArgs> | null
    /**
     * Filter, which Rebus to fetch.
     */
    where?: RebusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rebuses to fetch.
     */
    orderBy?: RebusOrderByWithRelationInput | RebusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rebuses.
     */
    cursor?: RebusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rebuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rebuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rebuses.
     */
    distinct?: RebusScalarFieldEnum | RebusScalarFieldEnum[]
  }

  /**
   * Rebus findFirstOrThrow
   */
  export type RebusFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rebus
     */
    select?: RebusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rebus
     */
    omit?: RebusOmit<ExtArgs> | null
    /**
     * Filter, which Rebus to fetch.
     */
    where?: RebusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rebuses to fetch.
     */
    orderBy?: RebusOrderByWithRelationInput | RebusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rebuses.
     */
    cursor?: RebusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rebuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rebuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rebuses.
     */
    distinct?: RebusScalarFieldEnum | RebusScalarFieldEnum[]
  }

  /**
   * Rebus findMany
   */
  export type RebusFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rebus
     */
    select?: RebusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rebus
     */
    omit?: RebusOmit<ExtArgs> | null
    /**
     * Filter, which Rebuses to fetch.
     */
    where?: RebusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rebuses to fetch.
     */
    orderBy?: RebusOrderByWithRelationInput | RebusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Rebuses.
     */
    cursor?: RebusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rebuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rebuses.
     */
    skip?: number
    distinct?: RebusScalarFieldEnum | RebusScalarFieldEnum[]
  }

  /**
   * Rebus create
   */
  export type RebusCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rebus
     */
    select?: RebusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rebus
     */
    omit?: RebusOmit<ExtArgs> | null
    /**
     * The data needed to create a Rebus.
     */
    data: XOR<RebusCreateInput, RebusUncheckedCreateInput>
  }

  /**
   * Rebus createMany
   */
  export type RebusCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Rebuses.
     */
    data: RebusCreateManyInput | RebusCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Rebus update
   */
  export type RebusUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rebus
     */
    select?: RebusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rebus
     */
    omit?: RebusOmit<ExtArgs> | null
    /**
     * The data needed to update a Rebus.
     */
    data: XOR<RebusUpdateInput, RebusUncheckedUpdateInput>
    /**
     * Choose, which Rebus to update.
     */
    where: RebusWhereUniqueInput
  }

  /**
   * Rebus updateMany
   */
  export type RebusUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Rebuses.
     */
    data: XOR<RebusUpdateManyMutationInput, RebusUncheckedUpdateManyInput>
    /**
     * Filter which Rebuses to update
     */
    where?: RebusWhereInput
    /**
     * Limit how many Rebuses to update.
     */
    limit?: number
  }

  /**
   * Rebus upsert
   */
  export type RebusUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rebus
     */
    select?: RebusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rebus
     */
    omit?: RebusOmit<ExtArgs> | null
    /**
     * The filter to search for the Rebus to update in case it exists.
     */
    where: RebusWhereUniqueInput
    /**
     * In case the Rebus found by the `where` argument doesn't exist, create a new Rebus with this data.
     */
    create: XOR<RebusCreateInput, RebusUncheckedCreateInput>
    /**
     * In case the Rebus was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RebusUpdateInput, RebusUncheckedUpdateInput>
  }

  /**
   * Rebus delete
   */
  export type RebusDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rebus
     */
    select?: RebusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rebus
     */
    omit?: RebusOmit<ExtArgs> | null
    /**
     * Filter which Rebus to delete.
     */
    where: RebusWhereUniqueInput
  }

  /**
   * Rebus deleteMany
   */
  export type RebusDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rebuses to delete
     */
    where?: RebusWhereInput
    /**
     * Limit how many Rebuses to delete.
     */
    limit?: number
  }

  /**
   * Rebus without action
   */
  export type RebusDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rebus
     */
    select?: RebusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rebus
     */
    omit?: RebusOmit<ExtArgs> | null
  }


  /**
   * Model Enigmes
   */

  export type AggregateEnigmes = {
    _count: EnigmesCountAggregateOutputType | null
    _avg: EnigmesAvgAggregateOutputType | null
    _sum: EnigmesSumAggregateOutputType | null
    _min: EnigmesMinAggregateOutputType | null
    _max: EnigmesMaxAggregateOutputType | null
  }

  export type EnigmesAvgAggregateOutputType = {
    id: number | null
  }

  export type EnigmesSumAggregateOutputType = {
    id: number | null
  }

  export type EnigmesMinAggregateOutputType = {
    id: number | null
    question: string | null
    reponse: string | null
  }

  export type EnigmesMaxAggregateOutputType = {
    id: number | null
    question: string | null
    reponse: string | null
  }

  export type EnigmesCountAggregateOutputType = {
    id: number
    question: number
    reponse: number
    _all: number
  }


  export type EnigmesAvgAggregateInputType = {
    id?: true
  }

  export type EnigmesSumAggregateInputType = {
    id?: true
  }

  export type EnigmesMinAggregateInputType = {
    id?: true
    question?: true
    reponse?: true
  }

  export type EnigmesMaxAggregateInputType = {
    id?: true
    question?: true
    reponse?: true
  }

  export type EnigmesCountAggregateInputType = {
    id?: true
    question?: true
    reponse?: true
    _all?: true
  }

  export type EnigmesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Enigmes to aggregate.
     */
    where?: EnigmesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Enigmes to fetch.
     */
    orderBy?: EnigmesOrderByWithRelationInput | EnigmesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EnigmesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Enigmes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Enigmes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Enigmes
    **/
    _count?: true | EnigmesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EnigmesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EnigmesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EnigmesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EnigmesMaxAggregateInputType
  }

  export type GetEnigmesAggregateType<T extends EnigmesAggregateArgs> = {
        [P in keyof T & keyof AggregateEnigmes]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEnigmes[P]>
      : GetScalarType<T[P], AggregateEnigmes[P]>
  }




  export type EnigmesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EnigmesWhereInput
    orderBy?: EnigmesOrderByWithAggregationInput | EnigmesOrderByWithAggregationInput[]
    by: EnigmesScalarFieldEnum[] | EnigmesScalarFieldEnum
    having?: EnigmesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EnigmesCountAggregateInputType | true
    _avg?: EnigmesAvgAggregateInputType
    _sum?: EnigmesSumAggregateInputType
    _min?: EnigmesMinAggregateInputType
    _max?: EnigmesMaxAggregateInputType
  }

  export type EnigmesGroupByOutputType = {
    id: number
    question: string
    reponse: string
    _count: EnigmesCountAggregateOutputType | null
    _avg: EnigmesAvgAggregateOutputType | null
    _sum: EnigmesSumAggregateOutputType | null
    _min: EnigmesMinAggregateOutputType | null
    _max: EnigmesMaxAggregateOutputType | null
  }

  type GetEnigmesGroupByPayload<T extends EnigmesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EnigmesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EnigmesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EnigmesGroupByOutputType[P]>
            : GetScalarType<T[P], EnigmesGroupByOutputType[P]>
        }
      >
    >


  export type EnigmesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question?: boolean
    reponse?: boolean
  }, ExtArgs["result"]["enigmes"]>



  export type EnigmesSelectScalar = {
    id?: boolean
    question?: boolean
    reponse?: boolean
  }

  export type EnigmesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "question" | "reponse", ExtArgs["result"]["enigmes"]>

  export type $EnigmesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Enigmes"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      question: string
      reponse: string
    }, ExtArgs["result"]["enigmes"]>
    composites: {}
  }

  type EnigmesGetPayload<S extends boolean | null | undefined | EnigmesDefaultArgs> = $Result.GetResult<Prisma.$EnigmesPayload, S>

  type EnigmesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EnigmesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EnigmesCountAggregateInputType | true
    }

  export interface EnigmesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Enigmes'], meta: { name: 'Enigmes' } }
    /**
     * Find zero or one Enigmes that matches the filter.
     * @param {EnigmesFindUniqueArgs} args - Arguments to find a Enigmes
     * @example
     * // Get one Enigmes
     * const enigmes = await prisma.enigmes.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EnigmesFindUniqueArgs>(args: SelectSubset<T, EnigmesFindUniqueArgs<ExtArgs>>): Prisma__EnigmesClient<$Result.GetResult<Prisma.$EnigmesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Enigmes that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EnigmesFindUniqueOrThrowArgs} args - Arguments to find a Enigmes
     * @example
     * // Get one Enigmes
     * const enigmes = await prisma.enigmes.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EnigmesFindUniqueOrThrowArgs>(args: SelectSubset<T, EnigmesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EnigmesClient<$Result.GetResult<Prisma.$EnigmesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Enigmes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnigmesFindFirstArgs} args - Arguments to find a Enigmes
     * @example
     * // Get one Enigmes
     * const enigmes = await prisma.enigmes.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EnigmesFindFirstArgs>(args?: SelectSubset<T, EnigmesFindFirstArgs<ExtArgs>>): Prisma__EnigmesClient<$Result.GetResult<Prisma.$EnigmesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Enigmes that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnigmesFindFirstOrThrowArgs} args - Arguments to find a Enigmes
     * @example
     * // Get one Enigmes
     * const enigmes = await prisma.enigmes.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EnigmesFindFirstOrThrowArgs>(args?: SelectSubset<T, EnigmesFindFirstOrThrowArgs<ExtArgs>>): Prisma__EnigmesClient<$Result.GetResult<Prisma.$EnigmesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Enigmes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnigmesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Enigmes
     * const enigmes = await prisma.enigmes.findMany()
     * 
     * // Get first 10 Enigmes
     * const enigmes = await prisma.enigmes.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const enigmesWithIdOnly = await prisma.enigmes.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EnigmesFindManyArgs>(args?: SelectSubset<T, EnigmesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnigmesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Enigmes.
     * @param {EnigmesCreateArgs} args - Arguments to create a Enigmes.
     * @example
     * // Create one Enigmes
     * const Enigmes = await prisma.enigmes.create({
     *   data: {
     *     // ... data to create a Enigmes
     *   }
     * })
     * 
     */
    create<T extends EnigmesCreateArgs>(args: SelectSubset<T, EnigmesCreateArgs<ExtArgs>>): Prisma__EnigmesClient<$Result.GetResult<Prisma.$EnigmesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Enigmes.
     * @param {EnigmesCreateManyArgs} args - Arguments to create many Enigmes.
     * @example
     * // Create many Enigmes
     * const enigmes = await prisma.enigmes.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EnigmesCreateManyArgs>(args?: SelectSubset<T, EnigmesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Enigmes.
     * @param {EnigmesDeleteArgs} args - Arguments to delete one Enigmes.
     * @example
     * // Delete one Enigmes
     * const Enigmes = await prisma.enigmes.delete({
     *   where: {
     *     // ... filter to delete one Enigmes
     *   }
     * })
     * 
     */
    delete<T extends EnigmesDeleteArgs>(args: SelectSubset<T, EnigmesDeleteArgs<ExtArgs>>): Prisma__EnigmesClient<$Result.GetResult<Prisma.$EnigmesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Enigmes.
     * @param {EnigmesUpdateArgs} args - Arguments to update one Enigmes.
     * @example
     * // Update one Enigmes
     * const enigmes = await prisma.enigmes.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EnigmesUpdateArgs>(args: SelectSubset<T, EnigmesUpdateArgs<ExtArgs>>): Prisma__EnigmesClient<$Result.GetResult<Prisma.$EnigmesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Enigmes.
     * @param {EnigmesDeleteManyArgs} args - Arguments to filter Enigmes to delete.
     * @example
     * // Delete a few Enigmes
     * const { count } = await prisma.enigmes.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EnigmesDeleteManyArgs>(args?: SelectSubset<T, EnigmesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Enigmes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnigmesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Enigmes
     * const enigmes = await prisma.enigmes.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EnigmesUpdateManyArgs>(args: SelectSubset<T, EnigmesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Enigmes.
     * @param {EnigmesUpsertArgs} args - Arguments to update or create a Enigmes.
     * @example
     * // Update or create a Enigmes
     * const enigmes = await prisma.enigmes.upsert({
     *   create: {
     *     // ... data to create a Enigmes
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Enigmes we want to update
     *   }
     * })
     */
    upsert<T extends EnigmesUpsertArgs>(args: SelectSubset<T, EnigmesUpsertArgs<ExtArgs>>): Prisma__EnigmesClient<$Result.GetResult<Prisma.$EnigmesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Enigmes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnigmesCountArgs} args - Arguments to filter Enigmes to count.
     * @example
     * // Count the number of Enigmes
     * const count = await prisma.enigmes.count({
     *   where: {
     *     // ... the filter for the Enigmes we want to count
     *   }
     * })
    **/
    count<T extends EnigmesCountArgs>(
      args?: Subset<T, EnigmesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EnigmesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Enigmes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnigmesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EnigmesAggregateArgs>(args: Subset<T, EnigmesAggregateArgs>): Prisma.PrismaPromise<GetEnigmesAggregateType<T>>

    /**
     * Group by Enigmes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnigmesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EnigmesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EnigmesGroupByArgs['orderBy'] }
        : { orderBy?: EnigmesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EnigmesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEnigmesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Enigmes model
   */
  readonly fields: EnigmesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Enigmes.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EnigmesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Enigmes model
   */
  interface EnigmesFieldRefs {
    readonly id: FieldRef<"Enigmes", 'Int'>
    readonly question: FieldRef<"Enigmes", 'String'>
    readonly reponse: FieldRef<"Enigmes", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Enigmes findUnique
   */
  export type EnigmesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enigmes
     */
    select?: EnigmesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Enigmes
     */
    omit?: EnigmesOmit<ExtArgs> | null
    /**
     * Filter, which Enigmes to fetch.
     */
    where: EnigmesWhereUniqueInput
  }

  /**
   * Enigmes findUniqueOrThrow
   */
  export type EnigmesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enigmes
     */
    select?: EnigmesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Enigmes
     */
    omit?: EnigmesOmit<ExtArgs> | null
    /**
     * Filter, which Enigmes to fetch.
     */
    where: EnigmesWhereUniqueInput
  }

  /**
   * Enigmes findFirst
   */
  export type EnigmesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enigmes
     */
    select?: EnigmesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Enigmes
     */
    omit?: EnigmesOmit<ExtArgs> | null
    /**
     * Filter, which Enigmes to fetch.
     */
    where?: EnigmesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Enigmes to fetch.
     */
    orderBy?: EnigmesOrderByWithRelationInput | EnigmesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Enigmes.
     */
    cursor?: EnigmesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Enigmes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Enigmes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Enigmes.
     */
    distinct?: EnigmesScalarFieldEnum | EnigmesScalarFieldEnum[]
  }

  /**
   * Enigmes findFirstOrThrow
   */
  export type EnigmesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enigmes
     */
    select?: EnigmesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Enigmes
     */
    omit?: EnigmesOmit<ExtArgs> | null
    /**
     * Filter, which Enigmes to fetch.
     */
    where?: EnigmesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Enigmes to fetch.
     */
    orderBy?: EnigmesOrderByWithRelationInput | EnigmesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Enigmes.
     */
    cursor?: EnigmesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Enigmes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Enigmes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Enigmes.
     */
    distinct?: EnigmesScalarFieldEnum | EnigmesScalarFieldEnum[]
  }

  /**
   * Enigmes findMany
   */
  export type EnigmesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enigmes
     */
    select?: EnigmesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Enigmes
     */
    omit?: EnigmesOmit<ExtArgs> | null
    /**
     * Filter, which Enigmes to fetch.
     */
    where?: EnigmesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Enigmes to fetch.
     */
    orderBy?: EnigmesOrderByWithRelationInput | EnigmesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Enigmes.
     */
    cursor?: EnigmesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Enigmes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Enigmes.
     */
    skip?: number
    distinct?: EnigmesScalarFieldEnum | EnigmesScalarFieldEnum[]
  }

  /**
   * Enigmes create
   */
  export type EnigmesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enigmes
     */
    select?: EnigmesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Enigmes
     */
    omit?: EnigmesOmit<ExtArgs> | null
    /**
     * The data needed to create a Enigmes.
     */
    data: XOR<EnigmesCreateInput, EnigmesUncheckedCreateInput>
  }

  /**
   * Enigmes createMany
   */
  export type EnigmesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Enigmes.
     */
    data: EnigmesCreateManyInput | EnigmesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Enigmes update
   */
  export type EnigmesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enigmes
     */
    select?: EnigmesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Enigmes
     */
    omit?: EnigmesOmit<ExtArgs> | null
    /**
     * The data needed to update a Enigmes.
     */
    data: XOR<EnigmesUpdateInput, EnigmesUncheckedUpdateInput>
    /**
     * Choose, which Enigmes to update.
     */
    where: EnigmesWhereUniqueInput
  }

  /**
   * Enigmes updateMany
   */
  export type EnigmesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Enigmes.
     */
    data: XOR<EnigmesUpdateManyMutationInput, EnigmesUncheckedUpdateManyInput>
    /**
     * Filter which Enigmes to update
     */
    where?: EnigmesWhereInput
    /**
     * Limit how many Enigmes to update.
     */
    limit?: number
  }

  /**
   * Enigmes upsert
   */
  export type EnigmesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enigmes
     */
    select?: EnigmesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Enigmes
     */
    omit?: EnigmesOmit<ExtArgs> | null
    /**
     * The filter to search for the Enigmes to update in case it exists.
     */
    where: EnigmesWhereUniqueInput
    /**
     * In case the Enigmes found by the `where` argument doesn't exist, create a new Enigmes with this data.
     */
    create: XOR<EnigmesCreateInput, EnigmesUncheckedCreateInput>
    /**
     * In case the Enigmes was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EnigmesUpdateInput, EnigmesUncheckedUpdateInput>
  }

  /**
   * Enigmes delete
   */
  export type EnigmesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enigmes
     */
    select?: EnigmesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Enigmes
     */
    omit?: EnigmesOmit<ExtArgs> | null
    /**
     * Filter which Enigmes to delete.
     */
    where: EnigmesWhereUniqueInput
  }

  /**
   * Enigmes deleteMany
   */
  export type EnigmesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Enigmes to delete
     */
    where?: EnigmesWhereInput
    /**
     * Limit how many Enigmes to delete.
     */
    limit?: number
  }

  /**
   * Enigmes without action
   */
  export type EnigmesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Enigmes
     */
    select?: EnigmesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Enigmes
     */
    omit?: EnigmesOmit<ExtArgs> | null
  }


  /**
   * Model EscapeGameSession
   */

  export type AggregateEscapeGameSession = {
    _count: EscapeGameSessionCountAggregateOutputType | null
    _avg: EscapeGameSessionAvgAggregateOutputType | null
    _sum: EscapeGameSessionSumAggregateOutputType | null
    _min: EscapeGameSessionMinAggregateOutputType | null
    _max: EscapeGameSessionMaxAggregateOutputType | null
  }

  export type EscapeGameSessionAvgAggregateOutputType = {
    id: number | null
  }

  export type EscapeGameSessionSumAggregateOutputType = {
    id: number | null
  }

  export type EscapeGameSessionMinAggregateOutputType = {
    id: number | null
    session_id: string | null
    ip: string | null
    navigateur: string | null
  }

  export type EscapeGameSessionMaxAggregateOutputType = {
    id: number | null
    session_id: string | null
    ip: string | null
    navigateur: string | null
  }

  export type EscapeGameSessionCountAggregateOutputType = {
    id: number
    session_id: number
    ip: number
    navigateur: number
    _all: number
  }


  export type EscapeGameSessionAvgAggregateInputType = {
    id?: true
  }

  export type EscapeGameSessionSumAggregateInputType = {
    id?: true
  }

  export type EscapeGameSessionMinAggregateInputType = {
    id?: true
    session_id?: true
    ip?: true
    navigateur?: true
  }

  export type EscapeGameSessionMaxAggregateInputType = {
    id?: true
    session_id?: true
    ip?: true
    navigateur?: true
  }

  export type EscapeGameSessionCountAggregateInputType = {
    id?: true
    session_id?: true
    ip?: true
    navigateur?: true
    _all?: true
  }

  export type EscapeGameSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EscapeGameSession to aggregate.
     */
    where?: EscapeGameSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EscapeGameSessions to fetch.
     */
    orderBy?: EscapeGameSessionOrderByWithRelationInput | EscapeGameSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EscapeGameSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EscapeGameSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EscapeGameSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EscapeGameSessions
    **/
    _count?: true | EscapeGameSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EscapeGameSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EscapeGameSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EscapeGameSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EscapeGameSessionMaxAggregateInputType
  }

  export type GetEscapeGameSessionAggregateType<T extends EscapeGameSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateEscapeGameSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEscapeGameSession[P]>
      : GetScalarType<T[P], AggregateEscapeGameSession[P]>
  }




  export type EscapeGameSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EscapeGameSessionWhereInput
    orderBy?: EscapeGameSessionOrderByWithAggregationInput | EscapeGameSessionOrderByWithAggregationInput[]
    by: EscapeGameSessionScalarFieldEnum[] | EscapeGameSessionScalarFieldEnum
    having?: EscapeGameSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EscapeGameSessionCountAggregateInputType | true
    _avg?: EscapeGameSessionAvgAggregateInputType
    _sum?: EscapeGameSessionSumAggregateInputType
    _min?: EscapeGameSessionMinAggregateInputType
    _max?: EscapeGameSessionMaxAggregateInputType
  }

  export type EscapeGameSessionGroupByOutputType = {
    id: number
    session_id: string
    ip: string
    navigateur: string | null
    _count: EscapeGameSessionCountAggregateOutputType | null
    _avg: EscapeGameSessionAvgAggregateOutputType | null
    _sum: EscapeGameSessionSumAggregateOutputType | null
    _min: EscapeGameSessionMinAggregateOutputType | null
    _max: EscapeGameSessionMaxAggregateOutputType | null
  }

  type GetEscapeGameSessionGroupByPayload<T extends EscapeGameSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EscapeGameSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EscapeGameSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EscapeGameSessionGroupByOutputType[P]>
            : GetScalarType<T[P], EscapeGameSessionGroupByOutputType[P]>
        }
      >
    >


  export type EscapeGameSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    session_id?: boolean
    ip?: boolean
    navigateur?: boolean
  }, ExtArgs["result"]["escapeGameSession"]>



  export type EscapeGameSessionSelectScalar = {
    id?: boolean
    session_id?: boolean
    ip?: boolean
    navigateur?: boolean
  }

  export type EscapeGameSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "session_id" | "ip" | "navigateur", ExtArgs["result"]["escapeGameSession"]>

  export type $EscapeGameSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EscapeGameSession"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      session_id: string
      ip: string
      navigateur: string | null
    }, ExtArgs["result"]["escapeGameSession"]>
    composites: {}
  }

  type EscapeGameSessionGetPayload<S extends boolean | null | undefined | EscapeGameSessionDefaultArgs> = $Result.GetResult<Prisma.$EscapeGameSessionPayload, S>

  type EscapeGameSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EscapeGameSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EscapeGameSessionCountAggregateInputType | true
    }

  export interface EscapeGameSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EscapeGameSession'], meta: { name: 'EscapeGameSession' } }
    /**
     * Find zero or one EscapeGameSession that matches the filter.
     * @param {EscapeGameSessionFindUniqueArgs} args - Arguments to find a EscapeGameSession
     * @example
     * // Get one EscapeGameSession
     * const escapeGameSession = await prisma.escapeGameSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EscapeGameSessionFindUniqueArgs>(args: SelectSubset<T, EscapeGameSessionFindUniqueArgs<ExtArgs>>): Prisma__EscapeGameSessionClient<$Result.GetResult<Prisma.$EscapeGameSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EscapeGameSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EscapeGameSessionFindUniqueOrThrowArgs} args - Arguments to find a EscapeGameSession
     * @example
     * // Get one EscapeGameSession
     * const escapeGameSession = await prisma.escapeGameSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EscapeGameSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, EscapeGameSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EscapeGameSessionClient<$Result.GetResult<Prisma.$EscapeGameSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EscapeGameSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EscapeGameSessionFindFirstArgs} args - Arguments to find a EscapeGameSession
     * @example
     * // Get one EscapeGameSession
     * const escapeGameSession = await prisma.escapeGameSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EscapeGameSessionFindFirstArgs>(args?: SelectSubset<T, EscapeGameSessionFindFirstArgs<ExtArgs>>): Prisma__EscapeGameSessionClient<$Result.GetResult<Prisma.$EscapeGameSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EscapeGameSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EscapeGameSessionFindFirstOrThrowArgs} args - Arguments to find a EscapeGameSession
     * @example
     * // Get one EscapeGameSession
     * const escapeGameSession = await prisma.escapeGameSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EscapeGameSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, EscapeGameSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__EscapeGameSessionClient<$Result.GetResult<Prisma.$EscapeGameSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EscapeGameSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EscapeGameSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EscapeGameSessions
     * const escapeGameSessions = await prisma.escapeGameSession.findMany()
     * 
     * // Get first 10 EscapeGameSessions
     * const escapeGameSessions = await prisma.escapeGameSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const escapeGameSessionWithIdOnly = await prisma.escapeGameSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EscapeGameSessionFindManyArgs>(args?: SelectSubset<T, EscapeGameSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EscapeGameSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EscapeGameSession.
     * @param {EscapeGameSessionCreateArgs} args - Arguments to create a EscapeGameSession.
     * @example
     * // Create one EscapeGameSession
     * const EscapeGameSession = await prisma.escapeGameSession.create({
     *   data: {
     *     // ... data to create a EscapeGameSession
     *   }
     * })
     * 
     */
    create<T extends EscapeGameSessionCreateArgs>(args: SelectSubset<T, EscapeGameSessionCreateArgs<ExtArgs>>): Prisma__EscapeGameSessionClient<$Result.GetResult<Prisma.$EscapeGameSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EscapeGameSessions.
     * @param {EscapeGameSessionCreateManyArgs} args - Arguments to create many EscapeGameSessions.
     * @example
     * // Create many EscapeGameSessions
     * const escapeGameSession = await prisma.escapeGameSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EscapeGameSessionCreateManyArgs>(args?: SelectSubset<T, EscapeGameSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a EscapeGameSession.
     * @param {EscapeGameSessionDeleteArgs} args - Arguments to delete one EscapeGameSession.
     * @example
     * // Delete one EscapeGameSession
     * const EscapeGameSession = await prisma.escapeGameSession.delete({
     *   where: {
     *     // ... filter to delete one EscapeGameSession
     *   }
     * })
     * 
     */
    delete<T extends EscapeGameSessionDeleteArgs>(args: SelectSubset<T, EscapeGameSessionDeleteArgs<ExtArgs>>): Prisma__EscapeGameSessionClient<$Result.GetResult<Prisma.$EscapeGameSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EscapeGameSession.
     * @param {EscapeGameSessionUpdateArgs} args - Arguments to update one EscapeGameSession.
     * @example
     * // Update one EscapeGameSession
     * const escapeGameSession = await prisma.escapeGameSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EscapeGameSessionUpdateArgs>(args: SelectSubset<T, EscapeGameSessionUpdateArgs<ExtArgs>>): Prisma__EscapeGameSessionClient<$Result.GetResult<Prisma.$EscapeGameSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EscapeGameSessions.
     * @param {EscapeGameSessionDeleteManyArgs} args - Arguments to filter EscapeGameSessions to delete.
     * @example
     * // Delete a few EscapeGameSessions
     * const { count } = await prisma.escapeGameSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EscapeGameSessionDeleteManyArgs>(args?: SelectSubset<T, EscapeGameSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EscapeGameSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EscapeGameSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EscapeGameSessions
     * const escapeGameSession = await prisma.escapeGameSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EscapeGameSessionUpdateManyArgs>(args: SelectSubset<T, EscapeGameSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EscapeGameSession.
     * @param {EscapeGameSessionUpsertArgs} args - Arguments to update or create a EscapeGameSession.
     * @example
     * // Update or create a EscapeGameSession
     * const escapeGameSession = await prisma.escapeGameSession.upsert({
     *   create: {
     *     // ... data to create a EscapeGameSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EscapeGameSession we want to update
     *   }
     * })
     */
    upsert<T extends EscapeGameSessionUpsertArgs>(args: SelectSubset<T, EscapeGameSessionUpsertArgs<ExtArgs>>): Prisma__EscapeGameSessionClient<$Result.GetResult<Prisma.$EscapeGameSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EscapeGameSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EscapeGameSessionCountArgs} args - Arguments to filter EscapeGameSessions to count.
     * @example
     * // Count the number of EscapeGameSessions
     * const count = await prisma.escapeGameSession.count({
     *   where: {
     *     // ... the filter for the EscapeGameSessions we want to count
     *   }
     * })
    **/
    count<T extends EscapeGameSessionCountArgs>(
      args?: Subset<T, EscapeGameSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EscapeGameSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EscapeGameSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EscapeGameSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EscapeGameSessionAggregateArgs>(args: Subset<T, EscapeGameSessionAggregateArgs>): Prisma.PrismaPromise<GetEscapeGameSessionAggregateType<T>>

    /**
     * Group by EscapeGameSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EscapeGameSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EscapeGameSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EscapeGameSessionGroupByArgs['orderBy'] }
        : { orderBy?: EscapeGameSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EscapeGameSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEscapeGameSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EscapeGameSession model
   */
  readonly fields: EscapeGameSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EscapeGameSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EscapeGameSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EscapeGameSession model
   */
  interface EscapeGameSessionFieldRefs {
    readonly id: FieldRef<"EscapeGameSession", 'Int'>
    readonly session_id: FieldRef<"EscapeGameSession", 'String'>
    readonly ip: FieldRef<"EscapeGameSession", 'String'>
    readonly navigateur: FieldRef<"EscapeGameSession", 'String'>
  }
    

  // Custom InputTypes
  /**
   * EscapeGameSession findUnique
   */
  export type EscapeGameSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscapeGameSession
     */
    select?: EscapeGameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EscapeGameSession
     */
    omit?: EscapeGameSessionOmit<ExtArgs> | null
    /**
     * Filter, which EscapeGameSession to fetch.
     */
    where: EscapeGameSessionWhereUniqueInput
  }

  /**
   * EscapeGameSession findUniqueOrThrow
   */
  export type EscapeGameSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscapeGameSession
     */
    select?: EscapeGameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EscapeGameSession
     */
    omit?: EscapeGameSessionOmit<ExtArgs> | null
    /**
     * Filter, which EscapeGameSession to fetch.
     */
    where: EscapeGameSessionWhereUniqueInput
  }

  /**
   * EscapeGameSession findFirst
   */
  export type EscapeGameSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscapeGameSession
     */
    select?: EscapeGameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EscapeGameSession
     */
    omit?: EscapeGameSessionOmit<ExtArgs> | null
    /**
     * Filter, which EscapeGameSession to fetch.
     */
    where?: EscapeGameSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EscapeGameSessions to fetch.
     */
    orderBy?: EscapeGameSessionOrderByWithRelationInput | EscapeGameSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EscapeGameSessions.
     */
    cursor?: EscapeGameSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EscapeGameSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EscapeGameSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EscapeGameSessions.
     */
    distinct?: EscapeGameSessionScalarFieldEnum | EscapeGameSessionScalarFieldEnum[]
  }

  /**
   * EscapeGameSession findFirstOrThrow
   */
  export type EscapeGameSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscapeGameSession
     */
    select?: EscapeGameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EscapeGameSession
     */
    omit?: EscapeGameSessionOmit<ExtArgs> | null
    /**
     * Filter, which EscapeGameSession to fetch.
     */
    where?: EscapeGameSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EscapeGameSessions to fetch.
     */
    orderBy?: EscapeGameSessionOrderByWithRelationInput | EscapeGameSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EscapeGameSessions.
     */
    cursor?: EscapeGameSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EscapeGameSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EscapeGameSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EscapeGameSessions.
     */
    distinct?: EscapeGameSessionScalarFieldEnum | EscapeGameSessionScalarFieldEnum[]
  }

  /**
   * EscapeGameSession findMany
   */
  export type EscapeGameSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscapeGameSession
     */
    select?: EscapeGameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EscapeGameSession
     */
    omit?: EscapeGameSessionOmit<ExtArgs> | null
    /**
     * Filter, which EscapeGameSessions to fetch.
     */
    where?: EscapeGameSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EscapeGameSessions to fetch.
     */
    orderBy?: EscapeGameSessionOrderByWithRelationInput | EscapeGameSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EscapeGameSessions.
     */
    cursor?: EscapeGameSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EscapeGameSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EscapeGameSessions.
     */
    skip?: number
    distinct?: EscapeGameSessionScalarFieldEnum | EscapeGameSessionScalarFieldEnum[]
  }

  /**
   * EscapeGameSession create
   */
  export type EscapeGameSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscapeGameSession
     */
    select?: EscapeGameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EscapeGameSession
     */
    omit?: EscapeGameSessionOmit<ExtArgs> | null
    /**
     * The data needed to create a EscapeGameSession.
     */
    data: XOR<EscapeGameSessionCreateInput, EscapeGameSessionUncheckedCreateInput>
  }

  /**
   * EscapeGameSession createMany
   */
  export type EscapeGameSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EscapeGameSessions.
     */
    data: EscapeGameSessionCreateManyInput | EscapeGameSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EscapeGameSession update
   */
  export type EscapeGameSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscapeGameSession
     */
    select?: EscapeGameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EscapeGameSession
     */
    omit?: EscapeGameSessionOmit<ExtArgs> | null
    /**
     * The data needed to update a EscapeGameSession.
     */
    data: XOR<EscapeGameSessionUpdateInput, EscapeGameSessionUncheckedUpdateInput>
    /**
     * Choose, which EscapeGameSession to update.
     */
    where: EscapeGameSessionWhereUniqueInput
  }

  /**
   * EscapeGameSession updateMany
   */
  export type EscapeGameSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EscapeGameSessions.
     */
    data: XOR<EscapeGameSessionUpdateManyMutationInput, EscapeGameSessionUncheckedUpdateManyInput>
    /**
     * Filter which EscapeGameSessions to update
     */
    where?: EscapeGameSessionWhereInput
    /**
     * Limit how many EscapeGameSessions to update.
     */
    limit?: number
  }

  /**
   * EscapeGameSession upsert
   */
  export type EscapeGameSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscapeGameSession
     */
    select?: EscapeGameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EscapeGameSession
     */
    omit?: EscapeGameSessionOmit<ExtArgs> | null
    /**
     * The filter to search for the EscapeGameSession to update in case it exists.
     */
    where: EscapeGameSessionWhereUniqueInput
    /**
     * In case the EscapeGameSession found by the `where` argument doesn't exist, create a new EscapeGameSession with this data.
     */
    create: XOR<EscapeGameSessionCreateInput, EscapeGameSessionUncheckedCreateInput>
    /**
     * In case the EscapeGameSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EscapeGameSessionUpdateInput, EscapeGameSessionUncheckedUpdateInput>
  }

  /**
   * EscapeGameSession delete
   */
  export type EscapeGameSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscapeGameSession
     */
    select?: EscapeGameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EscapeGameSession
     */
    omit?: EscapeGameSessionOmit<ExtArgs> | null
    /**
     * Filter which EscapeGameSession to delete.
     */
    where: EscapeGameSessionWhereUniqueInput
  }

  /**
   * EscapeGameSession deleteMany
   */
  export type EscapeGameSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EscapeGameSessions to delete
     */
    where?: EscapeGameSessionWhereInput
    /**
     * Limit how many EscapeGameSessions to delete.
     */
    limit?: number
  }

  /**
   * EscapeGameSession without action
   */
  export type EscapeGameSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscapeGameSession
     */
    select?: EscapeGameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EscapeGameSession
     */
    omit?: EscapeGameSessionOmit<ExtArgs> | null
  }


  /**
   * Model Partie
   */

  export type AggregatePartie = {
    _count: PartieCountAggregateOutputType | null
    _avg: PartieAvgAggregateOutputType | null
    _sum: PartieSumAggregateOutputType | null
    _min: PartieMinAggregateOutputType | null
    _max: PartieMaxAggregateOutputType | null
  }

  export type PartieAvgAggregateOutputType = {
    id: number | null
    scoreS: number | null
    scoreC: number | null
    scoreR: number | null
    scoreE: number | null
  }

  export type PartieSumAggregateOutputType = {
    id: number | null
    scoreS: number | null
    scoreC: number | null
    scoreR: number | null
    scoreE: number | null
  }

  export type PartieMinAggregateOutputType = {
    id: number | null
    passSession: string | null
    scoreS: number | null
    scoreC: number | null
    scoreR: number | null
    scoreE: number | null
    questionIdsS: string | null
    questionIdsC: string | null
    questionIdsR: string | null
    answeredQuestionsS: string | null
    answeredQuestionsC: string | null
    answeredQuestionsR: string | null
  }

  export type PartieMaxAggregateOutputType = {
    id: number | null
    passSession: string | null
    scoreS: number | null
    scoreC: number | null
    scoreR: number | null
    scoreE: number | null
    questionIdsS: string | null
    questionIdsC: string | null
    questionIdsR: string | null
    answeredQuestionsS: string | null
    answeredQuestionsC: string | null
    answeredQuestionsR: string | null
  }

  export type PartieCountAggregateOutputType = {
    id: number
    passSession: number
    scoreS: number
    scoreC: number
    scoreR: number
    scoreE: number
    questionIdsS: number
    questionIdsC: number
    questionIdsR: number
    answeredQuestionsS: number
    answeredQuestionsC: number
    answeredQuestionsR: number
    _all: number
  }


  export type PartieAvgAggregateInputType = {
    id?: true
    scoreS?: true
    scoreC?: true
    scoreR?: true
    scoreE?: true
  }

  export type PartieSumAggregateInputType = {
    id?: true
    scoreS?: true
    scoreC?: true
    scoreR?: true
    scoreE?: true
  }

  export type PartieMinAggregateInputType = {
    id?: true
    passSession?: true
    scoreS?: true
    scoreC?: true
    scoreR?: true
    scoreE?: true
    questionIdsS?: true
    questionIdsC?: true
    questionIdsR?: true
    answeredQuestionsS?: true
    answeredQuestionsC?: true
    answeredQuestionsR?: true
  }

  export type PartieMaxAggregateInputType = {
    id?: true
    passSession?: true
    scoreS?: true
    scoreC?: true
    scoreR?: true
    scoreE?: true
    questionIdsS?: true
    questionIdsC?: true
    questionIdsR?: true
    answeredQuestionsS?: true
    answeredQuestionsC?: true
    answeredQuestionsR?: true
  }

  export type PartieCountAggregateInputType = {
    id?: true
    passSession?: true
    scoreS?: true
    scoreC?: true
    scoreR?: true
    scoreE?: true
    questionIdsS?: true
    questionIdsC?: true
    questionIdsR?: true
    answeredQuestionsS?: true
    answeredQuestionsC?: true
    answeredQuestionsR?: true
    _all?: true
  }

  export type PartieAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Partie to aggregate.
     */
    where?: PartieWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Parties to fetch.
     */
    orderBy?: PartieOrderByWithRelationInput | PartieOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PartieWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Parties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Parties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Parties
    **/
    _count?: true | PartieCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PartieAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PartieSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PartieMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PartieMaxAggregateInputType
  }

  export type GetPartieAggregateType<T extends PartieAggregateArgs> = {
        [P in keyof T & keyof AggregatePartie]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePartie[P]>
      : GetScalarType<T[P], AggregatePartie[P]>
  }




  export type PartieGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PartieWhereInput
    orderBy?: PartieOrderByWithAggregationInput | PartieOrderByWithAggregationInput[]
    by: PartieScalarFieldEnum[] | PartieScalarFieldEnum
    having?: PartieScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PartieCountAggregateInputType | true
    _avg?: PartieAvgAggregateInputType
    _sum?: PartieSumAggregateInputType
    _min?: PartieMinAggregateInputType
    _max?: PartieMaxAggregateInputType
  }

  export type PartieGroupByOutputType = {
    id: number
    passSession: string
    scoreS: number
    scoreC: number
    scoreR: number
    scoreE: number
    questionIdsS: string | null
    questionIdsC: string | null
    questionIdsR: string | null
    answeredQuestionsS: string | null
    answeredQuestionsC: string | null
    answeredQuestionsR: string | null
    _count: PartieCountAggregateOutputType | null
    _avg: PartieAvgAggregateOutputType | null
    _sum: PartieSumAggregateOutputType | null
    _min: PartieMinAggregateOutputType | null
    _max: PartieMaxAggregateOutputType | null
  }

  type GetPartieGroupByPayload<T extends PartieGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PartieGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PartieGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PartieGroupByOutputType[P]>
            : GetScalarType<T[P], PartieGroupByOutputType[P]>
        }
      >
    >


  export type PartieSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    passSession?: boolean
    scoreS?: boolean
    scoreC?: boolean
    scoreR?: boolean
    scoreE?: boolean
    questionIdsS?: boolean
    questionIdsC?: boolean
    questionIdsR?: boolean
    answeredQuestionsS?: boolean
    answeredQuestionsC?: boolean
    answeredQuestionsR?: boolean
  }, ExtArgs["result"]["partie"]>



  export type PartieSelectScalar = {
    id?: boolean
    passSession?: boolean
    scoreS?: boolean
    scoreC?: boolean
    scoreR?: boolean
    scoreE?: boolean
    questionIdsS?: boolean
    questionIdsC?: boolean
    questionIdsR?: boolean
    answeredQuestionsS?: boolean
    answeredQuestionsC?: boolean
    answeredQuestionsR?: boolean
  }

  export type PartieOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "passSession" | "scoreS" | "scoreC" | "scoreR" | "scoreE" | "questionIdsS" | "questionIdsC" | "questionIdsR" | "answeredQuestionsS" | "answeredQuestionsC" | "answeredQuestionsR", ExtArgs["result"]["partie"]>

  export type $PartiePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Partie"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      passSession: string
      scoreS: number
      scoreC: number
      scoreR: number
      scoreE: number
      questionIdsS: string | null
      questionIdsC: string | null
      questionIdsR: string | null
      answeredQuestionsS: string | null
      answeredQuestionsC: string | null
      answeredQuestionsR: string | null
    }, ExtArgs["result"]["partie"]>
    composites: {}
  }

  type PartieGetPayload<S extends boolean | null | undefined | PartieDefaultArgs> = $Result.GetResult<Prisma.$PartiePayload, S>

  type PartieCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PartieFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PartieCountAggregateInputType | true
    }

  export interface PartieDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Partie'], meta: { name: 'Partie' } }
    /**
     * Find zero or one Partie that matches the filter.
     * @param {PartieFindUniqueArgs} args - Arguments to find a Partie
     * @example
     * // Get one Partie
     * const partie = await prisma.partie.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PartieFindUniqueArgs>(args: SelectSubset<T, PartieFindUniqueArgs<ExtArgs>>): Prisma__PartieClient<$Result.GetResult<Prisma.$PartiePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Partie that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PartieFindUniqueOrThrowArgs} args - Arguments to find a Partie
     * @example
     * // Get one Partie
     * const partie = await prisma.partie.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PartieFindUniqueOrThrowArgs>(args: SelectSubset<T, PartieFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PartieClient<$Result.GetResult<Prisma.$PartiePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Partie that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartieFindFirstArgs} args - Arguments to find a Partie
     * @example
     * // Get one Partie
     * const partie = await prisma.partie.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PartieFindFirstArgs>(args?: SelectSubset<T, PartieFindFirstArgs<ExtArgs>>): Prisma__PartieClient<$Result.GetResult<Prisma.$PartiePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Partie that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartieFindFirstOrThrowArgs} args - Arguments to find a Partie
     * @example
     * // Get one Partie
     * const partie = await prisma.partie.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PartieFindFirstOrThrowArgs>(args?: SelectSubset<T, PartieFindFirstOrThrowArgs<ExtArgs>>): Prisma__PartieClient<$Result.GetResult<Prisma.$PartiePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Parties that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartieFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Parties
     * const parties = await prisma.partie.findMany()
     * 
     * // Get first 10 Parties
     * const parties = await prisma.partie.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const partieWithIdOnly = await prisma.partie.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PartieFindManyArgs>(args?: SelectSubset<T, PartieFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PartiePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Partie.
     * @param {PartieCreateArgs} args - Arguments to create a Partie.
     * @example
     * // Create one Partie
     * const Partie = await prisma.partie.create({
     *   data: {
     *     // ... data to create a Partie
     *   }
     * })
     * 
     */
    create<T extends PartieCreateArgs>(args: SelectSubset<T, PartieCreateArgs<ExtArgs>>): Prisma__PartieClient<$Result.GetResult<Prisma.$PartiePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Parties.
     * @param {PartieCreateManyArgs} args - Arguments to create many Parties.
     * @example
     * // Create many Parties
     * const partie = await prisma.partie.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PartieCreateManyArgs>(args?: SelectSubset<T, PartieCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Partie.
     * @param {PartieDeleteArgs} args - Arguments to delete one Partie.
     * @example
     * // Delete one Partie
     * const Partie = await prisma.partie.delete({
     *   where: {
     *     // ... filter to delete one Partie
     *   }
     * })
     * 
     */
    delete<T extends PartieDeleteArgs>(args: SelectSubset<T, PartieDeleteArgs<ExtArgs>>): Prisma__PartieClient<$Result.GetResult<Prisma.$PartiePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Partie.
     * @param {PartieUpdateArgs} args - Arguments to update one Partie.
     * @example
     * // Update one Partie
     * const partie = await prisma.partie.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PartieUpdateArgs>(args: SelectSubset<T, PartieUpdateArgs<ExtArgs>>): Prisma__PartieClient<$Result.GetResult<Prisma.$PartiePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Parties.
     * @param {PartieDeleteManyArgs} args - Arguments to filter Parties to delete.
     * @example
     * // Delete a few Parties
     * const { count } = await prisma.partie.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PartieDeleteManyArgs>(args?: SelectSubset<T, PartieDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Parties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartieUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Parties
     * const partie = await prisma.partie.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PartieUpdateManyArgs>(args: SelectSubset<T, PartieUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Partie.
     * @param {PartieUpsertArgs} args - Arguments to update or create a Partie.
     * @example
     * // Update or create a Partie
     * const partie = await prisma.partie.upsert({
     *   create: {
     *     // ... data to create a Partie
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Partie we want to update
     *   }
     * })
     */
    upsert<T extends PartieUpsertArgs>(args: SelectSubset<T, PartieUpsertArgs<ExtArgs>>): Prisma__PartieClient<$Result.GetResult<Prisma.$PartiePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Parties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartieCountArgs} args - Arguments to filter Parties to count.
     * @example
     * // Count the number of Parties
     * const count = await prisma.partie.count({
     *   where: {
     *     // ... the filter for the Parties we want to count
     *   }
     * })
    **/
    count<T extends PartieCountArgs>(
      args?: Subset<T, PartieCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PartieCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Partie.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartieAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PartieAggregateArgs>(args: Subset<T, PartieAggregateArgs>): Prisma.PrismaPromise<GetPartieAggregateType<T>>

    /**
     * Group by Partie.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartieGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PartieGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PartieGroupByArgs['orderBy'] }
        : { orderBy?: PartieGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PartieGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPartieGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Partie model
   */
  readonly fields: PartieFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Partie.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PartieClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Partie model
   */
  interface PartieFieldRefs {
    readonly id: FieldRef<"Partie", 'Int'>
    readonly passSession: FieldRef<"Partie", 'String'>
    readonly scoreS: FieldRef<"Partie", 'Int'>
    readonly scoreC: FieldRef<"Partie", 'Int'>
    readonly scoreR: FieldRef<"Partie", 'Int'>
    readonly scoreE: FieldRef<"Partie", 'Int'>
    readonly questionIdsS: FieldRef<"Partie", 'String'>
    readonly questionIdsC: FieldRef<"Partie", 'String'>
    readonly questionIdsR: FieldRef<"Partie", 'String'>
    readonly answeredQuestionsS: FieldRef<"Partie", 'String'>
    readonly answeredQuestionsC: FieldRef<"Partie", 'String'>
    readonly answeredQuestionsR: FieldRef<"Partie", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Partie findUnique
   */
  export type PartieFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partie
     */
    select?: PartieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partie
     */
    omit?: PartieOmit<ExtArgs> | null
    /**
     * Filter, which Partie to fetch.
     */
    where: PartieWhereUniqueInput
  }

  /**
   * Partie findUniqueOrThrow
   */
  export type PartieFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partie
     */
    select?: PartieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partie
     */
    omit?: PartieOmit<ExtArgs> | null
    /**
     * Filter, which Partie to fetch.
     */
    where: PartieWhereUniqueInput
  }

  /**
   * Partie findFirst
   */
  export type PartieFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partie
     */
    select?: PartieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partie
     */
    omit?: PartieOmit<ExtArgs> | null
    /**
     * Filter, which Partie to fetch.
     */
    where?: PartieWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Parties to fetch.
     */
    orderBy?: PartieOrderByWithRelationInput | PartieOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Parties.
     */
    cursor?: PartieWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Parties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Parties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Parties.
     */
    distinct?: PartieScalarFieldEnum | PartieScalarFieldEnum[]
  }

  /**
   * Partie findFirstOrThrow
   */
  export type PartieFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partie
     */
    select?: PartieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partie
     */
    omit?: PartieOmit<ExtArgs> | null
    /**
     * Filter, which Partie to fetch.
     */
    where?: PartieWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Parties to fetch.
     */
    orderBy?: PartieOrderByWithRelationInput | PartieOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Parties.
     */
    cursor?: PartieWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Parties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Parties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Parties.
     */
    distinct?: PartieScalarFieldEnum | PartieScalarFieldEnum[]
  }

  /**
   * Partie findMany
   */
  export type PartieFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partie
     */
    select?: PartieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partie
     */
    omit?: PartieOmit<ExtArgs> | null
    /**
     * Filter, which Parties to fetch.
     */
    where?: PartieWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Parties to fetch.
     */
    orderBy?: PartieOrderByWithRelationInput | PartieOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Parties.
     */
    cursor?: PartieWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Parties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Parties.
     */
    skip?: number
    distinct?: PartieScalarFieldEnum | PartieScalarFieldEnum[]
  }

  /**
   * Partie create
   */
  export type PartieCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partie
     */
    select?: PartieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partie
     */
    omit?: PartieOmit<ExtArgs> | null
    /**
     * The data needed to create a Partie.
     */
    data: XOR<PartieCreateInput, PartieUncheckedCreateInput>
  }

  /**
   * Partie createMany
   */
  export type PartieCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Parties.
     */
    data: PartieCreateManyInput | PartieCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Partie update
   */
  export type PartieUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partie
     */
    select?: PartieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partie
     */
    omit?: PartieOmit<ExtArgs> | null
    /**
     * The data needed to update a Partie.
     */
    data: XOR<PartieUpdateInput, PartieUncheckedUpdateInput>
    /**
     * Choose, which Partie to update.
     */
    where: PartieWhereUniqueInput
  }

  /**
   * Partie updateMany
   */
  export type PartieUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Parties.
     */
    data: XOR<PartieUpdateManyMutationInput, PartieUncheckedUpdateManyInput>
    /**
     * Filter which Parties to update
     */
    where?: PartieWhereInput
    /**
     * Limit how many Parties to update.
     */
    limit?: number
  }

  /**
   * Partie upsert
   */
  export type PartieUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partie
     */
    select?: PartieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partie
     */
    omit?: PartieOmit<ExtArgs> | null
    /**
     * The filter to search for the Partie to update in case it exists.
     */
    where: PartieWhereUniqueInput
    /**
     * In case the Partie found by the `where` argument doesn't exist, create a new Partie with this data.
     */
    create: XOR<PartieCreateInput, PartieUncheckedCreateInput>
    /**
     * In case the Partie was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PartieUpdateInput, PartieUncheckedUpdateInput>
  }

  /**
   * Partie delete
   */
  export type PartieDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partie
     */
    select?: PartieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partie
     */
    omit?: PartieOmit<ExtArgs> | null
    /**
     * Filter which Partie to delete.
     */
    where: PartieWhereUniqueInput
  }

  /**
   * Partie deleteMany
   */
  export type PartieDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Parties to delete
     */
    where?: PartieWhereInput
    /**
     * Limit how many Parties to delete.
     */
    limit?: number
  }

  /**
   * Partie without action
   */
  export type PartieDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partie
     */
    select?: PartieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partie
     */
    omit?: PartieOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ConqueteScalarFieldEnum: {
    id: 'id',
    question: 'question',
    reponse: 'reponse'
  };

  export type ConqueteScalarFieldEnum = (typeof ConqueteScalarFieldEnum)[keyof typeof ConqueteScalarFieldEnum]


  export const StructureScalarFieldEnum: {
    id: 'id',
    question: 'question',
    reponse: 'reponse'
  };

  export type StructureScalarFieldEnum = (typeof StructureScalarFieldEnum)[keyof typeof StructureScalarFieldEnum]


  export const RebusScalarFieldEnum: {
    id: 'id',
    reponse: 'reponse'
  };

  export type RebusScalarFieldEnum = (typeof RebusScalarFieldEnum)[keyof typeof RebusScalarFieldEnum]


  export const EnigmesScalarFieldEnum: {
    id: 'id',
    question: 'question',
    reponse: 'reponse'
  };

  export type EnigmesScalarFieldEnum = (typeof EnigmesScalarFieldEnum)[keyof typeof EnigmesScalarFieldEnum]


  export const EscapeGameSessionScalarFieldEnum: {
    id: 'id',
    session_id: 'session_id',
    ip: 'ip',
    navigateur: 'navigateur'
  };

  export type EscapeGameSessionScalarFieldEnum = (typeof EscapeGameSessionScalarFieldEnum)[keyof typeof EscapeGameSessionScalarFieldEnum]


  export const PartieScalarFieldEnum: {
    id: 'id',
    passSession: 'passSession',
    scoreS: 'scoreS',
    scoreC: 'scoreC',
    scoreR: 'scoreR',
    scoreE: 'scoreE',
    questionIdsS: 'questionIdsS',
    questionIdsC: 'questionIdsC',
    questionIdsR: 'questionIdsR',
    answeredQuestionsS: 'answeredQuestionsS',
    answeredQuestionsC: 'answeredQuestionsC',
    answeredQuestionsR: 'answeredQuestionsR'
  };

  export type PartieScalarFieldEnum = (typeof PartieScalarFieldEnum)[keyof typeof PartieScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const ConqueteOrderByRelevanceFieldEnum: {
    question: 'question',
    reponse: 'reponse'
  };

  export type ConqueteOrderByRelevanceFieldEnum = (typeof ConqueteOrderByRelevanceFieldEnum)[keyof typeof ConqueteOrderByRelevanceFieldEnum]


  export const StructureOrderByRelevanceFieldEnum: {
    question: 'question',
    reponse: 'reponse'
  };

  export type StructureOrderByRelevanceFieldEnum = (typeof StructureOrderByRelevanceFieldEnum)[keyof typeof StructureOrderByRelevanceFieldEnum]


  export const RebusOrderByRelevanceFieldEnum: {
    reponse: 'reponse'
  };

  export type RebusOrderByRelevanceFieldEnum = (typeof RebusOrderByRelevanceFieldEnum)[keyof typeof RebusOrderByRelevanceFieldEnum]


  export const EnigmesOrderByRelevanceFieldEnum: {
    question: 'question',
    reponse: 'reponse'
  };

  export type EnigmesOrderByRelevanceFieldEnum = (typeof EnigmesOrderByRelevanceFieldEnum)[keyof typeof EnigmesOrderByRelevanceFieldEnum]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const EscapeGameSessionOrderByRelevanceFieldEnum: {
    session_id: 'session_id',
    ip: 'ip',
    navigateur: 'navigateur'
  };

  export type EscapeGameSessionOrderByRelevanceFieldEnum = (typeof EscapeGameSessionOrderByRelevanceFieldEnum)[keyof typeof EscapeGameSessionOrderByRelevanceFieldEnum]


  export const PartieOrderByRelevanceFieldEnum: {
    passSession: 'passSession',
    questionIdsS: 'questionIdsS',
    questionIdsC: 'questionIdsC',
    questionIdsR: 'questionIdsR',
    answeredQuestionsS: 'answeredQuestionsS',
    answeredQuestionsC: 'answeredQuestionsC',
    answeredQuestionsR: 'answeredQuestionsR'
  };

  export type PartieOrderByRelevanceFieldEnum = (typeof PartieOrderByRelevanceFieldEnum)[keyof typeof PartieOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type ConqueteWhereInput = {
    AND?: ConqueteWhereInput | ConqueteWhereInput[]
    OR?: ConqueteWhereInput[]
    NOT?: ConqueteWhereInput | ConqueteWhereInput[]
    id?: IntFilter<"Conquete"> | number
    question?: StringFilter<"Conquete"> | string
    reponse?: StringFilter<"Conquete"> | string
  }

  export type ConqueteOrderByWithRelationInput = {
    id?: SortOrder
    question?: SortOrder
    reponse?: SortOrder
    _relevance?: ConqueteOrderByRelevanceInput
  }

  export type ConqueteWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ConqueteWhereInput | ConqueteWhereInput[]
    OR?: ConqueteWhereInput[]
    NOT?: ConqueteWhereInput | ConqueteWhereInput[]
    question?: StringFilter<"Conquete"> | string
    reponse?: StringFilter<"Conquete"> | string
  }, "id">

  export type ConqueteOrderByWithAggregationInput = {
    id?: SortOrder
    question?: SortOrder
    reponse?: SortOrder
    _count?: ConqueteCountOrderByAggregateInput
    _avg?: ConqueteAvgOrderByAggregateInput
    _max?: ConqueteMaxOrderByAggregateInput
    _min?: ConqueteMinOrderByAggregateInput
    _sum?: ConqueteSumOrderByAggregateInput
  }

  export type ConqueteScalarWhereWithAggregatesInput = {
    AND?: ConqueteScalarWhereWithAggregatesInput | ConqueteScalarWhereWithAggregatesInput[]
    OR?: ConqueteScalarWhereWithAggregatesInput[]
    NOT?: ConqueteScalarWhereWithAggregatesInput | ConqueteScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Conquete"> | number
    question?: StringWithAggregatesFilter<"Conquete"> | string
    reponse?: StringWithAggregatesFilter<"Conquete"> | string
  }

  export type StructureWhereInput = {
    AND?: StructureWhereInput | StructureWhereInput[]
    OR?: StructureWhereInput[]
    NOT?: StructureWhereInput | StructureWhereInput[]
    id?: IntFilter<"Structure"> | number
    question?: StringFilter<"Structure"> | string
    reponse?: StringFilter<"Structure"> | string
  }

  export type StructureOrderByWithRelationInput = {
    id?: SortOrder
    question?: SortOrder
    reponse?: SortOrder
    _relevance?: StructureOrderByRelevanceInput
  }

  export type StructureWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: StructureWhereInput | StructureWhereInput[]
    OR?: StructureWhereInput[]
    NOT?: StructureWhereInput | StructureWhereInput[]
    question?: StringFilter<"Structure"> | string
    reponse?: StringFilter<"Structure"> | string
  }, "id">

  export type StructureOrderByWithAggregationInput = {
    id?: SortOrder
    question?: SortOrder
    reponse?: SortOrder
    _count?: StructureCountOrderByAggregateInput
    _avg?: StructureAvgOrderByAggregateInput
    _max?: StructureMaxOrderByAggregateInput
    _min?: StructureMinOrderByAggregateInput
    _sum?: StructureSumOrderByAggregateInput
  }

  export type StructureScalarWhereWithAggregatesInput = {
    AND?: StructureScalarWhereWithAggregatesInput | StructureScalarWhereWithAggregatesInput[]
    OR?: StructureScalarWhereWithAggregatesInput[]
    NOT?: StructureScalarWhereWithAggregatesInput | StructureScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Structure"> | number
    question?: StringWithAggregatesFilter<"Structure"> | string
    reponse?: StringWithAggregatesFilter<"Structure"> | string
  }

  export type RebusWhereInput = {
    AND?: RebusWhereInput | RebusWhereInput[]
    OR?: RebusWhereInput[]
    NOT?: RebusWhereInput | RebusWhereInput[]
    id?: IntFilter<"Rebus"> | number
    reponse?: StringFilter<"Rebus"> | string
  }

  export type RebusOrderByWithRelationInput = {
    id?: SortOrder
    reponse?: SortOrder
    _relevance?: RebusOrderByRelevanceInput
  }

  export type RebusWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RebusWhereInput | RebusWhereInput[]
    OR?: RebusWhereInput[]
    NOT?: RebusWhereInput | RebusWhereInput[]
    reponse?: StringFilter<"Rebus"> | string
  }, "id">

  export type RebusOrderByWithAggregationInput = {
    id?: SortOrder
    reponse?: SortOrder
    _count?: RebusCountOrderByAggregateInput
    _avg?: RebusAvgOrderByAggregateInput
    _max?: RebusMaxOrderByAggregateInput
    _min?: RebusMinOrderByAggregateInput
    _sum?: RebusSumOrderByAggregateInput
  }

  export type RebusScalarWhereWithAggregatesInput = {
    AND?: RebusScalarWhereWithAggregatesInput | RebusScalarWhereWithAggregatesInput[]
    OR?: RebusScalarWhereWithAggregatesInput[]
    NOT?: RebusScalarWhereWithAggregatesInput | RebusScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Rebus"> | number
    reponse?: StringWithAggregatesFilter<"Rebus"> | string
  }

  export type EnigmesWhereInput = {
    AND?: EnigmesWhereInput | EnigmesWhereInput[]
    OR?: EnigmesWhereInput[]
    NOT?: EnigmesWhereInput | EnigmesWhereInput[]
    id?: IntFilter<"Enigmes"> | number
    question?: StringFilter<"Enigmes"> | string
    reponse?: StringFilter<"Enigmes"> | string
  }

  export type EnigmesOrderByWithRelationInput = {
    id?: SortOrder
    question?: SortOrder
    reponse?: SortOrder
    _relevance?: EnigmesOrderByRelevanceInput
  }

  export type EnigmesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: EnigmesWhereInput | EnigmesWhereInput[]
    OR?: EnigmesWhereInput[]
    NOT?: EnigmesWhereInput | EnigmesWhereInput[]
    question?: StringFilter<"Enigmes"> | string
    reponse?: StringFilter<"Enigmes"> | string
  }, "id">

  export type EnigmesOrderByWithAggregationInput = {
    id?: SortOrder
    question?: SortOrder
    reponse?: SortOrder
    _count?: EnigmesCountOrderByAggregateInput
    _avg?: EnigmesAvgOrderByAggregateInput
    _max?: EnigmesMaxOrderByAggregateInput
    _min?: EnigmesMinOrderByAggregateInput
    _sum?: EnigmesSumOrderByAggregateInput
  }

  export type EnigmesScalarWhereWithAggregatesInput = {
    AND?: EnigmesScalarWhereWithAggregatesInput | EnigmesScalarWhereWithAggregatesInput[]
    OR?: EnigmesScalarWhereWithAggregatesInput[]
    NOT?: EnigmesScalarWhereWithAggregatesInput | EnigmesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Enigmes"> | number
    question?: StringWithAggregatesFilter<"Enigmes"> | string
    reponse?: StringWithAggregatesFilter<"Enigmes"> | string
  }

  export type EscapeGameSessionWhereInput = {
    AND?: EscapeGameSessionWhereInput | EscapeGameSessionWhereInput[]
    OR?: EscapeGameSessionWhereInput[]
    NOT?: EscapeGameSessionWhereInput | EscapeGameSessionWhereInput[]
    id?: IntFilter<"EscapeGameSession"> | number
    session_id?: StringFilter<"EscapeGameSession"> | string
    ip?: StringFilter<"EscapeGameSession"> | string
    navigateur?: StringNullableFilter<"EscapeGameSession"> | string | null
  }

  export type EscapeGameSessionOrderByWithRelationInput = {
    id?: SortOrder
    session_id?: SortOrder
    ip?: SortOrder
    navigateur?: SortOrderInput | SortOrder
    _relevance?: EscapeGameSessionOrderByRelevanceInput
  }

  export type EscapeGameSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    session_id?: string
    AND?: EscapeGameSessionWhereInput | EscapeGameSessionWhereInput[]
    OR?: EscapeGameSessionWhereInput[]
    NOT?: EscapeGameSessionWhereInput | EscapeGameSessionWhereInput[]
    ip?: StringFilter<"EscapeGameSession"> | string
    navigateur?: StringNullableFilter<"EscapeGameSession"> | string | null
  }, "id" | "session_id">

  export type EscapeGameSessionOrderByWithAggregationInput = {
    id?: SortOrder
    session_id?: SortOrder
    ip?: SortOrder
    navigateur?: SortOrderInput | SortOrder
    _count?: EscapeGameSessionCountOrderByAggregateInput
    _avg?: EscapeGameSessionAvgOrderByAggregateInput
    _max?: EscapeGameSessionMaxOrderByAggregateInput
    _min?: EscapeGameSessionMinOrderByAggregateInput
    _sum?: EscapeGameSessionSumOrderByAggregateInput
  }

  export type EscapeGameSessionScalarWhereWithAggregatesInput = {
    AND?: EscapeGameSessionScalarWhereWithAggregatesInput | EscapeGameSessionScalarWhereWithAggregatesInput[]
    OR?: EscapeGameSessionScalarWhereWithAggregatesInput[]
    NOT?: EscapeGameSessionScalarWhereWithAggregatesInput | EscapeGameSessionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"EscapeGameSession"> | number
    session_id?: StringWithAggregatesFilter<"EscapeGameSession"> | string
    ip?: StringWithAggregatesFilter<"EscapeGameSession"> | string
    navigateur?: StringNullableWithAggregatesFilter<"EscapeGameSession"> | string | null
  }

  export type PartieWhereInput = {
    AND?: PartieWhereInput | PartieWhereInput[]
    OR?: PartieWhereInput[]
    NOT?: PartieWhereInput | PartieWhereInput[]
    id?: IntFilter<"Partie"> | number
    passSession?: StringFilter<"Partie"> | string
    scoreS?: IntFilter<"Partie"> | number
    scoreC?: IntFilter<"Partie"> | number
    scoreR?: IntFilter<"Partie"> | number
    scoreE?: IntFilter<"Partie"> | number
    questionIdsS?: StringNullableFilter<"Partie"> | string | null
    questionIdsC?: StringNullableFilter<"Partie"> | string | null
    questionIdsR?: StringNullableFilter<"Partie"> | string | null
    answeredQuestionsS?: StringNullableFilter<"Partie"> | string | null
    answeredQuestionsC?: StringNullableFilter<"Partie"> | string | null
    answeredQuestionsR?: StringNullableFilter<"Partie"> | string | null
  }

  export type PartieOrderByWithRelationInput = {
    id?: SortOrder
    passSession?: SortOrder
    scoreS?: SortOrder
    scoreC?: SortOrder
    scoreR?: SortOrder
    scoreE?: SortOrder
    questionIdsS?: SortOrderInput | SortOrder
    questionIdsC?: SortOrderInput | SortOrder
    questionIdsR?: SortOrderInput | SortOrder
    answeredQuestionsS?: SortOrderInput | SortOrder
    answeredQuestionsC?: SortOrderInput | SortOrder
    answeredQuestionsR?: SortOrderInput | SortOrder
    _relevance?: PartieOrderByRelevanceInput
  }

  export type PartieWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PartieWhereInput | PartieWhereInput[]
    OR?: PartieWhereInput[]
    NOT?: PartieWhereInput | PartieWhereInput[]
    passSession?: StringFilter<"Partie"> | string
    scoreS?: IntFilter<"Partie"> | number
    scoreC?: IntFilter<"Partie"> | number
    scoreR?: IntFilter<"Partie"> | number
    scoreE?: IntFilter<"Partie"> | number
    questionIdsS?: StringNullableFilter<"Partie"> | string | null
    questionIdsC?: StringNullableFilter<"Partie"> | string | null
    questionIdsR?: StringNullableFilter<"Partie"> | string | null
    answeredQuestionsS?: StringNullableFilter<"Partie"> | string | null
    answeredQuestionsC?: StringNullableFilter<"Partie"> | string | null
    answeredQuestionsR?: StringNullableFilter<"Partie"> | string | null
  }, "id">

  export type PartieOrderByWithAggregationInput = {
    id?: SortOrder
    passSession?: SortOrder
    scoreS?: SortOrder
    scoreC?: SortOrder
    scoreR?: SortOrder
    scoreE?: SortOrder
    questionIdsS?: SortOrderInput | SortOrder
    questionIdsC?: SortOrderInput | SortOrder
    questionIdsR?: SortOrderInput | SortOrder
    answeredQuestionsS?: SortOrderInput | SortOrder
    answeredQuestionsC?: SortOrderInput | SortOrder
    answeredQuestionsR?: SortOrderInput | SortOrder
    _count?: PartieCountOrderByAggregateInput
    _avg?: PartieAvgOrderByAggregateInput
    _max?: PartieMaxOrderByAggregateInput
    _min?: PartieMinOrderByAggregateInput
    _sum?: PartieSumOrderByAggregateInput
  }

  export type PartieScalarWhereWithAggregatesInput = {
    AND?: PartieScalarWhereWithAggregatesInput | PartieScalarWhereWithAggregatesInput[]
    OR?: PartieScalarWhereWithAggregatesInput[]
    NOT?: PartieScalarWhereWithAggregatesInput | PartieScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Partie"> | number
    passSession?: StringWithAggregatesFilter<"Partie"> | string
    scoreS?: IntWithAggregatesFilter<"Partie"> | number
    scoreC?: IntWithAggregatesFilter<"Partie"> | number
    scoreR?: IntWithAggregatesFilter<"Partie"> | number
    scoreE?: IntWithAggregatesFilter<"Partie"> | number
    questionIdsS?: StringNullableWithAggregatesFilter<"Partie"> | string | null
    questionIdsC?: StringNullableWithAggregatesFilter<"Partie"> | string | null
    questionIdsR?: StringNullableWithAggregatesFilter<"Partie"> | string | null
    answeredQuestionsS?: StringNullableWithAggregatesFilter<"Partie"> | string | null
    answeredQuestionsC?: StringNullableWithAggregatesFilter<"Partie"> | string | null
    answeredQuestionsR?: StringNullableWithAggregatesFilter<"Partie"> | string | null
  }

  export type ConqueteCreateInput = {
    question: string
    reponse: string
  }

  export type ConqueteUncheckedCreateInput = {
    id?: number
    question: string
    reponse: string
  }

  export type ConqueteUpdateInput = {
    question?: StringFieldUpdateOperationsInput | string
    reponse?: StringFieldUpdateOperationsInput | string
  }

  export type ConqueteUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    question?: StringFieldUpdateOperationsInput | string
    reponse?: StringFieldUpdateOperationsInput | string
  }

  export type ConqueteCreateManyInput = {
    id?: number
    question: string
    reponse: string
  }

  export type ConqueteUpdateManyMutationInput = {
    question?: StringFieldUpdateOperationsInput | string
    reponse?: StringFieldUpdateOperationsInput | string
  }

  export type ConqueteUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    question?: StringFieldUpdateOperationsInput | string
    reponse?: StringFieldUpdateOperationsInput | string
  }

  export type StructureCreateInput = {
    question: string
    reponse: string
  }

  export type StructureUncheckedCreateInput = {
    id?: number
    question: string
    reponse: string
  }

  export type StructureUpdateInput = {
    question?: StringFieldUpdateOperationsInput | string
    reponse?: StringFieldUpdateOperationsInput | string
  }

  export type StructureUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    question?: StringFieldUpdateOperationsInput | string
    reponse?: StringFieldUpdateOperationsInput | string
  }

  export type StructureCreateManyInput = {
    id?: number
    question: string
    reponse: string
  }

  export type StructureUpdateManyMutationInput = {
    question?: StringFieldUpdateOperationsInput | string
    reponse?: StringFieldUpdateOperationsInput | string
  }

  export type StructureUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    question?: StringFieldUpdateOperationsInput | string
    reponse?: StringFieldUpdateOperationsInput | string
  }

  export type RebusCreateInput = {
    reponse: string
  }

  export type RebusUncheckedCreateInput = {
    id?: number
    reponse: string
  }

  export type RebusUpdateInput = {
    reponse?: StringFieldUpdateOperationsInput | string
  }

  export type RebusUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    reponse?: StringFieldUpdateOperationsInput | string
  }

  export type RebusCreateManyInput = {
    id?: number
    reponse: string
  }

  export type RebusUpdateManyMutationInput = {
    reponse?: StringFieldUpdateOperationsInput | string
  }

  export type RebusUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    reponse?: StringFieldUpdateOperationsInput | string
  }

  export type EnigmesCreateInput = {
    question: string
    reponse: string
  }

  export type EnigmesUncheckedCreateInput = {
    id?: number
    question: string
    reponse: string
  }

  export type EnigmesUpdateInput = {
    question?: StringFieldUpdateOperationsInput | string
    reponse?: StringFieldUpdateOperationsInput | string
  }

  export type EnigmesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    question?: StringFieldUpdateOperationsInput | string
    reponse?: StringFieldUpdateOperationsInput | string
  }

  export type EnigmesCreateManyInput = {
    id?: number
    question: string
    reponse: string
  }

  export type EnigmesUpdateManyMutationInput = {
    question?: StringFieldUpdateOperationsInput | string
    reponse?: StringFieldUpdateOperationsInput | string
  }

  export type EnigmesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    question?: StringFieldUpdateOperationsInput | string
    reponse?: StringFieldUpdateOperationsInput | string
  }

  export type EscapeGameSessionCreateInput = {
    session_id: string
    ip: string
    navigateur?: string | null
  }

  export type EscapeGameSessionUncheckedCreateInput = {
    id?: number
    session_id: string
    ip: string
    navigateur?: string | null
  }

  export type EscapeGameSessionUpdateInput = {
    session_id?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    navigateur?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EscapeGameSessionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    session_id?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    navigateur?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EscapeGameSessionCreateManyInput = {
    id?: number
    session_id: string
    ip: string
    navigateur?: string | null
  }

  export type EscapeGameSessionUpdateManyMutationInput = {
    session_id?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    navigateur?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EscapeGameSessionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    session_id?: StringFieldUpdateOperationsInput | string
    ip?: StringFieldUpdateOperationsInput | string
    navigateur?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PartieCreateInput = {
    passSession: string
    scoreS?: number
    scoreC?: number
    scoreR?: number
    scoreE?: number
    questionIdsS?: string | null
    questionIdsC?: string | null
    questionIdsR?: string | null
    answeredQuestionsS?: string | null
    answeredQuestionsC?: string | null
    answeredQuestionsR?: string | null
  }

  export type PartieUncheckedCreateInput = {
    id?: number
    passSession: string
    scoreS?: number
    scoreC?: number
    scoreR?: number
    scoreE?: number
    questionIdsS?: string | null
    questionIdsC?: string | null
    questionIdsR?: string | null
    answeredQuestionsS?: string | null
    answeredQuestionsC?: string | null
    answeredQuestionsR?: string | null
  }

  export type PartieUpdateInput = {
    passSession?: StringFieldUpdateOperationsInput | string
    scoreS?: IntFieldUpdateOperationsInput | number
    scoreC?: IntFieldUpdateOperationsInput | number
    scoreR?: IntFieldUpdateOperationsInput | number
    scoreE?: IntFieldUpdateOperationsInput | number
    questionIdsS?: NullableStringFieldUpdateOperationsInput | string | null
    questionIdsC?: NullableStringFieldUpdateOperationsInput | string | null
    questionIdsR?: NullableStringFieldUpdateOperationsInput | string | null
    answeredQuestionsS?: NullableStringFieldUpdateOperationsInput | string | null
    answeredQuestionsC?: NullableStringFieldUpdateOperationsInput | string | null
    answeredQuestionsR?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PartieUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    passSession?: StringFieldUpdateOperationsInput | string
    scoreS?: IntFieldUpdateOperationsInput | number
    scoreC?: IntFieldUpdateOperationsInput | number
    scoreR?: IntFieldUpdateOperationsInput | number
    scoreE?: IntFieldUpdateOperationsInput | number
    questionIdsS?: NullableStringFieldUpdateOperationsInput | string | null
    questionIdsC?: NullableStringFieldUpdateOperationsInput | string | null
    questionIdsR?: NullableStringFieldUpdateOperationsInput | string | null
    answeredQuestionsS?: NullableStringFieldUpdateOperationsInput | string | null
    answeredQuestionsC?: NullableStringFieldUpdateOperationsInput | string | null
    answeredQuestionsR?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PartieCreateManyInput = {
    id?: number
    passSession: string
    scoreS?: number
    scoreC?: number
    scoreR?: number
    scoreE?: number
    questionIdsS?: string | null
    questionIdsC?: string | null
    questionIdsR?: string | null
    answeredQuestionsS?: string | null
    answeredQuestionsC?: string | null
    answeredQuestionsR?: string | null
  }

  export type PartieUpdateManyMutationInput = {
    passSession?: StringFieldUpdateOperationsInput | string
    scoreS?: IntFieldUpdateOperationsInput | number
    scoreC?: IntFieldUpdateOperationsInput | number
    scoreR?: IntFieldUpdateOperationsInput | number
    scoreE?: IntFieldUpdateOperationsInput | number
    questionIdsS?: NullableStringFieldUpdateOperationsInput | string | null
    questionIdsC?: NullableStringFieldUpdateOperationsInput | string | null
    questionIdsR?: NullableStringFieldUpdateOperationsInput | string | null
    answeredQuestionsS?: NullableStringFieldUpdateOperationsInput | string | null
    answeredQuestionsC?: NullableStringFieldUpdateOperationsInput | string | null
    answeredQuestionsR?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PartieUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    passSession?: StringFieldUpdateOperationsInput | string
    scoreS?: IntFieldUpdateOperationsInput | number
    scoreC?: IntFieldUpdateOperationsInput | number
    scoreR?: IntFieldUpdateOperationsInput | number
    scoreE?: IntFieldUpdateOperationsInput | number
    questionIdsS?: NullableStringFieldUpdateOperationsInput | string | null
    questionIdsC?: NullableStringFieldUpdateOperationsInput | string | null
    questionIdsR?: NullableStringFieldUpdateOperationsInput | string | null
    answeredQuestionsS?: NullableStringFieldUpdateOperationsInput | string | null
    answeredQuestionsC?: NullableStringFieldUpdateOperationsInput | string | null
    answeredQuestionsR?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type ConqueteOrderByRelevanceInput = {
    fields: ConqueteOrderByRelevanceFieldEnum | ConqueteOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ConqueteCountOrderByAggregateInput = {
    id?: SortOrder
    question?: SortOrder
    reponse?: SortOrder
  }

  export type ConqueteAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ConqueteMaxOrderByAggregateInput = {
    id?: SortOrder
    question?: SortOrder
    reponse?: SortOrder
  }

  export type ConqueteMinOrderByAggregateInput = {
    id?: SortOrder
    question?: SortOrder
    reponse?: SortOrder
  }

  export type ConqueteSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StructureOrderByRelevanceInput = {
    fields: StructureOrderByRelevanceFieldEnum | StructureOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type StructureCountOrderByAggregateInput = {
    id?: SortOrder
    question?: SortOrder
    reponse?: SortOrder
  }

  export type StructureAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StructureMaxOrderByAggregateInput = {
    id?: SortOrder
    question?: SortOrder
    reponse?: SortOrder
  }

  export type StructureMinOrderByAggregateInput = {
    id?: SortOrder
    question?: SortOrder
    reponse?: SortOrder
  }

  export type StructureSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type RebusOrderByRelevanceInput = {
    fields: RebusOrderByRelevanceFieldEnum | RebusOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type RebusCountOrderByAggregateInput = {
    id?: SortOrder
    reponse?: SortOrder
  }

  export type RebusAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type RebusMaxOrderByAggregateInput = {
    id?: SortOrder
    reponse?: SortOrder
  }

  export type RebusMinOrderByAggregateInput = {
    id?: SortOrder
    reponse?: SortOrder
  }

  export type RebusSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnigmesOrderByRelevanceInput = {
    fields: EnigmesOrderByRelevanceFieldEnum | EnigmesOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type EnigmesCountOrderByAggregateInput = {
    id?: SortOrder
    question?: SortOrder
    reponse?: SortOrder
  }

  export type EnigmesAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnigmesMaxOrderByAggregateInput = {
    id?: SortOrder
    question?: SortOrder
    reponse?: SortOrder
  }

  export type EnigmesMinOrderByAggregateInput = {
    id?: SortOrder
    question?: SortOrder
    reponse?: SortOrder
  }

  export type EnigmesSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type EscapeGameSessionOrderByRelevanceInput = {
    fields: EscapeGameSessionOrderByRelevanceFieldEnum | EscapeGameSessionOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type EscapeGameSessionCountOrderByAggregateInput = {
    id?: SortOrder
    session_id?: SortOrder
    ip?: SortOrder
    navigateur?: SortOrder
  }

  export type EscapeGameSessionAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EscapeGameSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    session_id?: SortOrder
    ip?: SortOrder
    navigateur?: SortOrder
  }

  export type EscapeGameSessionMinOrderByAggregateInput = {
    id?: SortOrder
    session_id?: SortOrder
    ip?: SortOrder
    navigateur?: SortOrder
  }

  export type EscapeGameSessionSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type PartieOrderByRelevanceInput = {
    fields: PartieOrderByRelevanceFieldEnum | PartieOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PartieCountOrderByAggregateInput = {
    id?: SortOrder
    passSession?: SortOrder
    scoreS?: SortOrder
    scoreC?: SortOrder
    scoreR?: SortOrder
    scoreE?: SortOrder
    questionIdsS?: SortOrder
    questionIdsC?: SortOrder
    questionIdsR?: SortOrder
    answeredQuestionsS?: SortOrder
    answeredQuestionsC?: SortOrder
    answeredQuestionsR?: SortOrder
  }

  export type PartieAvgOrderByAggregateInput = {
    id?: SortOrder
    scoreS?: SortOrder
    scoreC?: SortOrder
    scoreR?: SortOrder
    scoreE?: SortOrder
  }

  export type PartieMaxOrderByAggregateInput = {
    id?: SortOrder
    passSession?: SortOrder
    scoreS?: SortOrder
    scoreC?: SortOrder
    scoreR?: SortOrder
    scoreE?: SortOrder
    questionIdsS?: SortOrder
    questionIdsC?: SortOrder
    questionIdsR?: SortOrder
    answeredQuestionsS?: SortOrder
    answeredQuestionsC?: SortOrder
    answeredQuestionsR?: SortOrder
  }

  export type PartieMinOrderByAggregateInput = {
    id?: SortOrder
    passSession?: SortOrder
    scoreS?: SortOrder
    scoreC?: SortOrder
    scoreR?: SortOrder
    scoreE?: SortOrder
    questionIdsS?: SortOrder
    questionIdsC?: SortOrder
    questionIdsR?: SortOrder
    answeredQuestionsS?: SortOrder
    answeredQuestionsC?: SortOrder
    answeredQuestionsR?: SortOrder
  }

  export type PartieSumOrderByAggregateInput = {
    id?: SortOrder
    scoreS?: SortOrder
    scoreC?: SortOrder
    scoreR?: SortOrder
    scoreE?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}