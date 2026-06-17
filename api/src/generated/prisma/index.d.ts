
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Organization
 * 
 */
export type Organization = $Result.DefaultSelection<Prisma.$OrganizationPayload>
/**
 * Model OrganizationMember
 * 
 */
export type OrganizationMember = $Result.DefaultSelection<Prisma.$OrganizationMemberPayload>
/**
 * Model OrganizationRole
 * 
 */
export type OrganizationRole = $Result.DefaultSelection<Prisma.$OrganizationRolePayload>
/**
 * Model Permission
 * 
 */
export type Permission = $Result.DefaultSelection<Prisma.$PermissionPayload>
/**
 * Model RolePermission
 * 
 */
export type RolePermission = $Result.DefaultSelection<Prisma.$RolePermissionPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model Integration
 * 
 */
export type Integration = $Result.DefaultSelection<Prisma.$IntegrationPayload>
/**
 * Model DatabaseIntegration
 * 
 */
export type DatabaseIntegration = $Result.DefaultSelection<Prisma.$DatabaseIntegrationPayload>
/**
 * Model OpenApiIntegration
 * 
 */
export type OpenApiIntegration = $Result.DefaultSelection<Prisma.$OpenApiIntegrationPayload>
/**
 * Model McpIntegration
 * 
 */
export type McpIntegration = $Result.DefaultSelection<Prisma.$McpIntegrationPayload>
/**
 * Model IntegrationAction
 * 
 */
export type IntegrationAction = $Result.DefaultSelection<Prisma.$IntegrationActionPayload>
/**
 * Model Document
 * 
 */
export type Document = $Result.DefaultSelection<Prisma.$DocumentPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const AuthRole: {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  SUPPORT: 'SUPPORT'
};

export type AuthRole = (typeof AuthRole)[keyof typeof AuthRole]


export const DocumentType: {
  LOGO: 'LOGO',
  BANNER: 'BANNER',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
  PDF: 'PDF',
  DOCUMENT: 'DOCUMENT',
  OTHER: 'OTHER'
};

export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType]


export const OrganizationMemberStatus: {
  ACTIVE: 'ACTIVE',
  INVITED: 'INVITED',
  SUSPENDED: 'SUSPENDED'
};

export type OrganizationMemberStatus = (typeof OrganizationMemberStatus)[keyof typeof OrganizationMemberStatus]


export const IntegrationProvider: {
  GITHUB: 'GITHUB',
  SLACK: 'SLACK',
  STRIPE: 'STRIPE',
  HUBSPOT: 'HUBSPOT',
  LINEAR: 'LINEAR',
  NOTION: 'NOTION',
  GOOGLE_DRIVE: 'GOOGLE_DRIVE',
  SMTP: 'SMTP',
  GMAIL: 'GMAIL',
  POSTHOG: 'POSTHOG',
  INTERCOM: 'INTERCOM',
  DATABASE_PG: 'DATABASE_PG',
  DATABASE_MYSQL: 'DATABASE_MYSQL',
  DATABASE_MONGO: 'DATABASE_MONGO',
  OPENAPI: 'OPENAPI',
  MCP: 'MCP'
};

export type IntegrationProvider = (typeof IntegrationProvider)[keyof typeof IntegrationProvider]


export const IntegrationStatus: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ERROR: 'ERROR'
};

export type IntegrationStatus = (typeof IntegrationStatus)[keyof typeof IntegrationStatus]


export const DatabaseType: {
  POSTGRESQL: 'POSTGRESQL',
  MYSQL: 'MYSQL',
  MONGODB: 'MONGODB'
};

export type DatabaseType = (typeof DatabaseType)[keyof typeof DatabaseType]


export const DatabaseOperation: {
  READ: 'READ',
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
};

export type DatabaseOperation = (typeof DatabaseOperation)[keyof typeof DatabaseOperation]


export const OpenApiAuthType: {
  NONE: 'NONE',
  API_KEY: 'API_KEY',
  BEARER: 'BEARER',
  OAUTH2: 'OAUTH2',
  CUSTOM_HEADERS: 'CUSTOM_HEADERS'
};

export type OpenApiAuthType = (typeof OpenApiAuthType)[keyof typeof OpenApiAuthType]


export const McpTransportType: {
  HTTP: 'HTTP',
  SSE: 'SSE'
};

export type McpTransportType = (typeof McpTransportType)[keyof typeof McpTransportType]


export const McpAuthType: {
  NONE: 'NONE',
  BEARER: 'BEARER',
  CUSTOM_HEADERS: 'CUSTOM_HEADERS',
  OAUTH: 'OAUTH'
};

export type McpAuthType = (typeof McpAuthType)[keyof typeof McpAuthType]

}

export type AuthRole = $Enums.AuthRole

export const AuthRole: typeof $Enums.AuthRole

export type DocumentType = $Enums.DocumentType

export const DocumentType: typeof $Enums.DocumentType

export type OrganizationMemberStatus = $Enums.OrganizationMemberStatus

export const OrganizationMemberStatus: typeof $Enums.OrganizationMemberStatus

export type IntegrationProvider = $Enums.IntegrationProvider

export const IntegrationProvider: typeof $Enums.IntegrationProvider

export type IntegrationStatus = $Enums.IntegrationStatus

export const IntegrationStatus: typeof $Enums.IntegrationStatus

export type DatabaseType = $Enums.DatabaseType

export const DatabaseType: typeof $Enums.DatabaseType

export type DatabaseOperation = $Enums.DatabaseOperation

export const DatabaseOperation: typeof $Enums.DatabaseOperation

export type OpenApiAuthType = $Enums.OpenApiAuthType

export const OpenApiAuthType: typeof $Enums.OpenApiAuthType

export type McpTransportType = $Enums.McpTransportType

export const McpTransportType: typeof $Enums.McpTransportType

export type McpAuthType = $Enums.McpAuthType

export const McpAuthType: typeof $Enums.McpAuthType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
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
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.organization`: Exposes CRUD operations for the **Organization** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Organizations
    * const organizations = await prisma.organization.findMany()
    * ```
    */
  get organization(): Prisma.OrganizationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.organizationMember`: Exposes CRUD operations for the **OrganizationMember** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OrganizationMembers
    * const organizationMembers = await prisma.organizationMember.findMany()
    * ```
    */
  get organizationMember(): Prisma.OrganizationMemberDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.organizationRole`: Exposes CRUD operations for the **OrganizationRole** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OrganizationRoles
    * const organizationRoles = await prisma.organizationRole.findMany()
    * ```
    */
  get organizationRole(): Prisma.OrganizationRoleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.permission`: Exposes CRUD operations for the **Permission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Permissions
    * const permissions = await prisma.permission.findMany()
    * ```
    */
  get permission(): Prisma.PermissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.rolePermission`: Exposes CRUD operations for the **RolePermission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RolePermissions
    * const rolePermissions = await prisma.rolePermission.findMany()
    * ```
    */
  get rolePermission(): Prisma.RolePermissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.integration`: Exposes CRUD operations for the **Integration** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Integrations
    * const integrations = await prisma.integration.findMany()
    * ```
    */
  get integration(): Prisma.IntegrationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.databaseIntegration`: Exposes CRUD operations for the **DatabaseIntegration** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DatabaseIntegrations
    * const databaseIntegrations = await prisma.databaseIntegration.findMany()
    * ```
    */
  get databaseIntegration(): Prisma.DatabaseIntegrationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.openApiIntegration`: Exposes CRUD operations for the **OpenApiIntegration** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OpenApiIntegrations
    * const openApiIntegrations = await prisma.openApiIntegration.findMany()
    * ```
    */
  get openApiIntegration(): Prisma.OpenApiIntegrationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mcpIntegration`: Exposes CRUD operations for the **McpIntegration** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more McpIntegrations
    * const mcpIntegrations = await prisma.mcpIntegration.findMany()
    * ```
    */
  get mcpIntegration(): Prisma.McpIntegrationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.integrationAction`: Exposes CRUD operations for the **IntegrationAction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more IntegrationActions
    * const integrationActions = await prisma.integrationAction.findMany()
    * ```
    */
  get integrationAction(): Prisma.IntegrationActionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.document`: Exposes CRUD operations for the **Document** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Documents
    * const documents = await prisma.document.findMany()
    * ```
    */
  get document(): Prisma.DocumentDelegate<ExtArgs, ClientOptions>;
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
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.2.0
   * Query Engine version: 0c8ef2ce45c83248ab3df073180d5eda9e8be7a3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
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
    User: 'User',
    Organization: 'Organization',
    OrganizationMember: 'OrganizationMember',
    OrganizationRole: 'OrganizationRole',
    Permission: 'Permission',
    RolePermission: 'RolePermission',
    AuditLog: 'AuditLog',
    Integration: 'Integration',
    DatabaseIntegration: 'DatabaseIntegration',
    OpenApiIntegration: 'OpenApiIntegration',
    McpIntegration: 'McpIntegration',
    IntegrationAction: 'IntegrationAction',
    Document: 'Document'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "organization" | "organizationMember" | "organizationRole" | "permission" | "rolePermission" | "auditLog" | "integration" | "databaseIntegration" | "openApiIntegration" | "mcpIntegration" | "integrationAction" | "document"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Organization: {
        payload: Prisma.$OrganizationPayload<ExtArgs>
        fields: Prisma.OrganizationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrganizationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrganizationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          findFirst: {
            args: Prisma.OrganizationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrganizationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          findMany: {
            args: Prisma.OrganizationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          create: {
            args: Prisma.OrganizationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          createMany: {
            args: Prisma.OrganizationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrganizationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          delete: {
            args: Prisma.OrganizationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          update: {
            args: Prisma.OrganizationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          deleteMany: {
            args: Prisma.OrganizationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrganizationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrganizationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          upsert: {
            args: Prisma.OrganizationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          aggregate: {
            args: Prisma.OrganizationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrganization>
          }
          groupBy: {
            args: Prisma.OrganizationGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrganizationGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrganizationCountArgs<ExtArgs>
            result: $Utils.Optional<OrganizationCountAggregateOutputType> | number
          }
        }
      }
      OrganizationMember: {
        payload: Prisma.$OrganizationMemberPayload<ExtArgs>
        fields: Prisma.OrganizationMemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrganizationMemberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationMemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrganizationMemberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationMemberPayload>
          }
          findFirst: {
            args: Prisma.OrganizationMemberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationMemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrganizationMemberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationMemberPayload>
          }
          findMany: {
            args: Prisma.OrganizationMemberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationMemberPayload>[]
          }
          create: {
            args: Prisma.OrganizationMemberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationMemberPayload>
          }
          createMany: {
            args: Prisma.OrganizationMemberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrganizationMemberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationMemberPayload>[]
          }
          delete: {
            args: Prisma.OrganizationMemberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationMemberPayload>
          }
          update: {
            args: Prisma.OrganizationMemberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationMemberPayload>
          }
          deleteMany: {
            args: Prisma.OrganizationMemberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrganizationMemberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrganizationMemberUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationMemberPayload>[]
          }
          upsert: {
            args: Prisma.OrganizationMemberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationMemberPayload>
          }
          aggregate: {
            args: Prisma.OrganizationMemberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrganizationMember>
          }
          groupBy: {
            args: Prisma.OrganizationMemberGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrganizationMemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrganizationMemberCountArgs<ExtArgs>
            result: $Utils.Optional<OrganizationMemberCountAggregateOutputType> | number
          }
        }
      }
      OrganizationRole: {
        payload: Prisma.$OrganizationRolePayload<ExtArgs>
        fields: Prisma.OrganizationRoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrganizationRoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationRolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrganizationRoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationRolePayload>
          }
          findFirst: {
            args: Prisma.OrganizationRoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationRolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrganizationRoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationRolePayload>
          }
          findMany: {
            args: Prisma.OrganizationRoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationRolePayload>[]
          }
          create: {
            args: Prisma.OrganizationRoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationRolePayload>
          }
          createMany: {
            args: Prisma.OrganizationRoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrganizationRoleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationRolePayload>[]
          }
          delete: {
            args: Prisma.OrganizationRoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationRolePayload>
          }
          update: {
            args: Prisma.OrganizationRoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationRolePayload>
          }
          deleteMany: {
            args: Prisma.OrganizationRoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrganizationRoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrganizationRoleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationRolePayload>[]
          }
          upsert: {
            args: Prisma.OrganizationRoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationRolePayload>
          }
          aggregate: {
            args: Prisma.OrganizationRoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrganizationRole>
          }
          groupBy: {
            args: Prisma.OrganizationRoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrganizationRoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrganizationRoleCountArgs<ExtArgs>
            result: $Utils.Optional<OrganizationRoleCountAggregateOutputType> | number
          }
        }
      }
      Permission: {
        payload: Prisma.$PermissionPayload<ExtArgs>
        fields: Prisma.PermissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PermissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PermissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          findFirst: {
            args: Prisma.PermissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PermissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          findMany: {
            args: Prisma.PermissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>[]
          }
          create: {
            args: Prisma.PermissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          createMany: {
            args: Prisma.PermissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PermissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>[]
          }
          delete: {
            args: Prisma.PermissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          update: {
            args: Prisma.PermissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          deleteMany: {
            args: Prisma.PermissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PermissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PermissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>[]
          }
          upsert: {
            args: Prisma.PermissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          aggregate: {
            args: Prisma.PermissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePermission>
          }
          groupBy: {
            args: Prisma.PermissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PermissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PermissionCountArgs<ExtArgs>
            result: $Utils.Optional<PermissionCountAggregateOutputType> | number
          }
        }
      }
      RolePermission: {
        payload: Prisma.$RolePermissionPayload<ExtArgs>
        fields: Prisma.RolePermissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RolePermissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RolePermissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          findFirst: {
            args: Prisma.RolePermissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RolePermissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          findMany: {
            args: Prisma.RolePermissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>[]
          }
          create: {
            args: Prisma.RolePermissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          createMany: {
            args: Prisma.RolePermissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RolePermissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>[]
          }
          delete: {
            args: Prisma.RolePermissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          update: {
            args: Prisma.RolePermissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          deleteMany: {
            args: Prisma.RolePermissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RolePermissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RolePermissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>[]
          }
          upsert: {
            args: Prisma.RolePermissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          aggregate: {
            args: Prisma.RolePermissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRolePermission>
          }
          groupBy: {
            args: Prisma.RolePermissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<RolePermissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.RolePermissionCountArgs<ExtArgs>
            result: $Utils.Optional<RolePermissionCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      Integration: {
        payload: Prisma.$IntegrationPayload<ExtArgs>
        fields: Prisma.IntegrationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IntegrationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IntegrationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationPayload>
          }
          findFirst: {
            args: Prisma.IntegrationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IntegrationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationPayload>
          }
          findMany: {
            args: Prisma.IntegrationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationPayload>[]
          }
          create: {
            args: Prisma.IntegrationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationPayload>
          }
          createMany: {
            args: Prisma.IntegrationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IntegrationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationPayload>[]
          }
          delete: {
            args: Prisma.IntegrationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationPayload>
          }
          update: {
            args: Prisma.IntegrationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationPayload>
          }
          deleteMany: {
            args: Prisma.IntegrationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IntegrationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.IntegrationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationPayload>[]
          }
          upsert: {
            args: Prisma.IntegrationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationPayload>
          }
          aggregate: {
            args: Prisma.IntegrationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIntegration>
          }
          groupBy: {
            args: Prisma.IntegrationGroupByArgs<ExtArgs>
            result: $Utils.Optional<IntegrationGroupByOutputType>[]
          }
          count: {
            args: Prisma.IntegrationCountArgs<ExtArgs>
            result: $Utils.Optional<IntegrationCountAggregateOutputType> | number
          }
        }
      }
      DatabaseIntegration: {
        payload: Prisma.$DatabaseIntegrationPayload<ExtArgs>
        fields: Prisma.DatabaseIntegrationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DatabaseIntegrationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DatabaseIntegrationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DatabaseIntegrationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DatabaseIntegrationPayload>
          }
          findFirst: {
            args: Prisma.DatabaseIntegrationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DatabaseIntegrationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DatabaseIntegrationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DatabaseIntegrationPayload>
          }
          findMany: {
            args: Prisma.DatabaseIntegrationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DatabaseIntegrationPayload>[]
          }
          create: {
            args: Prisma.DatabaseIntegrationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DatabaseIntegrationPayload>
          }
          createMany: {
            args: Prisma.DatabaseIntegrationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DatabaseIntegrationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DatabaseIntegrationPayload>[]
          }
          delete: {
            args: Prisma.DatabaseIntegrationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DatabaseIntegrationPayload>
          }
          update: {
            args: Prisma.DatabaseIntegrationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DatabaseIntegrationPayload>
          }
          deleteMany: {
            args: Prisma.DatabaseIntegrationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DatabaseIntegrationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DatabaseIntegrationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DatabaseIntegrationPayload>[]
          }
          upsert: {
            args: Prisma.DatabaseIntegrationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DatabaseIntegrationPayload>
          }
          aggregate: {
            args: Prisma.DatabaseIntegrationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDatabaseIntegration>
          }
          groupBy: {
            args: Prisma.DatabaseIntegrationGroupByArgs<ExtArgs>
            result: $Utils.Optional<DatabaseIntegrationGroupByOutputType>[]
          }
          count: {
            args: Prisma.DatabaseIntegrationCountArgs<ExtArgs>
            result: $Utils.Optional<DatabaseIntegrationCountAggregateOutputType> | number
          }
        }
      }
      OpenApiIntegration: {
        payload: Prisma.$OpenApiIntegrationPayload<ExtArgs>
        fields: Prisma.OpenApiIntegrationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OpenApiIntegrationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenApiIntegrationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OpenApiIntegrationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenApiIntegrationPayload>
          }
          findFirst: {
            args: Prisma.OpenApiIntegrationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenApiIntegrationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OpenApiIntegrationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenApiIntegrationPayload>
          }
          findMany: {
            args: Prisma.OpenApiIntegrationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenApiIntegrationPayload>[]
          }
          create: {
            args: Prisma.OpenApiIntegrationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenApiIntegrationPayload>
          }
          createMany: {
            args: Prisma.OpenApiIntegrationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OpenApiIntegrationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenApiIntegrationPayload>[]
          }
          delete: {
            args: Prisma.OpenApiIntegrationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenApiIntegrationPayload>
          }
          update: {
            args: Prisma.OpenApiIntegrationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenApiIntegrationPayload>
          }
          deleteMany: {
            args: Prisma.OpenApiIntegrationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OpenApiIntegrationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OpenApiIntegrationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenApiIntegrationPayload>[]
          }
          upsert: {
            args: Prisma.OpenApiIntegrationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenApiIntegrationPayload>
          }
          aggregate: {
            args: Prisma.OpenApiIntegrationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOpenApiIntegration>
          }
          groupBy: {
            args: Prisma.OpenApiIntegrationGroupByArgs<ExtArgs>
            result: $Utils.Optional<OpenApiIntegrationGroupByOutputType>[]
          }
          count: {
            args: Prisma.OpenApiIntegrationCountArgs<ExtArgs>
            result: $Utils.Optional<OpenApiIntegrationCountAggregateOutputType> | number
          }
        }
      }
      McpIntegration: {
        payload: Prisma.$McpIntegrationPayload<ExtArgs>
        fields: Prisma.McpIntegrationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.McpIntegrationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpIntegrationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.McpIntegrationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpIntegrationPayload>
          }
          findFirst: {
            args: Prisma.McpIntegrationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpIntegrationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.McpIntegrationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpIntegrationPayload>
          }
          findMany: {
            args: Prisma.McpIntegrationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpIntegrationPayload>[]
          }
          create: {
            args: Prisma.McpIntegrationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpIntegrationPayload>
          }
          createMany: {
            args: Prisma.McpIntegrationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.McpIntegrationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpIntegrationPayload>[]
          }
          delete: {
            args: Prisma.McpIntegrationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpIntegrationPayload>
          }
          update: {
            args: Prisma.McpIntegrationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpIntegrationPayload>
          }
          deleteMany: {
            args: Prisma.McpIntegrationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.McpIntegrationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.McpIntegrationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpIntegrationPayload>[]
          }
          upsert: {
            args: Prisma.McpIntegrationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpIntegrationPayload>
          }
          aggregate: {
            args: Prisma.McpIntegrationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMcpIntegration>
          }
          groupBy: {
            args: Prisma.McpIntegrationGroupByArgs<ExtArgs>
            result: $Utils.Optional<McpIntegrationGroupByOutputType>[]
          }
          count: {
            args: Prisma.McpIntegrationCountArgs<ExtArgs>
            result: $Utils.Optional<McpIntegrationCountAggregateOutputType> | number
          }
        }
      }
      IntegrationAction: {
        payload: Prisma.$IntegrationActionPayload<ExtArgs>
        fields: Prisma.IntegrationActionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IntegrationActionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationActionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IntegrationActionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationActionPayload>
          }
          findFirst: {
            args: Prisma.IntegrationActionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationActionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IntegrationActionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationActionPayload>
          }
          findMany: {
            args: Prisma.IntegrationActionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationActionPayload>[]
          }
          create: {
            args: Prisma.IntegrationActionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationActionPayload>
          }
          createMany: {
            args: Prisma.IntegrationActionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IntegrationActionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationActionPayload>[]
          }
          delete: {
            args: Prisma.IntegrationActionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationActionPayload>
          }
          update: {
            args: Prisma.IntegrationActionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationActionPayload>
          }
          deleteMany: {
            args: Prisma.IntegrationActionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IntegrationActionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.IntegrationActionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationActionPayload>[]
          }
          upsert: {
            args: Prisma.IntegrationActionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationActionPayload>
          }
          aggregate: {
            args: Prisma.IntegrationActionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIntegrationAction>
          }
          groupBy: {
            args: Prisma.IntegrationActionGroupByArgs<ExtArgs>
            result: $Utils.Optional<IntegrationActionGroupByOutputType>[]
          }
          count: {
            args: Prisma.IntegrationActionCountArgs<ExtArgs>
            result: $Utils.Optional<IntegrationActionCountAggregateOutputType> | number
          }
        }
      }
      Document: {
        payload: Prisma.$DocumentPayload<ExtArgs>
        fields: Prisma.DocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findFirst: {
            args: Prisma.DocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findMany: {
            args: Prisma.DocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          create: {
            args: Prisma.DocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          createMany: {
            args: Prisma.DocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          delete: {
            args: Prisma.DocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          update: {
            args: Prisma.DocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          deleteMany: {
            args: Prisma.DocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DocumentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          upsert: {
            args: Prisma.DocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          aggregate: {
            args: Prisma.DocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDocument>
          }
          groupBy: {
            args: Prisma.DocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DocumentCountArgs<ExtArgs>
            result: $Utils.Optional<DocumentCountAggregateOutputType> | number
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
     * Read more in our [docs](https://pris.ly/d/logging).
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
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
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
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    organization?: OrganizationOmit
    organizationMember?: OrganizationMemberOmit
    organizationRole?: OrganizationRoleOmit
    permission?: PermissionOmit
    rolePermission?: RolePermissionOmit
    auditLog?: AuditLogOmit
    integration?: IntegrationOmit
    databaseIntegration?: DatabaseIntegrationOmit
    openApiIntegration?: OpenApiIntegrationOmit
    mcpIntegration?: McpIntegrationOmit
    integrationAction?: IntegrationActionOmit
    document?: DocumentOmit
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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    organization_members: number
    audit_logs: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization_members?: boolean | UserCountOutputTypeCountOrganization_membersArgs
    audit_logs?: boolean | UserCountOutputTypeCountAudit_logsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOrganization_membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrganizationMemberWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAudit_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }


  /**
   * Count Type OrganizationCountOutputType
   */

  export type OrganizationCountOutputType = {
    members: number
    roles: number
    audit_logs: number
    integrations: number
  }

  export type OrganizationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | OrganizationCountOutputTypeCountMembersArgs
    roles?: boolean | OrganizationCountOutputTypeCountRolesArgs
    audit_logs?: boolean | OrganizationCountOutputTypeCountAudit_logsArgs
    integrations?: boolean | OrganizationCountOutputTypeCountIntegrationsArgs
  }

  // Custom InputTypes
  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationCountOutputType
     */
    select?: OrganizationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrganizationMemberWhereInput
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrganizationRoleWhereInput
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountAudit_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountIntegrationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IntegrationWhereInput
  }


  /**
   * Count Type OrganizationRoleCountOutputType
   */

  export type OrganizationRoleCountOutputType = {
    members: number
    permissions: number
  }

  export type OrganizationRoleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | OrganizationRoleCountOutputTypeCountMembersArgs
    permissions?: boolean | OrganizationRoleCountOutputTypeCountPermissionsArgs
  }

  // Custom InputTypes
  /**
   * OrganizationRoleCountOutputType without action
   */
  export type OrganizationRoleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationRoleCountOutputType
     */
    select?: OrganizationRoleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrganizationRoleCountOutputType without action
   */
  export type OrganizationRoleCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrganizationMemberWhereInput
  }

  /**
   * OrganizationRoleCountOutputType without action
   */
  export type OrganizationRoleCountOutputTypeCountPermissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RolePermissionWhereInput
  }


  /**
   * Count Type PermissionCountOutputType
   */

  export type PermissionCountOutputType = {
    roles: number
  }

  export type PermissionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roles?: boolean | PermissionCountOutputTypeCountRolesArgs
  }

  // Custom InputTypes
  /**
   * PermissionCountOutputType without action
   */
  export type PermissionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PermissionCountOutputType
     */
    select?: PermissionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PermissionCountOutputType without action
   */
  export type PermissionCountOutputTypeCountRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RolePermissionWhereInput
  }


  /**
   * Count Type IntegrationCountOutputType
   */

  export type IntegrationCountOutputType = {
    actions: number
  }

  export type IntegrationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    actions?: boolean | IntegrationCountOutputTypeCountActionsArgs
  }

  // Custom InputTypes
  /**
   * IntegrationCountOutputType without action
   */
  export type IntegrationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationCountOutputType
     */
    select?: IntegrationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * IntegrationCountOutputType without action
   */
  export type IntegrationCountOutputTypeCountActionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IntegrationActionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    email: string | null
    phone: string | null
    password: string | null
    role: $Enums.AuthRole | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    email: string | null
    phone: string | null
    password: string | null
    role: $Enums.AuthRole | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    uuid: number
    email: number
    phone: number
    password: number
    role: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    uuid?: true
    email?: true
    phone?: true
    password?: true
    role?: true
    created_at?: true
    updated_at?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    uuid?: true
    email?: true
    phone?: true
    password?: true
    role?: true
    created_at?: true
    updated_at?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    uuid?: true
    email?: true
    phone?: true
    password?: true
    role?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    uuid: string
    email: string
    phone: string | null
    password: string
    role: $Enums.AuthRole
    created_at: Date
    updated_at: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    email?: boolean
    phone?: boolean
    password?: boolean
    role?: boolean
    created_at?: boolean
    updated_at?: boolean
    organization_members?: boolean | User$organization_membersArgs<ExtArgs>
    audit_logs?: boolean | User$audit_logsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    email?: boolean
    phone?: boolean
    password?: boolean
    role?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    email?: boolean
    phone?: boolean
    password?: boolean
    role?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    uuid?: boolean
    email?: boolean
    phone?: boolean
    password?: boolean
    role?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "email" | "phone" | "password" | "role" | "created_at" | "updated_at", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization_members?: boolean | User$organization_membersArgs<ExtArgs>
    audit_logs?: boolean | User$audit_logsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      organization_members: Prisma.$OrganizationMemberPayload<ExtArgs>[]
      audit_logs: Prisma.$AuditLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      email: string
      phone: string | null
      password: string
      role: $Enums.AuthRole
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organization_members<T extends User$organization_membersArgs<ExtArgs> = {}>(args?: Subset<T, User$organization_membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    audit_logs<T extends User$audit_logsArgs<ExtArgs> = {}>(args?: Subset<T, User$audit_logsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly uuid: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'AuthRole'>
    readonly created_at: FieldRef<"User", 'DateTime'>
    readonly updated_at: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.organization_members
   */
  export type User$organization_membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationMember
     */
    select?: OrganizationMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationMember
     */
    omit?: OrganizationMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationMemberInclude<ExtArgs> | null
    where?: OrganizationMemberWhereInput
    orderBy?: OrganizationMemberOrderByWithRelationInput | OrganizationMemberOrderByWithRelationInput[]
    cursor?: OrganizationMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrganizationMemberScalarFieldEnum | OrganizationMemberScalarFieldEnum[]
  }

  /**
   * User.audit_logs
   */
  export type User$audit_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Organization
   */

  export type AggregateOrganization = {
    _count: OrganizationCountAggregateOutputType | null
    _avg: OrganizationAvgAggregateOutputType | null
    _sum: OrganizationSumAggregateOutputType | null
    _min: OrganizationMinAggregateOutputType | null
    _max: OrganizationMaxAggregateOutputType | null
  }

  export type OrganizationAvgAggregateOutputType = {
    id: number | null
  }

  export type OrganizationSumAggregateOutputType = {
    id: number | null
  }

  export type OrganizationMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    name: string | null
    slug: string | null
    logo_url: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type OrganizationMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    name: string | null
    slug: string | null
    logo_url: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type OrganizationCountAggregateOutputType = {
    id: number
    uuid: number
    name: number
    slug: number
    logo_url: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type OrganizationAvgAggregateInputType = {
    id?: true
  }

  export type OrganizationSumAggregateInputType = {
    id?: true
  }

  export type OrganizationMinAggregateInputType = {
    id?: true
    uuid?: true
    name?: true
    slug?: true
    logo_url?: true
    created_at?: true
    updated_at?: true
  }

  export type OrganizationMaxAggregateInputType = {
    id?: true
    uuid?: true
    name?: true
    slug?: true
    logo_url?: true
    created_at?: true
    updated_at?: true
  }

  export type OrganizationCountAggregateInputType = {
    id?: true
    uuid?: true
    name?: true
    slug?: true
    logo_url?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type OrganizationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organization to aggregate.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Organizations
    **/
    _count?: true | OrganizationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrganizationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrganizationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrganizationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrganizationMaxAggregateInputType
  }

  export type GetOrganizationAggregateType<T extends OrganizationAggregateArgs> = {
        [P in keyof T & keyof AggregateOrganization]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrganization[P]>
      : GetScalarType<T[P], AggregateOrganization[P]>
  }




  export type OrganizationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrganizationWhereInput
    orderBy?: OrganizationOrderByWithAggregationInput | OrganizationOrderByWithAggregationInput[]
    by: OrganizationScalarFieldEnum[] | OrganizationScalarFieldEnum
    having?: OrganizationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrganizationCountAggregateInputType | true
    _avg?: OrganizationAvgAggregateInputType
    _sum?: OrganizationSumAggregateInputType
    _min?: OrganizationMinAggregateInputType
    _max?: OrganizationMaxAggregateInputType
  }

  export type OrganizationGroupByOutputType = {
    id: number
    uuid: string
    name: string
    slug: string
    logo_url: string | null
    created_at: Date
    updated_at: Date
    _count: OrganizationCountAggregateOutputType | null
    _avg: OrganizationAvgAggregateOutputType | null
    _sum: OrganizationSumAggregateOutputType | null
    _min: OrganizationMinAggregateOutputType | null
    _max: OrganizationMaxAggregateOutputType | null
  }

  type GetOrganizationGroupByPayload<T extends OrganizationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrganizationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrganizationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrganizationGroupByOutputType[P]>
            : GetScalarType<T[P], OrganizationGroupByOutputType[P]>
        }
      >
    >


  export type OrganizationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    name?: boolean
    slug?: boolean
    logo_url?: boolean
    created_at?: boolean
    updated_at?: boolean
    members?: boolean | Organization$membersArgs<ExtArgs>
    roles?: boolean | Organization$rolesArgs<ExtArgs>
    audit_logs?: boolean | Organization$audit_logsArgs<ExtArgs>
    integrations?: boolean | Organization$integrationsArgs<ExtArgs>
    _count?: boolean | OrganizationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    name?: boolean
    slug?: boolean
    logo_url?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    name?: boolean
    slug?: boolean
    logo_url?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectScalar = {
    id?: boolean
    uuid?: boolean
    name?: boolean
    slug?: boolean
    logo_url?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type OrganizationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "name" | "slug" | "logo_url" | "created_at" | "updated_at", ExtArgs["result"]["organization"]>
  export type OrganizationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | Organization$membersArgs<ExtArgs>
    roles?: boolean | Organization$rolesArgs<ExtArgs>
    audit_logs?: boolean | Organization$audit_logsArgs<ExtArgs>
    integrations?: boolean | Organization$integrationsArgs<ExtArgs>
    _count?: boolean | OrganizationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OrganizationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type OrganizationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $OrganizationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Organization"
    objects: {
      members: Prisma.$OrganizationMemberPayload<ExtArgs>[]
      roles: Prisma.$OrganizationRolePayload<ExtArgs>[]
      audit_logs: Prisma.$AuditLogPayload<ExtArgs>[]
      integrations: Prisma.$IntegrationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      name: string
      slug: string
      logo_url: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["organization"]>
    composites: {}
  }

  type OrganizationGetPayload<S extends boolean | null | undefined | OrganizationDefaultArgs> = $Result.GetResult<Prisma.$OrganizationPayload, S>

  type OrganizationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrganizationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrganizationCountAggregateInputType | true
    }

  export interface OrganizationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Organization'], meta: { name: 'Organization' } }
    /**
     * Find zero or one Organization that matches the filter.
     * @param {OrganizationFindUniqueArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrganizationFindUniqueArgs>(args: SelectSubset<T, OrganizationFindUniqueArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Organization that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrganizationFindUniqueOrThrowArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrganizationFindUniqueOrThrowArgs>(args: SelectSubset<T, OrganizationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organization that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindFirstArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrganizationFindFirstArgs>(args?: SelectSubset<T, OrganizationFindFirstArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organization that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindFirstOrThrowArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrganizationFindFirstOrThrowArgs>(args?: SelectSubset<T, OrganizationFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Organizations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Organizations
     * const organizations = await prisma.organization.findMany()
     * 
     * // Get first 10 Organizations
     * const organizations = await prisma.organization.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const organizationWithIdOnly = await prisma.organization.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrganizationFindManyArgs>(args?: SelectSubset<T, OrganizationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Organization.
     * @param {OrganizationCreateArgs} args - Arguments to create a Organization.
     * @example
     * // Create one Organization
     * const Organization = await prisma.organization.create({
     *   data: {
     *     // ... data to create a Organization
     *   }
     * })
     * 
     */
    create<T extends OrganizationCreateArgs>(args: SelectSubset<T, OrganizationCreateArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Organizations.
     * @param {OrganizationCreateManyArgs} args - Arguments to create many Organizations.
     * @example
     * // Create many Organizations
     * const organization = await prisma.organization.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrganizationCreateManyArgs>(args?: SelectSubset<T, OrganizationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Organizations and returns the data saved in the database.
     * @param {OrganizationCreateManyAndReturnArgs} args - Arguments to create many Organizations.
     * @example
     * // Create many Organizations
     * const organization = await prisma.organization.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Organizations and only return the `id`
     * const organizationWithIdOnly = await prisma.organization.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrganizationCreateManyAndReturnArgs>(args?: SelectSubset<T, OrganizationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Organization.
     * @param {OrganizationDeleteArgs} args - Arguments to delete one Organization.
     * @example
     * // Delete one Organization
     * const Organization = await prisma.organization.delete({
     *   where: {
     *     // ... filter to delete one Organization
     *   }
     * })
     * 
     */
    delete<T extends OrganizationDeleteArgs>(args: SelectSubset<T, OrganizationDeleteArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Organization.
     * @param {OrganizationUpdateArgs} args - Arguments to update one Organization.
     * @example
     * // Update one Organization
     * const organization = await prisma.organization.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrganizationUpdateArgs>(args: SelectSubset<T, OrganizationUpdateArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Organizations.
     * @param {OrganizationDeleteManyArgs} args - Arguments to filter Organizations to delete.
     * @example
     * // Delete a few Organizations
     * const { count } = await prisma.organization.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrganizationDeleteManyArgs>(args?: SelectSubset<T, OrganizationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Organizations
     * const organization = await prisma.organization.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrganizationUpdateManyArgs>(args: SelectSubset<T, OrganizationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organizations and returns the data updated in the database.
     * @param {OrganizationUpdateManyAndReturnArgs} args - Arguments to update many Organizations.
     * @example
     * // Update many Organizations
     * const organization = await prisma.organization.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Organizations and only return the `id`
     * const organizationWithIdOnly = await prisma.organization.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrganizationUpdateManyAndReturnArgs>(args: SelectSubset<T, OrganizationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Organization.
     * @param {OrganizationUpsertArgs} args - Arguments to update or create a Organization.
     * @example
     * // Update or create a Organization
     * const organization = await prisma.organization.upsert({
     *   create: {
     *     // ... data to create a Organization
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Organization we want to update
     *   }
     * })
     */
    upsert<T extends OrganizationUpsertArgs>(args: SelectSubset<T, OrganizationUpsertArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationCountArgs} args - Arguments to filter Organizations to count.
     * @example
     * // Count the number of Organizations
     * const count = await prisma.organization.count({
     *   where: {
     *     // ... the filter for the Organizations we want to count
     *   }
     * })
    **/
    count<T extends OrganizationCountArgs>(
      args?: Subset<T, OrganizationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrganizationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Organization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OrganizationAggregateArgs>(args: Subset<T, OrganizationAggregateArgs>): Prisma.PrismaPromise<GetOrganizationAggregateType<T>>

    /**
     * Group by Organization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationGroupByArgs} args - Group by arguments.
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
      T extends OrganizationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrganizationGroupByArgs['orderBy'] }
        : { orderBy?: OrganizationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OrganizationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganizationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Organization model
   */
  readonly fields: OrganizationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Organization.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrganizationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    members<T extends Organization$membersArgs<ExtArgs> = {}>(args?: Subset<T, Organization$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    roles<T extends Organization$rolesArgs<ExtArgs> = {}>(args?: Subset<T, Organization$rolesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationRolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    audit_logs<T extends Organization$audit_logsArgs<ExtArgs> = {}>(args?: Subset<T, Organization$audit_logsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    integrations<T extends Organization$integrationsArgs<ExtArgs> = {}>(args?: Subset<T, Organization$integrationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IntegrationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Organization model
   */
  interface OrganizationFieldRefs {
    readonly id: FieldRef<"Organization", 'Int'>
    readonly uuid: FieldRef<"Organization", 'String'>
    readonly name: FieldRef<"Organization", 'String'>
    readonly slug: FieldRef<"Organization", 'String'>
    readonly logo_url: FieldRef<"Organization", 'String'>
    readonly created_at: FieldRef<"Organization", 'DateTime'>
    readonly updated_at: FieldRef<"Organization", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Organization findUnique
   */
  export type OrganizationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization findUniqueOrThrow
   */
  export type OrganizationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization findFirst
   */
  export type OrganizationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organizations.
     */
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization findFirstOrThrow
   */
  export type OrganizationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organizations.
     */
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization findMany
   */
  export type OrganizationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organizations to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization create
   */
  export type OrganizationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The data needed to create a Organization.
     */
    data: XOR<OrganizationCreateInput, OrganizationUncheckedCreateInput>
  }

  /**
   * Organization createMany
   */
  export type OrganizationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Organizations.
     */
    data: OrganizationCreateManyInput | OrganizationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Organization createManyAndReturn
   */
  export type OrganizationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * The data used to create many Organizations.
     */
    data: OrganizationCreateManyInput | OrganizationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Organization update
   */
  export type OrganizationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The data needed to update a Organization.
     */
    data: XOR<OrganizationUpdateInput, OrganizationUncheckedUpdateInput>
    /**
     * Choose, which Organization to update.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization updateMany
   */
  export type OrganizationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Organizations.
     */
    data: XOR<OrganizationUpdateManyMutationInput, OrganizationUncheckedUpdateManyInput>
    /**
     * Filter which Organizations to update
     */
    where?: OrganizationWhereInput
    /**
     * Limit how many Organizations to update.
     */
    limit?: number
  }

  /**
   * Organization updateManyAndReturn
   */
  export type OrganizationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * The data used to update Organizations.
     */
    data: XOR<OrganizationUpdateManyMutationInput, OrganizationUncheckedUpdateManyInput>
    /**
     * Filter which Organizations to update
     */
    where?: OrganizationWhereInput
    /**
     * Limit how many Organizations to update.
     */
    limit?: number
  }

  /**
   * Organization upsert
   */
  export type OrganizationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The filter to search for the Organization to update in case it exists.
     */
    where: OrganizationWhereUniqueInput
    /**
     * In case the Organization found by the `where` argument doesn't exist, create a new Organization with this data.
     */
    create: XOR<OrganizationCreateInput, OrganizationUncheckedCreateInput>
    /**
     * In case the Organization was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrganizationUpdateInput, OrganizationUncheckedUpdateInput>
  }

  /**
   * Organization delete
   */
  export type OrganizationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter which Organization to delete.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization deleteMany
   */
  export type OrganizationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organizations to delete
     */
    where?: OrganizationWhereInput
    /**
     * Limit how many Organizations to delete.
     */
    limit?: number
  }

  /**
   * Organization.members
   */
  export type Organization$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationMember
     */
    select?: OrganizationMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationMember
     */
    omit?: OrganizationMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationMemberInclude<ExtArgs> | null
    where?: OrganizationMemberWhereInput
    orderBy?: OrganizationMemberOrderByWithRelationInput | OrganizationMemberOrderByWithRelationInput[]
    cursor?: OrganizationMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrganizationMemberScalarFieldEnum | OrganizationMemberScalarFieldEnum[]
  }

  /**
   * Organization.roles
   */
  export type Organization$rolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationRole
     */
    select?: OrganizationRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationRole
     */
    omit?: OrganizationRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationRoleInclude<ExtArgs> | null
    where?: OrganizationRoleWhereInput
    orderBy?: OrganizationRoleOrderByWithRelationInput | OrganizationRoleOrderByWithRelationInput[]
    cursor?: OrganizationRoleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrganizationRoleScalarFieldEnum | OrganizationRoleScalarFieldEnum[]
  }

  /**
   * Organization.audit_logs
   */
  export type Organization$audit_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * Organization.integrations
   */
  export type Organization$integrationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Integration
     */
    select?: IntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Integration
     */
    omit?: IntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationInclude<ExtArgs> | null
    where?: IntegrationWhereInput
    orderBy?: IntegrationOrderByWithRelationInput | IntegrationOrderByWithRelationInput[]
    cursor?: IntegrationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: IntegrationScalarFieldEnum | IntegrationScalarFieldEnum[]
  }

  /**
   * Organization without action
   */
  export type OrganizationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
  }


  /**
   * Model OrganizationMember
   */

  export type AggregateOrganizationMember = {
    _count: OrganizationMemberCountAggregateOutputType | null
    _avg: OrganizationMemberAvgAggregateOutputType | null
    _sum: OrganizationMemberSumAggregateOutputType | null
    _min: OrganizationMemberMinAggregateOutputType | null
    _max: OrganizationMemberMaxAggregateOutputType | null
  }

  export type OrganizationMemberAvgAggregateOutputType = {
    id: number | null
  }

  export type OrganizationMemberSumAggregateOutputType = {
    id: number | null
  }

  export type OrganizationMemberMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    org_uuid: string | null
    user_uuid: string | null
    role_uuid: string | null
    status: $Enums.OrganizationMemberStatus | null
    invited_at: Date | null
    joined_at: Date | null
  }

  export type OrganizationMemberMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    org_uuid: string | null
    user_uuid: string | null
    role_uuid: string | null
    status: $Enums.OrganizationMemberStatus | null
    invited_at: Date | null
    joined_at: Date | null
  }

  export type OrganizationMemberCountAggregateOutputType = {
    id: number
    uuid: number
    org_uuid: number
    user_uuid: number
    role_uuid: number
    status: number
    invited_at: number
    joined_at: number
    _all: number
  }


  export type OrganizationMemberAvgAggregateInputType = {
    id?: true
  }

  export type OrganizationMemberSumAggregateInputType = {
    id?: true
  }

  export type OrganizationMemberMinAggregateInputType = {
    id?: true
    uuid?: true
    org_uuid?: true
    user_uuid?: true
    role_uuid?: true
    status?: true
    invited_at?: true
    joined_at?: true
  }

  export type OrganizationMemberMaxAggregateInputType = {
    id?: true
    uuid?: true
    org_uuid?: true
    user_uuid?: true
    role_uuid?: true
    status?: true
    invited_at?: true
    joined_at?: true
  }

  export type OrganizationMemberCountAggregateInputType = {
    id?: true
    uuid?: true
    org_uuid?: true
    user_uuid?: true
    role_uuid?: true
    status?: true
    invited_at?: true
    joined_at?: true
    _all?: true
  }

  export type OrganizationMemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrganizationMember to aggregate.
     */
    where?: OrganizationMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrganizationMembers to fetch.
     */
    orderBy?: OrganizationMemberOrderByWithRelationInput | OrganizationMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrganizationMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrganizationMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrganizationMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OrganizationMembers
    **/
    _count?: true | OrganizationMemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrganizationMemberAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrganizationMemberSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrganizationMemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrganizationMemberMaxAggregateInputType
  }

  export type GetOrganizationMemberAggregateType<T extends OrganizationMemberAggregateArgs> = {
        [P in keyof T & keyof AggregateOrganizationMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrganizationMember[P]>
      : GetScalarType<T[P], AggregateOrganizationMember[P]>
  }




  export type OrganizationMemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrganizationMemberWhereInput
    orderBy?: OrganizationMemberOrderByWithAggregationInput | OrganizationMemberOrderByWithAggregationInput[]
    by: OrganizationMemberScalarFieldEnum[] | OrganizationMemberScalarFieldEnum
    having?: OrganizationMemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrganizationMemberCountAggregateInputType | true
    _avg?: OrganizationMemberAvgAggregateInputType
    _sum?: OrganizationMemberSumAggregateInputType
    _min?: OrganizationMemberMinAggregateInputType
    _max?: OrganizationMemberMaxAggregateInputType
  }

  export type OrganizationMemberGroupByOutputType = {
    id: number
    uuid: string
    org_uuid: string
    user_uuid: string
    role_uuid: string
    status: $Enums.OrganizationMemberStatus
    invited_at: Date
    joined_at: Date | null
    _count: OrganizationMemberCountAggregateOutputType | null
    _avg: OrganizationMemberAvgAggregateOutputType | null
    _sum: OrganizationMemberSumAggregateOutputType | null
    _min: OrganizationMemberMinAggregateOutputType | null
    _max: OrganizationMemberMaxAggregateOutputType | null
  }

  type GetOrganizationMemberGroupByPayload<T extends OrganizationMemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrganizationMemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrganizationMemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrganizationMemberGroupByOutputType[P]>
            : GetScalarType<T[P], OrganizationMemberGroupByOutputType[P]>
        }
      >
    >


  export type OrganizationMemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    org_uuid?: boolean
    user_uuid?: boolean
    role_uuid?: boolean
    status?: boolean
    invited_at?: boolean
    joined_at?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    role?: boolean | OrganizationRoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organizationMember"]>

  export type OrganizationMemberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    org_uuid?: boolean
    user_uuid?: boolean
    role_uuid?: boolean
    status?: boolean
    invited_at?: boolean
    joined_at?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    role?: boolean | OrganizationRoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organizationMember"]>

  export type OrganizationMemberSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    org_uuid?: boolean
    user_uuid?: boolean
    role_uuid?: boolean
    status?: boolean
    invited_at?: boolean
    joined_at?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    role?: boolean | OrganizationRoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organizationMember"]>

  export type OrganizationMemberSelectScalar = {
    id?: boolean
    uuid?: boolean
    org_uuid?: boolean
    user_uuid?: boolean
    role_uuid?: boolean
    status?: boolean
    invited_at?: boolean
    joined_at?: boolean
  }

  export type OrganizationMemberOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "org_uuid" | "user_uuid" | "role_uuid" | "status" | "invited_at" | "joined_at", ExtArgs["result"]["organizationMember"]>
  export type OrganizationMemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    role?: boolean | OrganizationRoleDefaultArgs<ExtArgs>
  }
  export type OrganizationMemberIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    role?: boolean | OrganizationRoleDefaultArgs<ExtArgs>
  }
  export type OrganizationMemberIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    role?: boolean | OrganizationRoleDefaultArgs<ExtArgs>
  }

  export type $OrganizationMemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OrganizationMember"
    objects: {
      organization: Prisma.$OrganizationPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
      role: Prisma.$OrganizationRolePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      org_uuid: string
      user_uuid: string
      role_uuid: string
      status: $Enums.OrganizationMemberStatus
      invited_at: Date
      joined_at: Date | null
    }, ExtArgs["result"]["organizationMember"]>
    composites: {}
  }

  type OrganizationMemberGetPayload<S extends boolean | null | undefined | OrganizationMemberDefaultArgs> = $Result.GetResult<Prisma.$OrganizationMemberPayload, S>

  type OrganizationMemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrganizationMemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrganizationMemberCountAggregateInputType | true
    }

  export interface OrganizationMemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OrganizationMember'], meta: { name: 'OrganizationMember' } }
    /**
     * Find zero or one OrganizationMember that matches the filter.
     * @param {OrganizationMemberFindUniqueArgs} args - Arguments to find a OrganizationMember
     * @example
     * // Get one OrganizationMember
     * const organizationMember = await prisma.organizationMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrganizationMemberFindUniqueArgs>(args: SelectSubset<T, OrganizationMemberFindUniqueArgs<ExtArgs>>): Prisma__OrganizationMemberClient<$Result.GetResult<Prisma.$OrganizationMemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OrganizationMember that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrganizationMemberFindUniqueOrThrowArgs} args - Arguments to find a OrganizationMember
     * @example
     * // Get one OrganizationMember
     * const organizationMember = await prisma.organizationMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrganizationMemberFindUniqueOrThrowArgs>(args: SelectSubset<T, OrganizationMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrganizationMemberClient<$Result.GetResult<Prisma.$OrganizationMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrganizationMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationMemberFindFirstArgs} args - Arguments to find a OrganizationMember
     * @example
     * // Get one OrganizationMember
     * const organizationMember = await prisma.organizationMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrganizationMemberFindFirstArgs>(args?: SelectSubset<T, OrganizationMemberFindFirstArgs<ExtArgs>>): Prisma__OrganizationMemberClient<$Result.GetResult<Prisma.$OrganizationMemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrganizationMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationMemberFindFirstOrThrowArgs} args - Arguments to find a OrganizationMember
     * @example
     * // Get one OrganizationMember
     * const organizationMember = await prisma.organizationMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrganizationMemberFindFirstOrThrowArgs>(args?: SelectSubset<T, OrganizationMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrganizationMemberClient<$Result.GetResult<Prisma.$OrganizationMemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OrganizationMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OrganizationMembers
     * const organizationMembers = await prisma.organizationMember.findMany()
     * 
     * // Get first 10 OrganizationMembers
     * const organizationMembers = await prisma.organizationMember.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const organizationMemberWithIdOnly = await prisma.organizationMember.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrganizationMemberFindManyArgs>(args?: SelectSubset<T, OrganizationMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OrganizationMember.
     * @param {OrganizationMemberCreateArgs} args - Arguments to create a OrganizationMember.
     * @example
     * // Create one OrganizationMember
     * const OrganizationMember = await prisma.organizationMember.create({
     *   data: {
     *     // ... data to create a OrganizationMember
     *   }
     * })
     * 
     */
    create<T extends OrganizationMemberCreateArgs>(args: SelectSubset<T, OrganizationMemberCreateArgs<ExtArgs>>): Prisma__OrganizationMemberClient<$Result.GetResult<Prisma.$OrganizationMemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OrganizationMembers.
     * @param {OrganizationMemberCreateManyArgs} args - Arguments to create many OrganizationMembers.
     * @example
     * // Create many OrganizationMembers
     * const organizationMember = await prisma.organizationMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrganizationMemberCreateManyArgs>(args?: SelectSubset<T, OrganizationMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OrganizationMembers and returns the data saved in the database.
     * @param {OrganizationMemberCreateManyAndReturnArgs} args - Arguments to create many OrganizationMembers.
     * @example
     * // Create many OrganizationMembers
     * const organizationMember = await prisma.organizationMember.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OrganizationMembers and only return the `id`
     * const organizationMemberWithIdOnly = await prisma.organizationMember.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrganizationMemberCreateManyAndReturnArgs>(args?: SelectSubset<T, OrganizationMemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationMemberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OrganizationMember.
     * @param {OrganizationMemberDeleteArgs} args - Arguments to delete one OrganizationMember.
     * @example
     * // Delete one OrganizationMember
     * const OrganizationMember = await prisma.organizationMember.delete({
     *   where: {
     *     // ... filter to delete one OrganizationMember
     *   }
     * })
     * 
     */
    delete<T extends OrganizationMemberDeleteArgs>(args: SelectSubset<T, OrganizationMemberDeleteArgs<ExtArgs>>): Prisma__OrganizationMemberClient<$Result.GetResult<Prisma.$OrganizationMemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OrganizationMember.
     * @param {OrganizationMemberUpdateArgs} args - Arguments to update one OrganizationMember.
     * @example
     * // Update one OrganizationMember
     * const organizationMember = await prisma.organizationMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrganizationMemberUpdateArgs>(args: SelectSubset<T, OrganizationMemberUpdateArgs<ExtArgs>>): Prisma__OrganizationMemberClient<$Result.GetResult<Prisma.$OrganizationMemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OrganizationMembers.
     * @param {OrganizationMemberDeleteManyArgs} args - Arguments to filter OrganizationMembers to delete.
     * @example
     * // Delete a few OrganizationMembers
     * const { count } = await prisma.organizationMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrganizationMemberDeleteManyArgs>(args?: SelectSubset<T, OrganizationMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrganizationMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OrganizationMembers
     * const organizationMember = await prisma.organizationMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrganizationMemberUpdateManyArgs>(args: SelectSubset<T, OrganizationMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrganizationMembers and returns the data updated in the database.
     * @param {OrganizationMemberUpdateManyAndReturnArgs} args - Arguments to update many OrganizationMembers.
     * @example
     * // Update many OrganizationMembers
     * const organizationMember = await prisma.organizationMember.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OrganizationMembers and only return the `id`
     * const organizationMemberWithIdOnly = await prisma.organizationMember.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrganizationMemberUpdateManyAndReturnArgs>(args: SelectSubset<T, OrganizationMemberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationMemberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OrganizationMember.
     * @param {OrganizationMemberUpsertArgs} args - Arguments to update or create a OrganizationMember.
     * @example
     * // Update or create a OrganizationMember
     * const organizationMember = await prisma.organizationMember.upsert({
     *   create: {
     *     // ... data to create a OrganizationMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OrganizationMember we want to update
     *   }
     * })
     */
    upsert<T extends OrganizationMemberUpsertArgs>(args: SelectSubset<T, OrganizationMemberUpsertArgs<ExtArgs>>): Prisma__OrganizationMemberClient<$Result.GetResult<Prisma.$OrganizationMemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OrganizationMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationMemberCountArgs} args - Arguments to filter OrganizationMembers to count.
     * @example
     * // Count the number of OrganizationMembers
     * const count = await prisma.organizationMember.count({
     *   where: {
     *     // ... the filter for the OrganizationMembers we want to count
     *   }
     * })
    **/
    count<T extends OrganizationMemberCountArgs>(
      args?: Subset<T, OrganizationMemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrganizationMemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OrganizationMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OrganizationMemberAggregateArgs>(args: Subset<T, OrganizationMemberAggregateArgs>): Prisma.PrismaPromise<GetOrganizationMemberAggregateType<T>>

    /**
     * Group by OrganizationMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationMemberGroupByArgs} args - Group by arguments.
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
      T extends OrganizationMemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrganizationMemberGroupByArgs['orderBy'] }
        : { orderBy?: OrganizationMemberGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OrganizationMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganizationMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OrganizationMember model
   */
  readonly fields: OrganizationMemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OrganizationMember.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrganizationMemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organization<T extends OrganizationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationDefaultArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    role<T extends OrganizationRoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationRoleDefaultArgs<ExtArgs>>): Prisma__OrganizationRoleClient<$Result.GetResult<Prisma.$OrganizationRolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the OrganizationMember model
   */
  interface OrganizationMemberFieldRefs {
    readonly id: FieldRef<"OrganizationMember", 'Int'>
    readonly uuid: FieldRef<"OrganizationMember", 'String'>
    readonly org_uuid: FieldRef<"OrganizationMember", 'String'>
    readonly user_uuid: FieldRef<"OrganizationMember", 'String'>
    readonly role_uuid: FieldRef<"OrganizationMember", 'String'>
    readonly status: FieldRef<"OrganizationMember", 'OrganizationMemberStatus'>
    readonly invited_at: FieldRef<"OrganizationMember", 'DateTime'>
    readonly joined_at: FieldRef<"OrganizationMember", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OrganizationMember findUnique
   */
  export type OrganizationMemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationMember
     */
    select?: OrganizationMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationMember
     */
    omit?: OrganizationMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationMemberInclude<ExtArgs> | null
    /**
     * Filter, which OrganizationMember to fetch.
     */
    where: OrganizationMemberWhereUniqueInput
  }

  /**
   * OrganizationMember findUniqueOrThrow
   */
  export type OrganizationMemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationMember
     */
    select?: OrganizationMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationMember
     */
    omit?: OrganizationMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationMemberInclude<ExtArgs> | null
    /**
     * Filter, which OrganizationMember to fetch.
     */
    where: OrganizationMemberWhereUniqueInput
  }

  /**
   * OrganizationMember findFirst
   */
  export type OrganizationMemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationMember
     */
    select?: OrganizationMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationMember
     */
    omit?: OrganizationMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationMemberInclude<ExtArgs> | null
    /**
     * Filter, which OrganizationMember to fetch.
     */
    where?: OrganizationMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrganizationMembers to fetch.
     */
    orderBy?: OrganizationMemberOrderByWithRelationInput | OrganizationMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrganizationMembers.
     */
    cursor?: OrganizationMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrganizationMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrganizationMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrganizationMembers.
     */
    distinct?: OrganizationMemberScalarFieldEnum | OrganizationMemberScalarFieldEnum[]
  }

  /**
   * OrganizationMember findFirstOrThrow
   */
  export type OrganizationMemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationMember
     */
    select?: OrganizationMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationMember
     */
    omit?: OrganizationMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationMemberInclude<ExtArgs> | null
    /**
     * Filter, which OrganizationMember to fetch.
     */
    where?: OrganizationMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrganizationMembers to fetch.
     */
    orderBy?: OrganizationMemberOrderByWithRelationInput | OrganizationMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrganizationMembers.
     */
    cursor?: OrganizationMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrganizationMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrganizationMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrganizationMembers.
     */
    distinct?: OrganizationMemberScalarFieldEnum | OrganizationMemberScalarFieldEnum[]
  }

  /**
   * OrganizationMember findMany
   */
  export type OrganizationMemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationMember
     */
    select?: OrganizationMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationMember
     */
    omit?: OrganizationMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationMemberInclude<ExtArgs> | null
    /**
     * Filter, which OrganizationMembers to fetch.
     */
    where?: OrganizationMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrganizationMembers to fetch.
     */
    orderBy?: OrganizationMemberOrderByWithRelationInput | OrganizationMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OrganizationMembers.
     */
    cursor?: OrganizationMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrganizationMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrganizationMembers.
     */
    skip?: number
    distinct?: OrganizationMemberScalarFieldEnum | OrganizationMemberScalarFieldEnum[]
  }

  /**
   * OrganizationMember create
   */
  export type OrganizationMemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationMember
     */
    select?: OrganizationMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationMember
     */
    omit?: OrganizationMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationMemberInclude<ExtArgs> | null
    /**
     * The data needed to create a OrganizationMember.
     */
    data: XOR<OrganizationMemberCreateInput, OrganizationMemberUncheckedCreateInput>
  }

  /**
   * OrganizationMember createMany
   */
  export type OrganizationMemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OrganizationMembers.
     */
    data: OrganizationMemberCreateManyInput | OrganizationMemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OrganizationMember createManyAndReturn
   */
  export type OrganizationMemberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationMember
     */
    select?: OrganizationMemberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationMember
     */
    omit?: OrganizationMemberOmit<ExtArgs> | null
    /**
     * The data used to create many OrganizationMembers.
     */
    data: OrganizationMemberCreateManyInput | OrganizationMemberCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationMemberIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrganizationMember update
   */
  export type OrganizationMemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationMember
     */
    select?: OrganizationMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationMember
     */
    omit?: OrganizationMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationMemberInclude<ExtArgs> | null
    /**
     * The data needed to update a OrganizationMember.
     */
    data: XOR<OrganizationMemberUpdateInput, OrganizationMemberUncheckedUpdateInput>
    /**
     * Choose, which OrganizationMember to update.
     */
    where: OrganizationMemberWhereUniqueInput
  }

  /**
   * OrganizationMember updateMany
   */
  export type OrganizationMemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OrganizationMembers.
     */
    data: XOR<OrganizationMemberUpdateManyMutationInput, OrganizationMemberUncheckedUpdateManyInput>
    /**
     * Filter which OrganizationMembers to update
     */
    where?: OrganizationMemberWhereInput
    /**
     * Limit how many OrganizationMembers to update.
     */
    limit?: number
  }

  /**
   * OrganizationMember updateManyAndReturn
   */
  export type OrganizationMemberUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationMember
     */
    select?: OrganizationMemberSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationMember
     */
    omit?: OrganizationMemberOmit<ExtArgs> | null
    /**
     * The data used to update OrganizationMembers.
     */
    data: XOR<OrganizationMemberUpdateManyMutationInput, OrganizationMemberUncheckedUpdateManyInput>
    /**
     * Filter which OrganizationMembers to update
     */
    where?: OrganizationMemberWhereInput
    /**
     * Limit how many OrganizationMembers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationMemberIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrganizationMember upsert
   */
  export type OrganizationMemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationMember
     */
    select?: OrganizationMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationMember
     */
    omit?: OrganizationMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationMemberInclude<ExtArgs> | null
    /**
     * The filter to search for the OrganizationMember to update in case it exists.
     */
    where: OrganizationMemberWhereUniqueInput
    /**
     * In case the OrganizationMember found by the `where` argument doesn't exist, create a new OrganizationMember with this data.
     */
    create: XOR<OrganizationMemberCreateInput, OrganizationMemberUncheckedCreateInput>
    /**
     * In case the OrganizationMember was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrganizationMemberUpdateInput, OrganizationMemberUncheckedUpdateInput>
  }

  /**
   * OrganizationMember delete
   */
  export type OrganizationMemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationMember
     */
    select?: OrganizationMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationMember
     */
    omit?: OrganizationMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationMemberInclude<ExtArgs> | null
    /**
     * Filter which OrganizationMember to delete.
     */
    where: OrganizationMemberWhereUniqueInput
  }

  /**
   * OrganizationMember deleteMany
   */
  export type OrganizationMemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrganizationMembers to delete
     */
    where?: OrganizationMemberWhereInput
    /**
     * Limit how many OrganizationMembers to delete.
     */
    limit?: number
  }

  /**
   * OrganizationMember without action
   */
  export type OrganizationMemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationMember
     */
    select?: OrganizationMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationMember
     */
    omit?: OrganizationMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationMemberInclude<ExtArgs> | null
  }


  /**
   * Model OrganizationRole
   */

  export type AggregateOrganizationRole = {
    _count: OrganizationRoleCountAggregateOutputType | null
    _avg: OrganizationRoleAvgAggregateOutputType | null
    _sum: OrganizationRoleSumAggregateOutputType | null
    _min: OrganizationRoleMinAggregateOutputType | null
    _max: OrganizationRoleMaxAggregateOutputType | null
  }

  export type OrganizationRoleAvgAggregateOutputType = {
    id: number | null
  }

  export type OrganizationRoleSumAggregateOutputType = {
    id: number | null
  }

  export type OrganizationRoleMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    org_uuid: string | null
    name: string | null
    is_system: boolean | null
  }

  export type OrganizationRoleMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    org_uuid: string | null
    name: string | null
    is_system: boolean | null
  }

  export type OrganizationRoleCountAggregateOutputType = {
    id: number
    uuid: number
    org_uuid: number
    name: number
    is_system: number
    _all: number
  }


  export type OrganizationRoleAvgAggregateInputType = {
    id?: true
  }

  export type OrganizationRoleSumAggregateInputType = {
    id?: true
  }

  export type OrganizationRoleMinAggregateInputType = {
    id?: true
    uuid?: true
    org_uuid?: true
    name?: true
    is_system?: true
  }

  export type OrganizationRoleMaxAggregateInputType = {
    id?: true
    uuid?: true
    org_uuid?: true
    name?: true
    is_system?: true
  }

  export type OrganizationRoleCountAggregateInputType = {
    id?: true
    uuid?: true
    org_uuid?: true
    name?: true
    is_system?: true
    _all?: true
  }

  export type OrganizationRoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrganizationRole to aggregate.
     */
    where?: OrganizationRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrganizationRoles to fetch.
     */
    orderBy?: OrganizationRoleOrderByWithRelationInput | OrganizationRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrganizationRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrganizationRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrganizationRoles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OrganizationRoles
    **/
    _count?: true | OrganizationRoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrganizationRoleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrganizationRoleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrganizationRoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrganizationRoleMaxAggregateInputType
  }

  export type GetOrganizationRoleAggregateType<T extends OrganizationRoleAggregateArgs> = {
        [P in keyof T & keyof AggregateOrganizationRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrganizationRole[P]>
      : GetScalarType<T[P], AggregateOrganizationRole[P]>
  }




  export type OrganizationRoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrganizationRoleWhereInput
    orderBy?: OrganizationRoleOrderByWithAggregationInput | OrganizationRoleOrderByWithAggregationInput[]
    by: OrganizationRoleScalarFieldEnum[] | OrganizationRoleScalarFieldEnum
    having?: OrganizationRoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrganizationRoleCountAggregateInputType | true
    _avg?: OrganizationRoleAvgAggregateInputType
    _sum?: OrganizationRoleSumAggregateInputType
    _min?: OrganizationRoleMinAggregateInputType
    _max?: OrganizationRoleMaxAggregateInputType
  }

  export type OrganizationRoleGroupByOutputType = {
    id: number
    uuid: string
    org_uuid: string
    name: string
    is_system: boolean
    _count: OrganizationRoleCountAggregateOutputType | null
    _avg: OrganizationRoleAvgAggregateOutputType | null
    _sum: OrganizationRoleSumAggregateOutputType | null
    _min: OrganizationRoleMinAggregateOutputType | null
    _max: OrganizationRoleMaxAggregateOutputType | null
  }

  type GetOrganizationRoleGroupByPayload<T extends OrganizationRoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrganizationRoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrganizationRoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrganizationRoleGroupByOutputType[P]>
            : GetScalarType<T[P], OrganizationRoleGroupByOutputType[P]>
        }
      >
    >


  export type OrganizationRoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    org_uuid?: boolean
    name?: boolean
    is_system?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    members?: boolean | OrganizationRole$membersArgs<ExtArgs>
    permissions?: boolean | OrganizationRole$permissionsArgs<ExtArgs>
    _count?: boolean | OrganizationRoleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organizationRole"]>

  export type OrganizationRoleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    org_uuid?: boolean
    name?: boolean
    is_system?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organizationRole"]>

  export type OrganizationRoleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    org_uuid?: boolean
    name?: boolean
    is_system?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organizationRole"]>

  export type OrganizationRoleSelectScalar = {
    id?: boolean
    uuid?: boolean
    org_uuid?: boolean
    name?: boolean
    is_system?: boolean
  }

  export type OrganizationRoleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "org_uuid" | "name" | "is_system", ExtArgs["result"]["organizationRole"]>
  export type OrganizationRoleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    members?: boolean | OrganizationRole$membersArgs<ExtArgs>
    permissions?: boolean | OrganizationRole$permissionsArgs<ExtArgs>
    _count?: boolean | OrganizationRoleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OrganizationRoleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }
  export type OrganizationRoleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }

  export type $OrganizationRolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OrganizationRole"
    objects: {
      organization: Prisma.$OrganizationPayload<ExtArgs>
      members: Prisma.$OrganizationMemberPayload<ExtArgs>[]
      permissions: Prisma.$RolePermissionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      org_uuid: string
      name: string
      is_system: boolean
    }, ExtArgs["result"]["organizationRole"]>
    composites: {}
  }

  type OrganizationRoleGetPayload<S extends boolean | null | undefined | OrganizationRoleDefaultArgs> = $Result.GetResult<Prisma.$OrganizationRolePayload, S>

  type OrganizationRoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrganizationRoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrganizationRoleCountAggregateInputType | true
    }

  export interface OrganizationRoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OrganizationRole'], meta: { name: 'OrganizationRole' } }
    /**
     * Find zero or one OrganizationRole that matches the filter.
     * @param {OrganizationRoleFindUniqueArgs} args - Arguments to find a OrganizationRole
     * @example
     * // Get one OrganizationRole
     * const organizationRole = await prisma.organizationRole.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrganizationRoleFindUniqueArgs>(args: SelectSubset<T, OrganizationRoleFindUniqueArgs<ExtArgs>>): Prisma__OrganizationRoleClient<$Result.GetResult<Prisma.$OrganizationRolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OrganizationRole that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrganizationRoleFindUniqueOrThrowArgs} args - Arguments to find a OrganizationRole
     * @example
     * // Get one OrganizationRole
     * const organizationRole = await prisma.organizationRole.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrganizationRoleFindUniqueOrThrowArgs>(args: SelectSubset<T, OrganizationRoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrganizationRoleClient<$Result.GetResult<Prisma.$OrganizationRolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrganizationRole that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationRoleFindFirstArgs} args - Arguments to find a OrganizationRole
     * @example
     * // Get one OrganizationRole
     * const organizationRole = await prisma.organizationRole.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrganizationRoleFindFirstArgs>(args?: SelectSubset<T, OrganizationRoleFindFirstArgs<ExtArgs>>): Prisma__OrganizationRoleClient<$Result.GetResult<Prisma.$OrganizationRolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrganizationRole that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationRoleFindFirstOrThrowArgs} args - Arguments to find a OrganizationRole
     * @example
     * // Get one OrganizationRole
     * const organizationRole = await prisma.organizationRole.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrganizationRoleFindFirstOrThrowArgs>(args?: SelectSubset<T, OrganizationRoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrganizationRoleClient<$Result.GetResult<Prisma.$OrganizationRolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OrganizationRoles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationRoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OrganizationRoles
     * const organizationRoles = await prisma.organizationRole.findMany()
     * 
     * // Get first 10 OrganizationRoles
     * const organizationRoles = await prisma.organizationRole.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const organizationRoleWithIdOnly = await prisma.organizationRole.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrganizationRoleFindManyArgs>(args?: SelectSubset<T, OrganizationRoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationRolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OrganizationRole.
     * @param {OrganizationRoleCreateArgs} args - Arguments to create a OrganizationRole.
     * @example
     * // Create one OrganizationRole
     * const OrganizationRole = await prisma.organizationRole.create({
     *   data: {
     *     // ... data to create a OrganizationRole
     *   }
     * })
     * 
     */
    create<T extends OrganizationRoleCreateArgs>(args: SelectSubset<T, OrganizationRoleCreateArgs<ExtArgs>>): Prisma__OrganizationRoleClient<$Result.GetResult<Prisma.$OrganizationRolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OrganizationRoles.
     * @param {OrganizationRoleCreateManyArgs} args - Arguments to create many OrganizationRoles.
     * @example
     * // Create many OrganizationRoles
     * const organizationRole = await prisma.organizationRole.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrganizationRoleCreateManyArgs>(args?: SelectSubset<T, OrganizationRoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OrganizationRoles and returns the data saved in the database.
     * @param {OrganizationRoleCreateManyAndReturnArgs} args - Arguments to create many OrganizationRoles.
     * @example
     * // Create many OrganizationRoles
     * const organizationRole = await prisma.organizationRole.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OrganizationRoles and only return the `id`
     * const organizationRoleWithIdOnly = await prisma.organizationRole.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrganizationRoleCreateManyAndReturnArgs>(args?: SelectSubset<T, OrganizationRoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationRolePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OrganizationRole.
     * @param {OrganizationRoleDeleteArgs} args - Arguments to delete one OrganizationRole.
     * @example
     * // Delete one OrganizationRole
     * const OrganizationRole = await prisma.organizationRole.delete({
     *   where: {
     *     // ... filter to delete one OrganizationRole
     *   }
     * })
     * 
     */
    delete<T extends OrganizationRoleDeleteArgs>(args: SelectSubset<T, OrganizationRoleDeleteArgs<ExtArgs>>): Prisma__OrganizationRoleClient<$Result.GetResult<Prisma.$OrganizationRolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OrganizationRole.
     * @param {OrganizationRoleUpdateArgs} args - Arguments to update one OrganizationRole.
     * @example
     * // Update one OrganizationRole
     * const organizationRole = await prisma.organizationRole.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrganizationRoleUpdateArgs>(args: SelectSubset<T, OrganizationRoleUpdateArgs<ExtArgs>>): Prisma__OrganizationRoleClient<$Result.GetResult<Prisma.$OrganizationRolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OrganizationRoles.
     * @param {OrganizationRoleDeleteManyArgs} args - Arguments to filter OrganizationRoles to delete.
     * @example
     * // Delete a few OrganizationRoles
     * const { count } = await prisma.organizationRole.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrganizationRoleDeleteManyArgs>(args?: SelectSubset<T, OrganizationRoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrganizationRoles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationRoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OrganizationRoles
     * const organizationRole = await prisma.organizationRole.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrganizationRoleUpdateManyArgs>(args: SelectSubset<T, OrganizationRoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrganizationRoles and returns the data updated in the database.
     * @param {OrganizationRoleUpdateManyAndReturnArgs} args - Arguments to update many OrganizationRoles.
     * @example
     * // Update many OrganizationRoles
     * const organizationRole = await prisma.organizationRole.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OrganizationRoles and only return the `id`
     * const organizationRoleWithIdOnly = await prisma.organizationRole.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrganizationRoleUpdateManyAndReturnArgs>(args: SelectSubset<T, OrganizationRoleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationRolePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OrganizationRole.
     * @param {OrganizationRoleUpsertArgs} args - Arguments to update or create a OrganizationRole.
     * @example
     * // Update or create a OrganizationRole
     * const organizationRole = await prisma.organizationRole.upsert({
     *   create: {
     *     // ... data to create a OrganizationRole
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OrganizationRole we want to update
     *   }
     * })
     */
    upsert<T extends OrganizationRoleUpsertArgs>(args: SelectSubset<T, OrganizationRoleUpsertArgs<ExtArgs>>): Prisma__OrganizationRoleClient<$Result.GetResult<Prisma.$OrganizationRolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OrganizationRoles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationRoleCountArgs} args - Arguments to filter OrganizationRoles to count.
     * @example
     * // Count the number of OrganizationRoles
     * const count = await prisma.organizationRole.count({
     *   where: {
     *     // ... the filter for the OrganizationRoles we want to count
     *   }
     * })
    **/
    count<T extends OrganizationRoleCountArgs>(
      args?: Subset<T, OrganizationRoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrganizationRoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OrganizationRole.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationRoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OrganizationRoleAggregateArgs>(args: Subset<T, OrganizationRoleAggregateArgs>): Prisma.PrismaPromise<GetOrganizationRoleAggregateType<T>>

    /**
     * Group by OrganizationRole.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationRoleGroupByArgs} args - Group by arguments.
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
      T extends OrganizationRoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrganizationRoleGroupByArgs['orderBy'] }
        : { orderBy?: OrganizationRoleGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OrganizationRoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganizationRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OrganizationRole model
   */
  readonly fields: OrganizationRoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OrganizationRole.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrganizationRoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organization<T extends OrganizationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationDefaultArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    members<T extends OrganizationRole$membersArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationRole$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    permissions<T extends OrganizationRole$permissionsArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationRole$permissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the OrganizationRole model
   */
  interface OrganizationRoleFieldRefs {
    readonly id: FieldRef<"OrganizationRole", 'Int'>
    readonly uuid: FieldRef<"OrganizationRole", 'String'>
    readonly org_uuid: FieldRef<"OrganizationRole", 'String'>
    readonly name: FieldRef<"OrganizationRole", 'String'>
    readonly is_system: FieldRef<"OrganizationRole", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * OrganizationRole findUnique
   */
  export type OrganizationRoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationRole
     */
    select?: OrganizationRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationRole
     */
    omit?: OrganizationRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationRoleInclude<ExtArgs> | null
    /**
     * Filter, which OrganizationRole to fetch.
     */
    where: OrganizationRoleWhereUniqueInput
  }

  /**
   * OrganizationRole findUniqueOrThrow
   */
  export type OrganizationRoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationRole
     */
    select?: OrganizationRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationRole
     */
    omit?: OrganizationRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationRoleInclude<ExtArgs> | null
    /**
     * Filter, which OrganizationRole to fetch.
     */
    where: OrganizationRoleWhereUniqueInput
  }

  /**
   * OrganizationRole findFirst
   */
  export type OrganizationRoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationRole
     */
    select?: OrganizationRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationRole
     */
    omit?: OrganizationRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationRoleInclude<ExtArgs> | null
    /**
     * Filter, which OrganizationRole to fetch.
     */
    where?: OrganizationRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrganizationRoles to fetch.
     */
    orderBy?: OrganizationRoleOrderByWithRelationInput | OrganizationRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrganizationRoles.
     */
    cursor?: OrganizationRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrganizationRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrganizationRoles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrganizationRoles.
     */
    distinct?: OrganizationRoleScalarFieldEnum | OrganizationRoleScalarFieldEnum[]
  }

  /**
   * OrganizationRole findFirstOrThrow
   */
  export type OrganizationRoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationRole
     */
    select?: OrganizationRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationRole
     */
    omit?: OrganizationRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationRoleInclude<ExtArgs> | null
    /**
     * Filter, which OrganizationRole to fetch.
     */
    where?: OrganizationRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrganizationRoles to fetch.
     */
    orderBy?: OrganizationRoleOrderByWithRelationInput | OrganizationRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrganizationRoles.
     */
    cursor?: OrganizationRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrganizationRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrganizationRoles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrganizationRoles.
     */
    distinct?: OrganizationRoleScalarFieldEnum | OrganizationRoleScalarFieldEnum[]
  }

  /**
   * OrganizationRole findMany
   */
  export type OrganizationRoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationRole
     */
    select?: OrganizationRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationRole
     */
    omit?: OrganizationRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationRoleInclude<ExtArgs> | null
    /**
     * Filter, which OrganizationRoles to fetch.
     */
    where?: OrganizationRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrganizationRoles to fetch.
     */
    orderBy?: OrganizationRoleOrderByWithRelationInput | OrganizationRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OrganizationRoles.
     */
    cursor?: OrganizationRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrganizationRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrganizationRoles.
     */
    skip?: number
    distinct?: OrganizationRoleScalarFieldEnum | OrganizationRoleScalarFieldEnum[]
  }

  /**
   * OrganizationRole create
   */
  export type OrganizationRoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationRole
     */
    select?: OrganizationRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationRole
     */
    omit?: OrganizationRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationRoleInclude<ExtArgs> | null
    /**
     * The data needed to create a OrganizationRole.
     */
    data: XOR<OrganizationRoleCreateInput, OrganizationRoleUncheckedCreateInput>
  }

  /**
   * OrganizationRole createMany
   */
  export type OrganizationRoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OrganizationRoles.
     */
    data: OrganizationRoleCreateManyInput | OrganizationRoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OrganizationRole createManyAndReturn
   */
  export type OrganizationRoleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationRole
     */
    select?: OrganizationRoleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationRole
     */
    omit?: OrganizationRoleOmit<ExtArgs> | null
    /**
     * The data used to create many OrganizationRoles.
     */
    data: OrganizationRoleCreateManyInput | OrganizationRoleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationRoleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrganizationRole update
   */
  export type OrganizationRoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationRole
     */
    select?: OrganizationRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationRole
     */
    omit?: OrganizationRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationRoleInclude<ExtArgs> | null
    /**
     * The data needed to update a OrganizationRole.
     */
    data: XOR<OrganizationRoleUpdateInput, OrganizationRoleUncheckedUpdateInput>
    /**
     * Choose, which OrganizationRole to update.
     */
    where: OrganizationRoleWhereUniqueInput
  }

  /**
   * OrganizationRole updateMany
   */
  export type OrganizationRoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OrganizationRoles.
     */
    data: XOR<OrganizationRoleUpdateManyMutationInput, OrganizationRoleUncheckedUpdateManyInput>
    /**
     * Filter which OrganizationRoles to update
     */
    where?: OrganizationRoleWhereInput
    /**
     * Limit how many OrganizationRoles to update.
     */
    limit?: number
  }

  /**
   * OrganizationRole updateManyAndReturn
   */
  export type OrganizationRoleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationRole
     */
    select?: OrganizationRoleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationRole
     */
    omit?: OrganizationRoleOmit<ExtArgs> | null
    /**
     * The data used to update OrganizationRoles.
     */
    data: XOR<OrganizationRoleUpdateManyMutationInput, OrganizationRoleUncheckedUpdateManyInput>
    /**
     * Filter which OrganizationRoles to update
     */
    where?: OrganizationRoleWhereInput
    /**
     * Limit how many OrganizationRoles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationRoleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrganizationRole upsert
   */
  export type OrganizationRoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationRole
     */
    select?: OrganizationRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationRole
     */
    omit?: OrganizationRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationRoleInclude<ExtArgs> | null
    /**
     * The filter to search for the OrganizationRole to update in case it exists.
     */
    where: OrganizationRoleWhereUniqueInput
    /**
     * In case the OrganizationRole found by the `where` argument doesn't exist, create a new OrganizationRole with this data.
     */
    create: XOR<OrganizationRoleCreateInput, OrganizationRoleUncheckedCreateInput>
    /**
     * In case the OrganizationRole was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrganizationRoleUpdateInput, OrganizationRoleUncheckedUpdateInput>
  }

  /**
   * OrganizationRole delete
   */
  export type OrganizationRoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationRole
     */
    select?: OrganizationRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationRole
     */
    omit?: OrganizationRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationRoleInclude<ExtArgs> | null
    /**
     * Filter which OrganizationRole to delete.
     */
    where: OrganizationRoleWhereUniqueInput
  }

  /**
   * OrganizationRole deleteMany
   */
  export type OrganizationRoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrganizationRoles to delete
     */
    where?: OrganizationRoleWhereInput
    /**
     * Limit how many OrganizationRoles to delete.
     */
    limit?: number
  }

  /**
   * OrganizationRole.members
   */
  export type OrganizationRole$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationMember
     */
    select?: OrganizationMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationMember
     */
    omit?: OrganizationMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationMemberInclude<ExtArgs> | null
    where?: OrganizationMemberWhereInput
    orderBy?: OrganizationMemberOrderByWithRelationInput | OrganizationMemberOrderByWithRelationInput[]
    cursor?: OrganizationMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrganizationMemberScalarFieldEnum | OrganizationMemberScalarFieldEnum[]
  }

  /**
   * OrganizationRole.permissions
   */
  export type OrganizationRole$permissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    where?: RolePermissionWhereInput
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    cursor?: RolePermissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RolePermissionScalarFieldEnum | RolePermissionScalarFieldEnum[]
  }

  /**
   * OrganizationRole without action
   */
  export type OrganizationRoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationRole
     */
    select?: OrganizationRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrganizationRole
     */
    omit?: OrganizationRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationRoleInclude<ExtArgs> | null
  }


  /**
   * Model Permission
   */

  export type AggregatePermission = {
    _count: PermissionCountAggregateOutputType | null
    _avg: PermissionAvgAggregateOutputType | null
    _sum: PermissionSumAggregateOutputType | null
    _min: PermissionMinAggregateOutputType | null
    _max: PermissionMaxAggregateOutputType | null
  }

  export type PermissionAvgAggregateOutputType = {
    id: number | null
  }

  export type PermissionSumAggregateOutputType = {
    id: number | null
  }

  export type PermissionMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    key: string | null
    label: string | null
    group: string | null
  }

  export type PermissionMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    key: string | null
    label: string | null
    group: string | null
  }

  export type PermissionCountAggregateOutputType = {
    id: number
    uuid: number
    key: number
    label: number
    group: number
    _all: number
  }


  export type PermissionAvgAggregateInputType = {
    id?: true
  }

  export type PermissionSumAggregateInputType = {
    id?: true
  }

  export type PermissionMinAggregateInputType = {
    id?: true
    uuid?: true
    key?: true
    label?: true
    group?: true
  }

  export type PermissionMaxAggregateInputType = {
    id?: true
    uuid?: true
    key?: true
    label?: true
    group?: true
  }

  export type PermissionCountAggregateInputType = {
    id?: true
    uuid?: true
    key?: true
    label?: true
    group?: true
    _all?: true
  }

  export type PermissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Permission to aggregate.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Permissions
    **/
    _count?: true | PermissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PermissionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PermissionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PermissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PermissionMaxAggregateInputType
  }

  export type GetPermissionAggregateType<T extends PermissionAggregateArgs> = {
        [P in keyof T & keyof AggregatePermission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePermission[P]>
      : GetScalarType<T[P], AggregatePermission[P]>
  }




  export type PermissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PermissionWhereInput
    orderBy?: PermissionOrderByWithAggregationInput | PermissionOrderByWithAggregationInput[]
    by: PermissionScalarFieldEnum[] | PermissionScalarFieldEnum
    having?: PermissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PermissionCountAggregateInputType | true
    _avg?: PermissionAvgAggregateInputType
    _sum?: PermissionSumAggregateInputType
    _min?: PermissionMinAggregateInputType
    _max?: PermissionMaxAggregateInputType
  }

  export type PermissionGroupByOutputType = {
    id: number
    uuid: string
    key: string
    label: string
    group: string
    _count: PermissionCountAggregateOutputType | null
    _avg: PermissionAvgAggregateOutputType | null
    _sum: PermissionSumAggregateOutputType | null
    _min: PermissionMinAggregateOutputType | null
    _max: PermissionMaxAggregateOutputType | null
  }

  type GetPermissionGroupByPayload<T extends PermissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PermissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PermissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PermissionGroupByOutputType[P]>
            : GetScalarType<T[P], PermissionGroupByOutputType[P]>
        }
      >
    >


  export type PermissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    key?: boolean
    label?: boolean
    group?: boolean
    roles?: boolean | Permission$rolesArgs<ExtArgs>
    _count?: boolean | PermissionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["permission"]>

  export type PermissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    key?: boolean
    label?: boolean
    group?: boolean
  }, ExtArgs["result"]["permission"]>

  export type PermissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    key?: boolean
    label?: boolean
    group?: boolean
  }, ExtArgs["result"]["permission"]>

  export type PermissionSelectScalar = {
    id?: boolean
    uuid?: boolean
    key?: boolean
    label?: boolean
    group?: boolean
  }

  export type PermissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "key" | "label" | "group", ExtArgs["result"]["permission"]>
  export type PermissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roles?: boolean | Permission$rolesArgs<ExtArgs>
    _count?: boolean | PermissionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PermissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PermissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PermissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Permission"
    objects: {
      roles: Prisma.$RolePermissionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      key: string
      label: string
      group: string
    }, ExtArgs["result"]["permission"]>
    composites: {}
  }

  type PermissionGetPayload<S extends boolean | null | undefined | PermissionDefaultArgs> = $Result.GetResult<Prisma.$PermissionPayload, S>

  type PermissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PermissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PermissionCountAggregateInputType | true
    }

  export interface PermissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Permission'], meta: { name: 'Permission' } }
    /**
     * Find zero or one Permission that matches the filter.
     * @param {PermissionFindUniqueArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PermissionFindUniqueArgs>(args: SelectSubset<T, PermissionFindUniqueArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Permission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PermissionFindUniqueOrThrowArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PermissionFindUniqueOrThrowArgs>(args: SelectSubset<T, PermissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Permission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindFirstArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PermissionFindFirstArgs>(args?: SelectSubset<T, PermissionFindFirstArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Permission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindFirstOrThrowArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PermissionFindFirstOrThrowArgs>(args?: SelectSubset<T, PermissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Permissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Permissions
     * const permissions = await prisma.permission.findMany()
     * 
     * // Get first 10 Permissions
     * const permissions = await prisma.permission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const permissionWithIdOnly = await prisma.permission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PermissionFindManyArgs>(args?: SelectSubset<T, PermissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Permission.
     * @param {PermissionCreateArgs} args - Arguments to create a Permission.
     * @example
     * // Create one Permission
     * const Permission = await prisma.permission.create({
     *   data: {
     *     // ... data to create a Permission
     *   }
     * })
     * 
     */
    create<T extends PermissionCreateArgs>(args: SelectSubset<T, PermissionCreateArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Permissions.
     * @param {PermissionCreateManyArgs} args - Arguments to create many Permissions.
     * @example
     * // Create many Permissions
     * const permission = await prisma.permission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PermissionCreateManyArgs>(args?: SelectSubset<T, PermissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Permissions and returns the data saved in the database.
     * @param {PermissionCreateManyAndReturnArgs} args - Arguments to create many Permissions.
     * @example
     * // Create many Permissions
     * const permission = await prisma.permission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Permissions and only return the `id`
     * const permissionWithIdOnly = await prisma.permission.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PermissionCreateManyAndReturnArgs>(args?: SelectSubset<T, PermissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Permission.
     * @param {PermissionDeleteArgs} args - Arguments to delete one Permission.
     * @example
     * // Delete one Permission
     * const Permission = await prisma.permission.delete({
     *   where: {
     *     // ... filter to delete one Permission
     *   }
     * })
     * 
     */
    delete<T extends PermissionDeleteArgs>(args: SelectSubset<T, PermissionDeleteArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Permission.
     * @param {PermissionUpdateArgs} args - Arguments to update one Permission.
     * @example
     * // Update one Permission
     * const permission = await prisma.permission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PermissionUpdateArgs>(args: SelectSubset<T, PermissionUpdateArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Permissions.
     * @param {PermissionDeleteManyArgs} args - Arguments to filter Permissions to delete.
     * @example
     * // Delete a few Permissions
     * const { count } = await prisma.permission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PermissionDeleteManyArgs>(args?: SelectSubset<T, PermissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Permissions
     * const permission = await prisma.permission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PermissionUpdateManyArgs>(args: SelectSubset<T, PermissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Permissions and returns the data updated in the database.
     * @param {PermissionUpdateManyAndReturnArgs} args - Arguments to update many Permissions.
     * @example
     * // Update many Permissions
     * const permission = await prisma.permission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Permissions and only return the `id`
     * const permissionWithIdOnly = await prisma.permission.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PermissionUpdateManyAndReturnArgs>(args: SelectSubset<T, PermissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Permission.
     * @param {PermissionUpsertArgs} args - Arguments to update or create a Permission.
     * @example
     * // Update or create a Permission
     * const permission = await prisma.permission.upsert({
     *   create: {
     *     // ... data to create a Permission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Permission we want to update
     *   }
     * })
     */
    upsert<T extends PermissionUpsertArgs>(args: SelectSubset<T, PermissionUpsertArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionCountArgs} args - Arguments to filter Permissions to count.
     * @example
     * // Count the number of Permissions
     * const count = await prisma.permission.count({
     *   where: {
     *     // ... the filter for the Permissions we want to count
     *   }
     * })
    **/
    count<T extends PermissionCountArgs>(
      args?: Subset<T, PermissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PermissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Permission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PermissionAggregateArgs>(args: Subset<T, PermissionAggregateArgs>): Prisma.PrismaPromise<GetPermissionAggregateType<T>>

    /**
     * Group by Permission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionGroupByArgs} args - Group by arguments.
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
      T extends PermissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PermissionGroupByArgs['orderBy'] }
        : { orderBy?: PermissionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PermissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPermissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Permission model
   */
  readonly fields: PermissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Permission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PermissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    roles<T extends Permission$rolesArgs<ExtArgs> = {}>(args?: Subset<T, Permission$rolesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Permission model
   */
  interface PermissionFieldRefs {
    readonly id: FieldRef<"Permission", 'Int'>
    readonly uuid: FieldRef<"Permission", 'String'>
    readonly key: FieldRef<"Permission", 'String'>
    readonly label: FieldRef<"Permission", 'String'>
    readonly group: FieldRef<"Permission", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Permission findUnique
   */
  export type PermissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission findUniqueOrThrow
   */
  export type PermissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission findFirst
   */
  export type PermissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Permissions.
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Permissions.
     */
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
  }

  /**
   * Permission findFirstOrThrow
   */
  export type PermissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Permissions.
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Permissions.
     */
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
  }

  /**
   * Permission findMany
   */
  export type PermissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permissions to fetch.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Permissions.
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
  }

  /**
   * Permission create
   */
  export type PermissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * The data needed to create a Permission.
     */
    data: XOR<PermissionCreateInput, PermissionUncheckedCreateInput>
  }

  /**
   * Permission createMany
   */
  export type PermissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Permissions.
     */
    data: PermissionCreateManyInput | PermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Permission createManyAndReturn
   */
  export type PermissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * The data used to create many Permissions.
     */
    data: PermissionCreateManyInput | PermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Permission update
   */
  export type PermissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * The data needed to update a Permission.
     */
    data: XOR<PermissionUpdateInput, PermissionUncheckedUpdateInput>
    /**
     * Choose, which Permission to update.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission updateMany
   */
  export type PermissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Permissions.
     */
    data: XOR<PermissionUpdateManyMutationInput, PermissionUncheckedUpdateManyInput>
    /**
     * Filter which Permissions to update
     */
    where?: PermissionWhereInput
    /**
     * Limit how many Permissions to update.
     */
    limit?: number
  }

  /**
   * Permission updateManyAndReturn
   */
  export type PermissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * The data used to update Permissions.
     */
    data: XOR<PermissionUpdateManyMutationInput, PermissionUncheckedUpdateManyInput>
    /**
     * Filter which Permissions to update
     */
    where?: PermissionWhereInput
    /**
     * Limit how many Permissions to update.
     */
    limit?: number
  }

  /**
   * Permission upsert
   */
  export type PermissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * The filter to search for the Permission to update in case it exists.
     */
    where: PermissionWhereUniqueInput
    /**
     * In case the Permission found by the `where` argument doesn't exist, create a new Permission with this data.
     */
    create: XOR<PermissionCreateInput, PermissionUncheckedCreateInput>
    /**
     * In case the Permission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PermissionUpdateInput, PermissionUncheckedUpdateInput>
  }

  /**
   * Permission delete
   */
  export type PermissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter which Permission to delete.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission deleteMany
   */
  export type PermissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Permissions to delete
     */
    where?: PermissionWhereInput
    /**
     * Limit how many Permissions to delete.
     */
    limit?: number
  }

  /**
   * Permission.roles
   */
  export type Permission$rolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    where?: RolePermissionWhereInput
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    cursor?: RolePermissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RolePermissionScalarFieldEnum | RolePermissionScalarFieldEnum[]
  }

  /**
   * Permission without action
   */
  export type PermissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
  }


  /**
   * Model RolePermission
   */

  export type AggregateRolePermission = {
    _count: RolePermissionCountAggregateOutputType | null
    _avg: RolePermissionAvgAggregateOutputType | null
    _sum: RolePermissionSumAggregateOutputType | null
    _min: RolePermissionMinAggregateOutputType | null
    _max: RolePermissionMaxAggregateOutputType | null
  }

  export type RolePermissionAvgAggregateOutputType = {
    id: number | null
  }

  export type RolePermissionSumAggregateOutputType = {
    id: number | null
  }

  export type RolePermissionMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    role_uuid: string | null
    permission_uuid: string | null
  }

  export type RolePermissionMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    role_uuid: string | null
    permission_uuid: string | null
  }

  export type RolePermissionCountAggregateOutputType = {
    id: number
    uuid: number
    role_uuid: number
    permission_uuid: number
    _all: number
  }


  export type RolePermissionAvgAggregateInputType = {
    id?: true
  }

  export type RolePermissionSumAggregateInputType = {
    id?: true
  }

  export type RolePermissionMinAggregateInputType = {
    id?: true
    uuid?: true
    role_uuid?: true
    permission_uuid?: true
  }

  export type RolePermissionMaxAggregateInputType = {
    id?: true
    uuid?: true
    role_uuid?: true
    permission_uuid?: true
  }

  export type RolePermissionCountAggregateInputType = {
    id?: true
    uuid?: true
    role_uuid?: true
    permission_uuid?: true
    _all?: true
  }

  export type RolePermissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RolePermission to aggregate.
     */
    where?: RolePermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RolePermissions to fetch.
     */
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RolePermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RolePermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RolePermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RolePermissions
    **/
    _count?: true | RolePermissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RolePermissionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RolePermissionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RolePermissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RolePermissionMaxAggregateInputType
  }

  export type GetRolePermissionAggregateType<T extends RolePermissionAggregateArgs> = {
        [P in keyof T & keyof AggregateRolePermission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRolePermission[P]>
      : GetScalarType<T[P], AggregateRolePermission[P]>
  }




  export type RolePermissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RolePermissionWhereInput
    orderBy?: RolePermissionOrderByWithAggregationInput | RolePermissionOrderByWithAggregationInput[]
    by: RolePermissionScalarFieldEnum[] | RolePermissionScalarFieldEnum
    having?: RolePermissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RolePermissionCountAggregateInputType | true
    _avg?: RolePermissionAvgAggregateInputType
    _sum?: RolePermissionSumAggregateInputType
    _min?: RolePermissionMinAggregateInputType
    _max?: RolePermissionMaxAggregateInputType
  }

  export type RolePermissionGroupByOutputType = {
    id: number
    uuid: string
    role_uuid: string
    permission_uuid: string
    _count: RolePermissionCountAggregateOutputType | null
    _avg: RolePermissionAvgAggregateOutputType | null
    _sum: RolePermissionSumAggregateOutputType | null
    _min: RolePermissionMinAggregateOutputType | null
    _max: RolePermissionMaxAggregateOutputType | null
  }

  type GetRolePermissionGroupByPayload<T extends RolePermissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RolePermissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RolePermissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RolePermissionGroupByOutputType[P]>
            : GetScalarType<T[P], RolePermissionGroupByOutputType[P]>
        }
      >
    >


  export type RolePermissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    role_uuid?: boolean
    permission_uuid?: boolean
    role?: boolean | OrganizationRoleDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rolePermission"]>

  export type RolePermissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    role_uuid?: boolean
    permission_uuid?: boolean
    role?: boolean | OrganizationRoleDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rolePermission"]>

  export type RolePermissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    role_uuid?: boolean
    permission_uuid?: boolean
    role?: boolean | OrganizationRoleDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rolePermission"]>

  export type RolePermissionSelectScalar = {
    id?: boolean
    uuid?: boolean
    role_uuid?: boolean
    permission_uuid?: boolean
  }

  export type RolePermissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "role_uuid" | "permission_uuid", ExtArgs["result"]["rolePermission"]>
  export type RolePermissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | OrganizationRoleDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }
  export type RolePermissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | OrganizationRoleDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }
  export type RolePermissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | OrganizationRoleDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }

  export type $RolePermissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RolePermission"
    objects: {
      role: Prisma.$OrganizationRolePayload<ExtArgs>
      permission: Prisma.$PermissionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      role_uuid: string
      permission_uuid: string
    }, ExtArgs["result"]["rolePermission"]>
    composites: {}
  }

  type RolePermissionGetPayload<S extends boolean | null | undefined | RolePermissionDefaultArgs> = $Result.GetResult<Prisma.$RolePermissionPayload, S>

  type RolePermissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RolePermissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RolePermissionCountAggregateInputType | true
    }

  export interface RolePermissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RolePermission'], meta: { name: 'RolePermission' } }
    /**
     * Find zero or one RolePermission that matches the filter.
     * @param {RolePermissionFindUniqueArgs} args - Arguments to find a RolePermission
     * @example
     * // Get one RolePermission
     * const rolePermission = await prisma.rolePermission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RolePermissionFindUniqueArgs>(args: SelectSubset<T, RolePermissionFindUniqueArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RolePermission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RolePermissionFindUniqueOrThrowArgs} args - Arguments to find a RolePermission
     * @example
     * // Get one RolePermission
     * const rolePermission = await prisma.rolePermission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RolePermissionFindUniqueOrThrowArgs>(args: SelectSubset<T, RolePermissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RolePermission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionFindFirstArgs} args - Arguments to find a RolePermission
     * @example
     * // Get one RolePermission
     * const rolePermission = await prisma.rolePermission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RolePermissionFindFirstArgs>(args?: SelectSubset<T, RolePermissionFindFirstArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RolePermission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionFindFirstOrThrowArgs} args - Arguments to find a RolePermission
     * @example
     * // Get one RolePermission
     * const rolePermission = await prisma.rolePermission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RolePermissionFindFirstOrThrowArgs>(args?: SelectSubset<T, RolePermissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RolePermissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RolePermissions
     * const rolePermissions = await prisma.rolePermission.findMany()
     * 
     * // Get first 10 RolePermissions
     * const rolePermissions = await prisma.rolePermission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rolePermissionWithIdOnly = await prisma.rolePermission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RolePermissionFindManyArgs>(args?: SelectSubset<T, RolePermissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RolePermission.
     * @param {RolePermissionCreateArgs} args - Arguments to create a RolePermission.
     * @example
     * // Create one RolePermission
     * const RolePermission = await prisma.rolePermission.create({
     *   data: {
     *     // ... data to create a RolePermission
     *   }
     * })
     * 
     */
    create<T extends RolePermissionCreateArgs>(args: SelectSubset<T, RolePermissionCreateArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RolePermissions.
     * @param {RolePermissionCreateManyArgs} args - Arguments to create many RolePermissions.
     * @example
     * // Create many RolePermissions
     * const rolePermission = await prisma.rolePermission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RolePermissionCreateManyArgs>(args?: SelectSubset<T, RolePermissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RolePermissions and returns the data saved in the database.
     * @param {RolePermissionCreateManyAndReturnArgs} args - Arguments to create many RolePermissions.
     * @example
     * // Create many RolePermissions
     * const rolePermission = await prisma.rolePermission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RolePermissions and only return the `id`
     * const rolePermissionWithIdOnly = await prisma.rolePermission.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RolePermissionCreateManyAndReturnArgs>(args?: SelectSubset<T, RolePermissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RolePermission.
     * @param {RolePermissionDeleteArgs} args - Arguments to delete one RolePermission.
     * @example
     * // Delete one RolePermission
     * const RolePermission = await prisma.rolePermission.delete({
     *   where: {
     *     // ... filter to delete one RolePermission
     *   }
     * })
     * 
     */
    delete<T extends RolePermissionDeleteArgs>(args: SelectSubset<T, RolePermissionDeleteArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RolePermission.
     * @param {RolePermissionUpdateArgs} args - Arguments to update one RolePermission.
     * @example
     * // Update one RolePermission
     * const rolePermission = await prisma.rolePermission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RolePermissionUpdateArgs>(args: SelectSubset<T, RolePermissionUpdateArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RolePermissions.
     * @param {RolePermissionDeleteManyArgs} args - Arguments to filter RolePermissions to delete.
     * @example
     * // Delete a few RolePermissions
     * const { count } = await prisma.rolePermission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RolePermissionDeleteManyArgs>(args?: SelectSubset<T, RolePermissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RolePermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RolePermissions
     * const rolePermission = await prisma.rolePermission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RolePermissionUpdateManyArgs>(args: SelectSubset<T, RolePermissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RolePermissions and returns the data updated in the database.
     * @param {RolePermissionUpdateManyAndReturnArgs} args - Arguments to update many RolePermissions.
     * @example
     * // Update many RolePermissions
     * const rolePermission = await prisma.rolePermission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RolePermissions and only return the `id`
     * const rolePermissionWithIdOnly = await prisma.rolePermission.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RolePermissionUpdateManyAndReturnArgs>(args: SelectSubset<T, RolePermissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RolePermission.
     * @param {RolePermissionUpsertArgs} args - Arguments to update or create a RolePermission.
     * @example
     * // Update or create a RolePermission
     * const rolePermission = await prisma.rolePermission.upsert({
     *   create: {
     *     // ... data to create a RolePermission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RolePermission we want to update
     *   }
     * })
     */
    upsert<T extends RolePermissionUpsertArgs>(args: SelectSubset<T, RolePermissionUpsertArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RolePermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionCountArgs} args - Arguments to filter RolePermissions to count.
     * @example
     * // Count the number of RolePermissions
     * const count = await prisma.rolePermission.count({
     *   where: {
     *     // ... the filter for the RolePermissions we want to count
     *   }
     * })
    **/
    count<T extends RolePermissionCountArgs>(
      args?: Subset<T, RolePermissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RolePermissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RolePermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RolePermissionAggregateArgs>(args: Subset<T, RolePermissionAggregateArgs>): Prisma.PrismaPromise<GetRolePermissionAggregateType<T>>

    /**
     * Group by RolePermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionGroupByArgs} args - Group by arguments.
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
      T extends RolePermissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RolePermissionGroupByArgs['orderBy'] }
        : { orderBy?: RolePermissionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RolePermissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRolePermissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RolePermission model
   */
  readonly fields: RolePermissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RolePermission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RolePermissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    role<T extends OrganizationRoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationRoleDefaultArgs<ExtArgs>>): Prisma__OrganizationRoleClient<$Result.GetResult<Prisma.$OrganizationRolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    permission<T extends PermissionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PermissionDefaultArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the RolePermission model
   */
  interface RolePermissionFieldRefs {
    readonly id: FieldRef<"RolePermission", 'Int'>
    readonly uuid: FieldRef<"RolePermission", 'String'>
    readonly role_uuid: FieldRef<"RolePermission", 'String'>
    readonly permission_uuid: FieldRef<"RolePermission", 'String'>
  }
    

  // Custom InputTypes
  /**
   * RolePermission findUnique
   */
  export type RolePermissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter, which RolePermission to fetch.
     */
    where: RolePermissionWhereUniqueInput
  }

  /**
   * RolePermission findUniqueOrThrow
   */
  export type RolePermissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter, which RolePermission to fetch.
     */
    where: RolePermissionWhereUniqueInput
  }

  /**
   * RolePermission findFirst
   */
  export type RolePermissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter, which RolePermission to fetch.
     */
    where?: RolePermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RolePermissions to fetch.
     */
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RolePermissions.
     */
    cursor?: RolePermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RolePermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RolePermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RolePermissions.
     */
    distinct?: RolePermissionScalarFieldEnum | RolePermissionScalarFieldEnum[]
  }

  /**
   * RolePermission findFirstOrThrow
   */
  export type RolePermissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter, which RolePermission to fetch.
     */
    where?: RolePermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RolePermissions to fetch.
     */
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RolePermissions.
     */
    cursor?: RolePermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RolePermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RolePermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RolePermissions.
     */
    distinct?: RolePermissionScalarFieldEnum | RolePermissionScalarFieldEnum[]
  }

  /**
   * RolePermission findMany
   */
  export type RolePermissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter, which RolePermissions to fetch.
     */
    where?: RolePermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RolePermissions to fetch.
     */
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RolePermissions.
     */
    cursor?: RolePermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RolePermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RolePermissions.
     */
    skip?: number
    distinct?: RolePermissionScalarFieldEnum | RolePermissionScalarFieldEnum[]
  }

  /**
   * RolePermission create
   */
  export type RolePermissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * The data needed to create a RolePermission.
     */
    data: XOR<RolePermissionCreateInput, RolePermissionUncheckedCreateInput>
  }

  /**
   * RolePermission createMany
   */
  export type RolePermissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RolePermissions.
     */
    data: RolePermissionCreateManyInput | RolePermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RolePermission createManyAndReturn
   */
  export type RolePermissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * The data used to create many RolePermissions.
     */
    data: RolePermissionCreateManyInput | RolePermissionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RolePermission update
   */
  export type RolePermissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * The data needed to update a RolePermission.
     */
    data: XOR<RolePermissionUpdateInput, RolePermissionUncheckedUpdateInput>
    /**
     * Choose, which RolePermission to update.
     */
    where: RolePermissionWhereUniqueInput
  }

  /**
   * RolePermission updateMany
   */
  export type RolePermissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RolePermissions.
     */
    data: XOR<RolePermissionUpdateManyMutationInput, RolePermissionUncheckedUpdateManyInput>
    /**
     * Filter which RolePermissions to update
     */
    where?: RolePermissionWhereInput
    /**
     * Limit how many RolePermissions to update.
     */
    limit?: number
  }

  /**
   * RolePermission updateManyAndReturn
   */
  export type RolePermissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * The data used to update RolePermissions.
     */
    data: XOR<RolePermissionUpdateManyMutationInput, RolePermissionUncheckedUpdateManyInput>
    /**
     * Filter which RolePermissions to update
     */
    where?: RolePermissionWhereInput
    /**
     * Limit how many RolePermissions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RolePermission upsert
   */
  export type RolePermissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * The filter to search for the RolePermission to update in case it exists.
     */
    where: RolePermissionWhereUniqueInput
    /**
     * In case the RolePermission found by the `where` argument doesn't exist, create a new RolePermission with this data.
     */
    create: XOR<RolePermissionCreateInput, RolePermissionUncheckedCreateInput>
    /**
     * In case the RolePermission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RolePermissionUpdateInput, RolePermissionUncheckedUpdateInput>
  }

  /**
   * RolePermission delete
   */
  export type RolePermissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter which RolePermission to delete.
     */
    where: RolePermissionWhereUniqueInput
  }

  /**
   * RolePermission deleteMany
   */
  export type RolePermissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RolePermissions to delete
     */
    where?: RolePermissionWhereInput
    /**
     * Limit how many RolePermissions to delete.
     */
    limit?: number
  }

  /**
   * RolePermission without action
   */
  export type RolePermissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _avg: AuditLogAvgAggregateOutputType | null
    _sum: AuditLogSumAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogAvgAggregateOutputType = {
    id: number | null
  }

  export type AuditLogSumAggregateOutputType = {
    id: number | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    org_uuid: string | null
    user_uuid: string | null
    action: string | null
    resource_type: string | null
    resource_id: string | null
    created_at: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    org_uuid: string | null
    user_uuid: string | null
    action: string | null
    resource_type: string | null
    resource_id: string | null
    created_at: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    uuid: number
    org_uuid: number
    user_uuid: number
    action: number
    resource_type: number
    resource_id: number
    metadata: number
    created_at: number
    _all: number
  }


  export type AuditLogAvgAggregateInputType = {
    id?: true
  }

  export type AuditLogSumAggregateInputType = {
    id?: true
  }

  export type AuditLogMinAggregateInputType = {
    id?: true
    uuid?: true
    org_uuid?: true
    user_uuid?: true
    action?: true
    resource_type?: true
    resource_id?: true
    created_at?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    uuid?: true
    org_uuid?: true
    user_uuid?: true
    action?: true
    resource_type?: true
    resource_id?: true
    created_at?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    uuid?: true
    org_uuid?: true
    user_uuid?: true
    action?: true
    resource_type?: true
    resource_id?: true
    metadata?: true
    created_at?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuditLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuditLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _avg?: AuditLogAvgAggregateInputType
    _sum?: AuditLogSumAggregateInputType
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: number
    uuid: string
    org_uuid: string
    user_uuid: string
    action: string
    resource_type: string
    resource_id: string | null
    metadata: JsonValue
    created_at: Date
    _count: AuditLogCountAggregateOutputType | null
    _avg: AuditLogAvgAggregateOutputType | null
    _sum: AuditLogSumAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    org_uuid?: boolean
    user_uuid?: boolean
    action?: boolean
    resource_type?: boolean
    resource_id?: boolean
    metadata?: boolean
    created_at?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    org_uuid?: boolean
    user_uuid?: boolean
    action?: boolean
    resource_type?: boolean
    resource_id?: boolean
    metadata?: boolean
    created_at?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    org_uuid?: boolean
    user_uuid?: boolean
    action?: boolean
    resource_type?: boolean
    resource_id?: boolean
    metadata?: boolean
    created_at?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    uuid?: boolean
    org_uuid?: boolean
    user_uuid?: boolean
    action?: boolean
    resource_type?: boolean
    resource_id?: boolean
    metadata?: boolean
    created_at?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "org_uuid" | "user_uuid" | "action" | "resource_type" | "resource_id" | "metadata" | "created_at", ExtArgs["result"]["auditLog"]>
  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AuditLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      organization: Prisma.$OrganizationPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      org_uuid: string
      user_uuid: string
      action: string
      resource_type: string
      resource_id: string | null
      metadata: Prisma.JsonValue
      created_at: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
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
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organization<T extends OrganizationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationDefaultArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'Int'>
    readonly uuid: FieldRef<"AuditLog", 'String'>
    readonly org_uuid: FieldRef<"AuditLog", 'String'>
    readonly user_uuid: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly resource_type: FieldRef<"AuditLog", 'String'>
    readonly resource_id: FieldRef<"AuditLog", 'String'>
    readonly metadata: FieldRef<"AuditLog", 'Json'>
    readonly created_at: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
  }


  /**
   * Model Integration
   */

  export type AggregateIntegration = {
    _count: IntegrationCountAggregateOutputType | null
    _avg: IntegrationAvgAggregateOutputType | null
    _sum: IntegrationSumAggregateOutputType | null
    _min: IntegrationMinAggregateOutputType | null
    _max: IntegrationMaxAggregateOutputType | null
  }

  export type IntegrationAvgAggregateOutputType = {
    id: number | null
  }

  export type IntegrationSumAggregateOutputType = {
    id: number | null
  }

  export type IntegrationMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    org_uuid: string | null
    name: string | null
    description: string | null
    provider: $Enums.IntegrationProvider | null
    status: $Enums.IntegrationStatus | null
    config: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type IntegrationMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    org_uuid: string | null
    name: string | null
    description: string | null
    provider: $Enums.IntegrationProvider | null
    status: $Enums.IntegrationStatus | null
    config: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type IntegrationCountAggregateOutputType = {
    id: number
    uuid: number
    org_uuid: number
    name: number
    description: number
    provider: number
    status: number
    config: number
    metadata: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type IntegrationAvgAggregateInputType = {
    id?: true
  }

  export type IntegrationSumAggregateInputType = {
    id?: true
  }

  export type IntegrationMinAggregateInputType = {
    id?: true
    uuid?: true
    org_uuid?: true
    name?: true
    description?: true
    provider?: true
    status?: true
    config?: true
    created_at?: true
    updated_at?: true
  }

  export type IntegrationMaxAggregateInputType = {
    id?: true
    uuid?: true
    org_uuid?: true
    name?: true
    description?: true
    provider?: true
    status?: true
    config?: true
    created_at?: true
    updated_at?: true
  }

  export type IntegrationCountAggregateInputType = {
    id?: true
    uuid?: true
    org_uuid?: true
    name?: true
    description?: true
    provider?: true
    status?: true
    config?: true
    metadata?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type IntegrationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Integration to aggregate.
     */
    where?: IntegrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Integrations to fetch.
     */
    orderBy?: IntegrationOrderByWithRelationInput | IntegrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IntegrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Integrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Integrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Integrations
    **/
    _count?: true | IntegrationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: IntegrationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: IntegrationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IntegrationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IntegrationMaxAggregateInputType
  }

  export type GetIntegrationAggregateType<T extends IntegrationAggregateArgs> = {
        [P in keyof T & keyof AggregateIntegration]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIntegration[P]>
      : GetScalarType<T[P], AggregateIntegration[P]>
  }




  export type IntegrationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IntegrationWhereInput
    orderBy?: IntegrationOrderByWithAggregationInput | IntegrationOrderByWithAggregationInput[]
    by: IntegrationScalarFieldEnum[] | IntegrationScalarFieldEnum
    having?: IntegrationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IntegrationCountAggregateInputType | true
    _avg?: IntegrationAvgAggregateInputType
    _sum?: IntegrationSumAggregateInputType
    _min?: IntegrationMinAggregateInputType
    _max?: IntegrationMaxAggregateInputType
  }

  export type IntegrationGroupByOutputType = {
    id: number
    uuid: string
    org_uuid: string
    name: string
    description: string | null
    provider: $Enums.IntegrationProvider
    status: $Enums.IntegrationStatus
    config: string
    metadata: JsonValue | null
    created_at: Date
    updated_at: Date
    _count: IntegrationCountAggregateOutputType | null
    _avg: IntegrationAvgAggregateOutputType | null
    _sum: IntegrationSumAggregateOutputType | null
    _min: IntegrationMinAggregateOutputType | null
    _max: IntegrationMaxAggregateOutputType | null
  }

  type GetIntegrationGroupByPayload<T extends IntegrationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IntegrationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IntegrationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IntegrationGroupByOutputType[P]>
            : GetScalarType<T[P], IntegrationGroupByOutputType[P]>
        }
      >
    >


  export type IntegrationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    org_uuid?: boolean
    name?: boolean
    description?: boolean
    provider?: boolean
    status?: boolean
    config?: boolean
    metadata?: boolean
    created_at?: boolean
    updated_at?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    actions?: boolean | Integration$actionsArgs<ExtArgs>
    database?: boolean | Integration$databaseArgs<ExtArgs>
    openapi?: boolean | Integration$openapiArgs<ExtArgs>
    mcp?: boolean | Integration$mcpArgs<ExtArgs>
    _count?: boolean | IntegrationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["integration"]>

  export type IntegrationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    org_uuid?: boolean
    name?: boolean
    description?: boolean
    provider?: boolean
    status?: boolean
    config?: boolean
    metadata?: boolean
    created_at?: boolean
    updated_at?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["integration"]>

  export type IntegrationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    org_uuid?: boolean
    name?: boolean
    description?: boolean
    provider?: boolean
    status?: boolean
    config?: boolean
    metadata?: boolean
    created_at?: boolean
    updated_at?: boolean
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["integration"]>

  export type IntegrationSelectScalar = {
    id?: boolean
    uuid?: boolean
    org_uuid?: boolean
    name?: boolean
    description?: boolean
    provider?: boolean
    status?: boolean
    config?: boolean
    metadata?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type IntegrationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "org_uuid" | "name" | "description" | "provider" | "status" | "config" | "metadata" | "created_at" | "updated_at", ExtArgs["result"]["integration"]>
  export type IntegrationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    actions?: boolean | Integration$actionsArgs<ExtArgs>
    database?: boolean | Integration$databaseArgs<ExtArgs>
    openapi?: boolean | Integration$openapiArgs<ExtArgs>
    mcp?: boolean | Integration$mcpArgs<ExtArgs>
    _count?: boolean | IntegrationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type IntegrationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }
  export type IntegrationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }

  export type $IntegrationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Integration"
    objects: {
      organization: Prisma.$OrganizationPayload<ExtArgs>
      actions: Prisma.$IntegrationActionPayload<ExtArgs>[]
      database: Prisma.$DatabaseIntegrationPayload<ExtArgs> | null
      openapi: Prisma.$OpenApiIntegrationPayload<ExtArgs> | null
      mcp: Prisma.$McpIntegrationPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      org_uuid: string
      name: string
      description: string | null
      provider: $Enums.IntegrationProvider
      status: $Enums.IntegrationStatus
      config: string
      metadata: Prisma.JsonValue | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["integration"]>
    composites: {}
  }

  type IntegrationGetPayload<S extends boolean | null | undefined | IntegrationDefaultArgs> = $Result.GetResult<Prisma.$IntegrationPayload, S>

  type IntegrationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IntegrationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: IntegrationCountAggregateInputType | true
    }

  export interface IntegrationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Integration'], meta: { name: 'Integration' } }
    /**
     * Find zero or one Integration that matches the filter.
     * @param {IntegrationFindUniqueArgs} args - Arguments to find a Integration
     * @example
     * // Get one Integration
     * const integration = await prisma.integration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IntegrationFindUniqueArgs>(args: SelectSubset<T, IntegrationFindUniqueArgs<ExtArgs>>): Prisma__IntegrationClient<$Result.GetResult<Prisma.$IntegrationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Integration that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IntegrationFindUniqueOrThrowArgs} args - Arguments to find a Integration
     * @example
     * // Get one Integration
     * const integration = await prisma.integration.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IntegrationFindUniqueOrThrowArgs>(args: SelectSubset<T, IntegrationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IntegrationClient<$Result.GetResult<Prisma.$IntegrationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Integration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationFindFirstArgs} args - Arguments to find a Integration
     * @example
     * // Get one Integration
     * const integration = await prisma.integration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IntegrationFindFirstArgs>(args?: SelectSubset<T, IntegrationFindFirstArgs<ExtArgs>>): Prisma__IntegrationClient<$Result.GetResult<Prisma.$IntegrationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Integration that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationFindFirstOrThrowArgs} args - Arguments to find a Integration
     * @example
     * // Get one Integration
     * const integration = await prisma.integration.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IntegrationFindFirstOrThrowArgs>(args?: SelectSubset<T, IntegrationFindFirstOrThrowArgs<ExtArgs>>): Prisma__IntegrationClient<$Result.GetResult<Prisma.$IntegrationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Integrations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Integrations
     * const integrations = await prisma.integration.findMany()
     * 
     * // Get first 10 Integrations
     * const integrations = await prisma.integration.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const integrationWithIdOnly = await prisma.integration.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IntegrationFindManyArgs>(args?: SelectSubset<T, IntegrationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IntegrationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Integration.
     * @param {IntegrationCreateArgs} args - Arguments to create a Integration.
     * @example
     * // Create one Integration
     * const Integration = await prisma.integration.create({
     *   data: {
     *     // ... data to create a Integration
     *   }
     * })
     * 
     */
    create<T extends IntegrationCreateArgs>(args: SelectSubset<T, IntegrationCreateArgs<ExtArgs>>): Prisma__IntegrationClient<$Result.GetResult<Prisma.$IntegrationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Integrations.
     * @param {IntegrationCreateManyArgs} args - Arguments to create many Integrations.
     * @example
     * // Create many Integrations
     * const integration = await prisma.integration.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IntegrationCreateManyArgs>(args?: SelectSubset<T, IntegrationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Integrations and returns the data saved in the database.
     * @param {IntegrationCreateManyAndReturnArgs} args - Arguments to create many Integrations.
     * @example
     * // Create many Integrations
     * const integration = await prisma.integration.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Integrations and only return the `id`
     * const integrationWithIdOnly = await prisma.integration.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IntegrationCreateManyAndReturnArgs>(args?: SelectSubset<T, IntegrationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IntegrationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Integration.
     * @param {IntegrationDeleteArgs} args - Arguments to delete one Integration.
     * @example
     * // Delete one Integration
     * const Integration = await prisma.integration.delete({
     *   where: {
     *     // ... filter to delete one Integration
     *   }
     * })
     * 
     */
    delete<T extends IntegrationDeleteArgs>(args: SelectSubset<T, IntegrationDeleteArgs<ExtArgs>>): Prisma__IntegrationClient<$Result.GetResult<Prisma.$IntegrationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Integration.
     * @param {IntegrationUpdateArgs} args - Arguments to update one Integration.
     * @example
     * // Update one Integration
     * const integration = await prisma.integration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IntegrationUpdateArgs>(args: SelectSubset<T, IntegrationUpdateArgs<ExtArgs>>): Prisma__IntegrationClient<$Result.GetResult<Prisma.$IntegrationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Integrations.
     * @param {IntegrationDeleteManyArgs} args - Arguments to filter Integrations to delete.
     * @example
     * // Delete a few Integrations
     * const { count } = await prisma.integration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IntegrationDeleteManyArgs>(args?: SelectSubset<T, IntegrationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Integrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Integrations
     * const integration = await prisma.integration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IntegrationUpdateManyArgs>(args: SelectSubset<T, IntegrationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Integrations and returns the data updated in the database.
     * @param {IntegrationUpdateManyAndReturnArgs} args - Arguments to update many Integrations.
     * @example
     * // Update many Integrations
     * const integration = await prisma.integration.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Integrations and only return the `id`
     * const integrationWithIdOnly = await prisma.integration.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends IntegrationUpdateManyAndReturnArgs>(args: SelectSubset<T, IntegrationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IntegrationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Integration.
     * @param {IntegrationUpsertArgs} args - Arguments to update or create a Integration.
     * @example
     * // Update or create a Integration
     * const integration = await prisma.integration.upsert({
     *   create: {
     *     // ... data to create a Integration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Integration we want to update
     *   }
     * })
     */
    upsert<T extends IntegrationUpsertArgs>(args: SelectSubset<T, IntegrationUpsertArgs<ExtArgs>>): Prisma__IntegrationClient<$Result.GetResult<Prisma.$IntegrationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Integrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationCountArgs} args - Arguments to filter Integrations to count.
     * @example
     * // Count the number of Integrations
     * const count = await prisma.integration.count({
     *   where: {
     *     // ... the filter for the Integrations we want to count
     *   }
     * })
    **/
    count<T extends IntegrationCountArgs>(
      args?: Subset<T, IntegrationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IntegrationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Integration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends IntegrationAggregateArgs>(args: Subset<T, IntegrationAggregateArgs>): Prisma.PrismaPromise<GetIntegrationAggregateType<T>>

    /**
     * Group by Integration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationGroupByArgs} args - Group by arguments.
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
      T extends IntegrationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IntegrationGroupByArgs['orderBy'] }
        : { orderBy?: IntegrationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, IntegrationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIntegrationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Integration model
   */
  readonly fields: IntegrationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Integration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IntegrationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organization<T extends OrganizationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationDefaultArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    actions<T extends Integration$actionsArgs<ExtArgs> = {}>(args?: Subset<T, Integration$actionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IntegrationActionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    database<T extends Integration$databaseArgs<ExtArgs> = {}>(args?: Subset<T, Integration$databaseArgs<ExtArgs>>): Prisma__DatabaseIntegrationClient<$Result.GetResult<Prisma.$DatabaseIntegrationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    openapi<T extends Integration$openapiArgs<ExtArgs> = {}>(args?: Subset<T, Integration$openapiArgs<ExtArgs>>): Prisma__OpenApiIntegrationClient<$Result.GetResult<Prisma.$OpenApiIntegrationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    mcp<T extends Integration$mcpArgs<ExtArgs> = {}>(args?: Subset<T, Integration$mcpArgs<ExtArgs>>): Prisma__McpIntegrationClient<$Result.GetResult<Prisma.$McpIntegrationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Integration model
   */
  interface IntegrationFieldRefs {
    readonly id: FieldRef<"Integration", 'Int'>
    readonly uuid: FieldRef<"Integration", 'String'>
    readonly org_uuid: FieldRef<"Integration", 'String'>
    readonly name: FieldRef<"Integration", 'String'>
    readonly description: FieldRef<"Integration", 'String'>
    readonly provider: FieldRef<"Integration", 'IntegrationProvider'>
    readonly status: FieldRef<"Integration", 'IntegrationStatus'>
    readonly config: FieldRef<"Integration", 'String'>
    readonly metadata: FieldRef<"Integration", 'Json'>
    readonly created_at: FieldRef<"Integration", 'DateTime'>
    readonly updated_at: FieldRef<"Integration", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Integration findUnique
   */
  export type IntegrationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Integration
     */
    select?: IntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Integration
     */
    omit?: IntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationInclude<ExtArgs> | null
    /**
     * Filter, which Integration to fetch.
     */
    where: IntegrationWhereUniqueInput
  }

  /**
   * Integration findUniqueOrThrow
   */
  export type IntegrationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Integration
     */
    select?: IntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Integration
     */
    omit?: IntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationInclude<ExtArgs> | null
    /**
     * Filter, which Integration to fetch.
     */
    where: IntegrationWhereUniqueInput
  }

  /**
   * Integration findFirst
   */
  export type IntegrationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Integration
     */
    select?: IntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Integration
     */
    omit?: IntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationInclude<ExtArgs> | null
    /**
     * Filter, which Integration to fetch.
     */
    where?: IntegrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Integrations to fetch.
     */
    orderBy?: IntegrationOrderByWithRelationInput | IntegrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Integrations.
     */
    cursor?: IntegrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Integrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Integrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Integrations.
     */
    distinct?: IntegrationScalarFieldEnum | IntegrationScalarFieldEnum[]
  }

  /**
   * Integration findFirstOrThrow
   */
  export type IntegrationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Integration
     */
    select?: IntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Integration
     */
    omit?: IntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationInclude<ExtArgs> | null
    /**
     * Filter, which Integration to fetch.
     */
    where?: IntegrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Integrations to fetch.
     */
    orderBy?: IntegrationOrderByWithRelationInput | IntegrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Integrations.
     */
    cursor?: IntegrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Integrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Integrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Integrations.
     */
    distinct?: IntegrationScalarFieldEnum | IntegrationScalarFieldEnum[]
  }

  /**
   * Integration findMany
   */
  export type IntegrationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Integration
     */
    select?: IntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Integration
     */
    omit?: IntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationInclude<ExtArgs> | null
    /**
     * Filter, which Integrations to fetch.
     */
    where?: IntegrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Integrations to fetch.
     */
    orderBy?: IntegrationOrderByWithRelationInput | IntegrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Integrations.
     */
    cursor?: IntegrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Integrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Integrations.
     */
    skip?: number
    distinct?: IntegrationScalarFieldEnum | IntegrationScalarFieldEnum[]
  }

  /**
   * Integration create
   */
  export type IntegrationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Integration
     */
    select?: IntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Integration
     */
    omit?: IntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationInclude<ExtArgs> | null
    /**
     * The data needed to create a Integration.
     */
    data: XOR<IntegrationCreateInput, IntegrationUncheckedCreateInput>
  }

  /**
   * Integration createMany
   */
  export type IntegrationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Integrations.
     */
    data: IntegrationCreateManyInput | IntegrationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Integration createManyAndReturn
   */
  export type IntegrationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Integration
     */
    select?: IntegrationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Integration
     */
    omit?: IntegrationOmit<ExtArgs> | null
    /**
     * The data used to create many Integrations.
     */
    data: IntegrationCreateManyInput | IntegrationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Integration update
   */
  export type IntegrationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Integration
     */
    select?: IntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Integration
     */
    omit?: IntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationInclude<ExtArgs> | null
    /**
     * The data needed to update a Integration.
     */
    data: XOR<IntegrationUpdateInput, IntegrationUncheckedUpdateInput>
    /**
     * Choose, which Integration to update.
     */
    where: IntegrationWhereUniqueInput
  }

  /**
   * Integration updateMany
   */
  export type IntegrationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Integrations.
     */
    data: XOR<IntegrationUpdateManyMutationInput, IntegrationUncheckedUpdateManyInput>
    /**
     * Filter which Integrations to update
     */
    where?: IntegrationWhereInput
    /**
     * Limit how many Integrations to update.
     */
    limit?: number
  }

  /**
   * Integration updateManyAndReturn
   */
  export type IntegrationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Integration
     */
    select?: IntegrationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Integration
     */
    omit?: IntegrationOmit<ExtArgs> | null
    /**
     * The data used to update Integrations.
     */
    data: XOR<IntegrationUpdateManyMutationInput, IntegrationUncheckedUpdateManyInput>
    /**
     * Filter which Integrations to update
     */
    where?: IntegrationWhereInput
    /**
     * Limit how many Integrations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Integration upsert
   */
  export type IntegrationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Integration
     */
    select?: IntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Integration
     */
    omit?: IntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationInclude<ExtArgs> | null
    /**
     * The filter to search for the Integration to update in case it exists.
     */
    where: IntegrationWhereUniqueInput
    /**
     * In case the Integration found by the `where` argument doesn't exist, create a new Integration with this data.
     */
    create: XOR<IntegrationCreateInput, IntegrationUncheckedCreateInput>
    /**
     * In case the Integration was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IntegrationUpdateInput, IntegrationUncheckedUpdateInput>
  }

  /**
   * Integration delete
   */
  export type IntegrationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Integration
     */
    select?: IntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Integration
     */
    omit?: IntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationInclude<ExtArgs> | null
    /**
     * Filter which Integration to delete.
     */
    where: IntegrationWhereUniqueInput
  }

  /**
   * Integration deleteMany
   */
  export type IntegrationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Integrations to delete
     */
    where?: IntegrationWhereInput
    /**
     * Limit how many Integrations to delete.
     */
    limit?: number
  }

  /**
   * Integration.actions
   */
  export type Integration$actionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationAction
     */
    select?: IntegrationActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationAction
     */
    omit?: IntegrationActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationActionInclude<ExtArgs> | null
    where?: IntegrationActionWhereInput
    orderBy?: IntegrationActionOrderByWithRelationInput | IntegrationActionOrderByWithRelationInput[]
    cursor?: IntegrationActionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: IntegrationActionScalarFieldEnum | IntegrationActionScalarFieldEnum[]
  }

  /**
   * Integration.database
   */
  export type Integration$databaseArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatabaseIntegration
     */
    select?: DatabaseIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DatabaseIntegration
     */
    omit?: DatabaseIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatabaseIntegrationInclude<ExtArgs> | null
    where?: DatabaseIntegrationWhereInput
  }

  /**
   * Integration.openapi
   */
  export type Integration$openapiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenApiIntegration
     */
    select?: OpenApiIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenApiIntegration
     */
    omit?: OpenApiIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenApiIntegrationInclude<ExtArgs> | null
    where?: OpenApiIntegrationWhereInput
  }

  /**
   * Integration.mcp
   */
  export type Integration$mcpArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpIntegration
     */
    select?: McpIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpIntegration
     */
    omit?: McpIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpIntegrationInclude<ExtArgs> | null
    where?: McpIntegrationWhereInput
  }

  /**
   * Integration without action
   */
  export type IntegrationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Integration
     */
    select?: IntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Integration
     */
    omit?: IntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationInclude<ExtArgs> | null
  }


  /**
   * Model DatabaseIntegration
   */

  export type AggregateDatabaseIntegration = {
    _count: DatabaseIntegrationCountAggregateOutputType | null
    _avg: DatabaseIntegrationAvgAggregateOutputType | null
    _sum: DatabaseIntegrationSumAggregateOutputType | null
    _min: DatabaseIntegrationMinAggregateOutputType | null
    _max: DatabaseIntegrationMaxAggregateOutputType | null
  }

  export type DatabaseIntegrationAvgAggregateOutputType = {
    id: number | null
  }

  export type DatabaseIntegrationSumAggregateOutputType = {
    id: number | null
  }

  export type DatabaseIntegrationMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    integration_uuid: string | null
    db_type: $Enums.DatabaseType | null
    connection_string: string | null
    last_schema_sync: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type DatabaseIntegrationMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    integration_uuid: string | null
    db_type: $Enums.DatabaseType | null
    connection_string: string | null
    last_schema_sync: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type DatabaseIntegrationCountAggregateOutputType = {
    id: number
    uuid: number
    integration_uuid: number
    db_type: number
    connection_string: number
    schema_cache: number
    allowed_ops: number
    last_schema_sync: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type DatabaseIntegrationAvgAggregateInputType = {
    id?: true
  }

  export type DatabaseIntegrationSumAggregateInputType = {
    id?: true
  }

  export type DatabaseIntegrationMinAggregateInputType = {
    id?: true
    uuid?: true
    integration_uuid?: true
    db_type?: true
    connection_string?: true
    last_schema_sync?: true
    created_at?: true
    updated_at?: true
  }

  export type DatabaseIntegrationMaxAggregateInputType = {
    id?: true
    uuid?: true
    integration_uuid?: true
    db_type?: true
    connection_string?: true
    last_schema_sync?: true
    created_at?: true
    updated_at?: true
  }

  export type DatabaseIntegrationCountAggregateInputType = {
    id?: true
    uuid?: true
    integration_uuid?: true
    db_type?: true
    connection_string?: true
    schema_cache?: true
    allowed_ops?: true
    last_schema_sync?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type DatabaseIntegrationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DatabaseIntegration to aggregate.
     */
    where?: DatabaseIntegrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DatabaseIntegrations to fetch.
     */
    orderBy?: DatabaseIntegrationOrderByWithRelationInput | DatabaseIntegrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DatabaseIntegrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DatabaseIntegrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DatabaseIntegrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DatabaseIntegrations
    **/
    _count?: true | DatabaseIntegrationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DatabaseIntegrationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DatabaseIntegrationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DatabaseIntegrationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DatabaseIntegrationMaxAggregateInputType
  }

  export type GetDatabaseIntegrationAggregateType<T extends DatabaseIntegrationAggregateArgs> = {
        [P in keyof T & keyof AggregateDatabaseIntegration]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDatabaseIntegration[P]>
      : GetScalarType<T[P], AggregateDatabaseIntegration[P]>
  }




  export type DatabaseIntegrationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DatabaseIntegrationWhereInput
    orderBy?: DatabaseIntegrationOrderByWithAggregationInput | DatabaseIntegrationOrderByWithAggregationInput[]
    by: DatabaseIntegrationScalarFieldEnum[] | DatabaseIntegrationScalarFieldEnum
    having?: DatabaseIntegrationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DatabaseIntegrationCountAggregateInputType | true
    _avg?: DatabaseIntegrationAvgAggregateInputType
    _sum?: DatabaseIntegrationSumAggregateInputType
    _min?: DatabaseIntegrationMinAggregateInputType
    _max?: DatabaseIntegrationMaxAggregateInputType
  }

  export type DatabaseIntegrationGroupByOutputType = {
    id: number
    uuid: string
    integration_uuid: string
    db_type: $Enums.DatabaseType
    connection_string: string
    schema_cache: JsonValue | null
    allowed_ops: $Enums.DatabaseOperation[]
    last_schema_sync: Date | null
    created_at: Date
    updated_at: Date
    _count: DatabaseIntegrationCountAggregateOutputType | null
    _avg: DatabaseIntegrationAvgAggregateOutputType | null
    _sum: DatabaseIntegrationSumAggregateOutputType | null
    _min: DatabaseIntegrationMinAggregateOutputType | null
    _max: DatabaseIntegrationMaxAggregateOutputType | null
  }

  type GetDatabaseIntegrationGroupByPayload<T extends DatabaseIntegrationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DatabaseIntegrationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DatabaseIntegrationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DatabaseIntegrationGroupByOutputType[P]>
            : GetScalarType<T[P], DatabaseIntegrationGroupByOutputType[P]>
        }
      >
    >


  export type DatabaseIntegrationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    integration_uuid?: boolean
    db_type?: boolean
    connection_string?: boolean
    schema_cache?: boolean
    allowed_ops?: boolean
    last_schema_sync?: boolean
    created_at?: boolean
    updated_at?: boolean
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["databaseIntegration"]>

  export type DatabaseIntegrationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    integration_uuid?: boolean
    db_type?: boolean
    connection_string?: boolean
    schema_cache?: boolean
    allowed_ops?: boolean
    last_schema_sync?: boolean
    created_at?: boolean
    updated_at?: boolean
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["databaseIntegration"]>

  export type DatabaseIntegrationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    integration_uuid?: boolean
    db_type?: boolean
    connection_string?: boolean
    schema_cache?: boolean
    allowed_ops?: boolean
    last_schema_sync?: boolean
    created_at?: boolean
    updated_at?: boolean
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["databaseIntegration"]>

  export type DatabaseIntegrationSelectScalar = {
    id?: boolean
    uuid?: boolean
    integration_uuid?: boolean
    db_type?: boolean
    connection_string?: boolean
    schema_cache?: boolean
    allowed_ops?: boolean
    last_schema_sync?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type DatabaseIntegrationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "integration_uuid" | "db_type" | "connection_string" | "schema_cache" | "allowed_ops" | "last_schema_sync" | "created_at" | "updated_at", ExtArgs["result"]["databaseIntegration"]>
  export type DatabaseIntegrationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }
  export type DatabaseIntegrationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }
  export type DatabaseIntegrationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }

  export type $DatabaseIntegrationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DatabaseIntegration"
    objects: {
      integration: Prisma.$IntegrationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      integration_uuid: string
      db_type: $Enums.DatabaseType
      connection_string: string
      schema_cache: Prisma.JsonValue | null
      allowed_ops: $Enums.DatabaseOperation[]
      last_schema_sync: Date | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["databaseIntegration"]>
    composites: {}
  }

  type DatabaseIntegrationGetPayload<S extends boolean | null | undefined | DatabaseIntegrationDefaultArgs> = $Result.GetResult<Prisma.$DatabaseIntegrationPayload, S>

  type DatabaseIntegrationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DatabaseIntegrationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DatabaseIntegrationCountAggregateInputType | true
    }

  export interface DatabaseIntegrationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DatabaseIntegration'], meta: { name: 'DatabaseIntegration' } }
    /**
     * Find zero or one DatabaseIntegration that matches the filter.
     * @param {DatabaseIntegrationFindUniqueArgs} args - Arguments to find a DatabaseIntegration
     * @example
     * // Get one DatabaseIntegration
     * const databaseIntegration = await prisma.databaseIntegration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DatabaseIntegrationFindUniqueArgs>(args: SelectSubset<T, DatabaseIntegrationFindUniqueArgs<ExtArgs>>): Prisma__DatabaseIntegrationClient<$Result.GetResult<Prisma.$DatabaseIntegrationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DatabaseIntegration that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DatabaseIntegrationFindUniqueOrThrowArgs} args - Arguments to find a DatabaseIntegration
     * @example
     * // Get one DatabaseIntegration
     * const databaseIntegration = await prisma.databaseIntegration.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DatabaseIntegrationFindUniqueOrThrowArgs>(args: SelectSubset<T, DatabaseIntegrationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DatabaseIntegrationClient<$Result.GetResult<Prisma.$DatabaseIntegrationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DatabaseIntegration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DatabaseIntegrationFindFirstArgs} args - Arguments to find a DatabaseIntegration
     * @example
     * // Get one DatabaseIntegration
     * const databaseIntegration = await prisma.databaseIntegration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DatabaseIntegrationFindFirstArgs>(args?: SelectSubset<T, DatabaseIntegrationFindFirstArgs<ExtArgs>>): Prisma__DatabaseIntegrationClient<$Result.GetResult<Prisma.$DatabaseIntegrationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DatabaseIntegration that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DatabaseIntegrationFindFirstOrThrowArgs} args - Arguments to find a DatabaseIntegration
     * @example
     * // Get one DatabaseIntegration
     * const databaseIntegration = await prisma.databaseIntegration.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DatabaseIntegrationFindFirstOrThrowArgs>(args?: SelectSubset<T, DatabaseIntegrationFindFirstOrThrowArgs<ExtArgs>>): Prisma__DatabaseIntegrationClient<$Result.GetResult<Prisma.$DatabaseIntegrationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DatabaseIntegrations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DatabaseIntegrationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DatabaseIntegrations
     * const databaseIntegrations = await prisma.databaseIntegration.findMany()
     * 
     * // Get first 10 DatabaseIntegrations
     * const databaseIntegrations = await prisma.databaseIntegration.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const databaseIntegrationWithIdOnly = await prisma.databaseIntegration.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DatabaseIntegrationFindManyArgs>(args?: SelectSubset<T, DatabaseIntegrationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DatabaseIntegrationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DatabaseIntegration.
     * @param {DatabaseIntegrationCreateArgs} args - Arguments to create a DatabaseIntegration.
     * @example
     * // Create one DatabaseIntegration
     * const DatabaseIntegration = await prisma.databaseIntegration.create({
     *   data: {
     *     // ... data to create a DatabaseIntegration
     *   }
     * })
     * 
     */
    create<T extends DatabaseIntegrationCreateArgs>(args: SelectSubset<T, DatabaseIntegrationCreateArgs<ExtArgs>>): Prisma__DatabaseIntegrationClient<$Result.GetResult<Prisma.$DatabaseIntegrationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DatabaseIntegrations.
     * @param {DatabaseIntegrationCreateManyArgs} args - Arguments to create many DatabaseIntegrations.
     * @example
     * // Create many DatabaseIntegrations
     * const databaseIntegration = await prisma.databaseIntegration.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DatabaseIntegrationCreateManyArgs>(args?: SelectSubset<T, DatabaseIntegrationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DatabaseIntegrations and returns the data saved in the database.
     * @param {DatabaseIntegrationCreateManyAndReturnArgs} args - Arguments to create many DatabaseIntegrations.
     * @example
     * // Create many DatabaseIntegrations
     * const databaseIntegration = await prisma.databaseIntegration.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DatabaseIntegrations and only return the `id`
     * const databaseIntegrationWithIdOnly = await prisma.databaseIntegration.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DatabaseIntegrationCreateManyAndReturnArgs>(args?: SelectSubset<T, DatabaseIntegrationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DatabaseIntegrationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DatabaseIntegration.
     * @param {DatabaseIntegrationDeleteArgs} args - Arguments to delete one DatabaseIntegration.
     * @example
     * // Delete one DatabaseIntegration
     * const DatabaseIntegration = await prisma.databaseIntegration.delete({
     *   where: {
     *     // ... filter to delete one DatabaseIntegration
     *   }
     * })
     * 
     */
    delete<T extends DatabaseIntegrationDeleteArgs>(args: SelectSubset<T, DatabaseIntegrationDeleteArgs<ExtArgs>>): Prisma__DatabaseIntegrationClient<$Result.GetResult<Prisma.$DatabaseIntegrationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DatabaseIntegration.
     * @param {DatabaseIntegrationUpdateArgs} args - Arguments to update one DatabaseIntegration.
     * @example
     * // Update one DatabaseIntegration
     * const databaseIntegration = await prisma.databaseIntegration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DatabaseIntegrationUpdateArgs>(args: SelectSubset<T, DatabaseIntegrationUpdateArgs<ExtArgs>>): Prisma__DatabaseIntegrationClient<$Result.GetResult<Prisma.$DatabaseIntegrationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DatabaseIntegrations.
     * @param {DatabaseIntegrationDeleteManyArgs} args - Arguments to filter DatabaseIntegrations to delete.
     * @example
     * // Delete a few DatabaseIntegrations
     * const { count } = await prisma.databaseIntegration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DatabaseIntegrationDeleteManyArgs>(args?: SelectSubset<T, DatabaseIntegrationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DatabaseIntegrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DatabaseIntegrationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DatabaseIntegrations
     * const databaseIntegration = await prisma.databaseIntegration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DatabaseIntegrationUpdateManyArgs>(args: SelectSubset<T, DatabaseIntegrationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DatabaseIntegrations and returns the data updated in the database.
     * @param {DatabaseIntegrationUpdateManyAndReturnArgs} args - Arguments to update many DatabaseIntegrations.
     * @example
     * // Update many DatabaseIntegrations
     * const databaseIntegration = await prisma.databaseIntegration.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DatabaseIntegrations and only return the `id`
     * const databaseIntegrationWithIdOnly = await prisma.databaseIntegration.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DatabaseIntegrationUpdateManyAndReturnArgs>(args: SelectSubset<T, DatabaseIntegrationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DatabaseIntegrationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DatabaseIntegration.
     * @param {DatabaseIntegrationUpsertArgs} args - Arguments to update or create a DatabaseIntegration.
     * @example
     * // Update or create a DatabaseIntegration
     * const databaseIntegration = await prisma.databaseIntegration.upsert({
     *   create: {
     *     // ... data to create a DatabaseIntegration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DatabaseIntegration we want to update
     *   }
     * })
     */
    upsert<T extends DatabaseIntegrationUpsertArgs>(args: SelectSubset<T, DatabaseIntegrationUpsertArgs<ExtArgs>>): Prisma__DatabaseIntegrationClient<$Result.GetResult<Prisma.$DatabaseIntegrationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DatabaseIntegrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DatabaseIntegrationCountArgs} args - Arguments to filter DatabaseIntegrations to count.
     * @example
     * // Count the number of DatabaseIntegrations
     * const count = await prisma.databaseIntegration.count({
     *   where: {
     *     // ... the filter for the DatabaseIntegrations we want to count
     *   }
     * })
    **/
    count<T extends DatabaseIntegrationCountArgs>(
      args?: Subset<T, DatabaseIntegrationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DatabaseIntegrationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DatabaseIntegration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DatabaseIntegrationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DatabaseIntegrationAggregateArgs>(args: Subset<T, DatabaseIntegrationAggregateArgs>): Prisma.PrismaPromise<GetDatabaseIntegrationAggregateType<T>>

    /**
     * Group by DatabaseIntegration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DatabaseIntegrationGroupByArgs} args - Group by arguments.
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
      T extends DatabaseIntegrationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DatabaseIntegrationGroupByArgs['orderBy'] }
        : { orderBy?: DatabaseIntegrationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DatabaseIntegrationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDatabaseIntegrationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DatabaseIntegration model
   */
  readonly fields: DatabaseIntegrationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DatabaseIntegration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DatabaseIntegrationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    integration<T extends IntegrationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, IntegrationDefaultArgs<ExtArgs>>): Prisma__IntegrationClient<$Result.GetResult<Prisma.$IntegrationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the DatabaseIntegration model
   */
  interface DatabaseIntegrationFieldRefs {
    readonly id: FieldRef<"DatabaseIntegration", 'Int'>
    readonly uuid: FieldRef<"DatabaseIntegration", 'String'>
    readonly integration_uuid: FieldRef<"DatabaseIntegration", 'String'>
    readonly db_type: FieldRef<"DatabaseIntegration", 'DatabaseType'>
    readonly connection_string: FieldRef<"DatabaseIntegration", 'String'>
    readonly schema_cache: FieldRef<"DatabaseIntegration", 'Json'>
    readonly allowed_ops: FieldRef<"DatabaseIntegration", 'DatabaseOperation[]'>
    readonly last_schema_sync: FieldRef<"DatabaseIntegration", 'DateTime'>
    readonly created_at: FieldRef<"DatabaseIntegration", 'DateTime'>
    readonly updated_at: FieldRef<"DatabaseIntegration", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DatabaseIntegration findUnique
   */
  export type DatabaseIntegrationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatabaseIntegration
     */
    select?: DatabaseIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DatabaseIntegration
     */
    omit?: DatabaseIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatabaseIntegrationInclude<ExtArgs> | null
    /**
     * Filter, which DatabaseIntegration to fetch.
     */
    where: DatabaseIntegrationWhereUniqueInput
  }

  /**
   * DatabaseIntegration findUniqueOrThrow
   */
  export type DatabaseIntegrationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatabaseIntegration
     */
    select?: DatabaseIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DatabaseIntegration
     */
    omit?: DatabaseIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatabaseIntegrationInclude<ExtArgs> | null
    /**
     * Filter, which DatabaseIntegration to fetch.
     */
    where: DatabaseIntegrationWhereUniqueInput
  }

  /**
   * DatabaseIntegration findFirst
   */
  export type DatabaseIntegrationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatabaseIntegration
     */
    select?: DatabaseIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DatabaseIntegration
     */
    omit?: DatabaseIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatabaseIntegrationInclude<ExtArgs> | null
    /**
     * Filter, which DatabaseIntegration to fetch.
     */
    where?: DatabaseIntegrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DatabaseIntegrations to fetch.
     */
    orderBy?: DatabaseIntegrationOrderByWithRelationInput | DatabaseIntegrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DatabaseIntegrations.
     */
    cursor?: DatabaseIntegrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DatabaseIntegrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DatabaseIntegrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DatabaseIntegrations.
     */
    distinct?: DatabaseIntegrationScalarFieldEnum | DatabaseIntegrationScalarFieldEnum[]
  }

  /**
   * DatabaseIntegration findFirstOrThrow
   */
  export type DatabaseIntegrationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatabaseIntegration
     */
    select?: DatabaseIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DatabaseIntegration
     */
    omit?: DatabaseIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatabaseIntegrationInclude<ExtArgs> | null
    /**
     * Filter, which DatabaseIntegration to fetch.
     */
    where?: DatabaseIntegrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DatabaseIntegrations to fetch.
     */
    orderBy?: DatabaseIntegrationOrderByWithRelationInput | DatabaseIntegrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DatabaseIntegrations.
     */
    cursor?: DatabaseIntegrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DatabaseIntegrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DatabaseIntegrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DatabaseIntegrations.
     */
    distinct?: DatabaseIntegrationScalarFieldEnum | DatabaseIntegrationScalarFieldEnum[]
  }

  /**
   * DatabaseIntegration findMany
   */
  export type DatabaseIntegrationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatabaseIntegration
     */
    select?: DatabaseIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DatabaseIntegration
     */
    omit?: DatabaseIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatabaseIntegrationInclude<ExtArgs> | null
    /**
     * Filter, which DatabaseIntegrations to fetch.
     */
    where?: DatabaseIntegrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DatabaseIntegrations to fetch.
     */
    orderBy?: DatabaseIntegrationOrderByWithRelationInput | DatabaseIntegrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DatabaseIntegrations.
     */
    cursor?: DatabaseIntegrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DatabaseIntegrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DatabaseIntegrations.
     */
    skip?: number
    distinct?: DatabaseIntegrationScalarFieldEnum | DatabaseIntegrationScalarFieldEnum[]
  }

  /**
   * DatabaseIntegration create
   */
  export type DatabaseIntegrationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatabaseIntegration
     */
    select?: DatabaseIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DatabaseIntegration
     */
    omit?: DatabaseIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatabaseIntegrationInclude<ExtArgs> | null
    /**
     * The data needed to create a DatabaseIntegration.
     */
    data: XOR<DatabaseIntegrationCreateInput, DatabaseIntegrationUncheckedCreateInput>
  }

  /**
   * DatabaseIntegration createMany
   */
  export type DatabaseIntegrationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DatabaseIntegrations.
     */
    data: DatabaseIntegrationCreateManyInput | DatabaseIntegrationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DatabaseIntegration createManyAndReturn
   */
  export type DatabaseIntegrationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatabaseIntegration
     */
    select?: DatabaseIntegrationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DatabaseIntegration
     */
    omit?: DatabaseIntegrationOmit<ExtArgs> | null
    /**
     * The data used to create many DatabaseIntegrations.
     */
    data: DatabaseIntegrationCreateManyInput | DatabaseIntegrationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatabaseIntegrationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DatabaseIntegration update
   */
  export type DatabaseIntegrationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatabaseIntegration
     */
    select?: DatabaseIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DatabaseIntegration
     */
    omit?: DatabaseIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatabaseIntegrationInclude<ExtArgs> | null
    /**
     * The data needed to update a DatabaseIntegration.
     */
    data: XOR<DatabaseIntegrationUpdateInput, DatabaseIntegrationUncheckedUpdateInput>
    /**
     * Choose, which DatabaseIntegration to update.
     */
    where: DatabaseIntegrationWhereUniqueInput
  }

  /**
   * DatabaseIntegration updateMany
   */
  export type DatabaseIntegrationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DatabaseIntegrations.
     */
    data: XOR<DatabaseIntegrationUpdateManyMutationInput, DatabaseIntegrationUncheckedUpdateManyInput>
    /**
     * Filter which DatabaseIntegrations to update
     */
    where?: DatabaseIntegrationWhereInput
    /**
     * Limit how many DatabaseIntegrations to update.
     */
    limit?: number
  }

  /**
   * DatabaseIntegration updateManyAndReturn
   */
  export type DatabaseIntegrationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatabaseIntegration
     */
    select?: DatabaseIntegrationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DatabaseIntegration
     */
    omit?: DatabaseIntegrationOmit<ExtArgs> | null
    /**
     * The data used to update DatabaseIntegrations.
     */
    data: XOR<DatabaseIntegrationUpdateManyMutationInput, DatabaseIntegrationUncheckedUpdateManyInput>
    /**
     * Filter which DatabaseIntegrations to update
     */
    where?: DatabaseIntegrationWhereInput
    /**
     * Limit how many DatabaseIntegrations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatabaseIntegrationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DatabaseIntegration upsert
   */
  export type DatabaseIntegrationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatabaseIntegration
     */
    select?: DatabaseIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DatabaseIntegration
     */
    omit?: DatabaseIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatabaseIntegrationInclude<ExtArgs> | null
    /**
     * The filter to search for the DatabaseIntegration to update in case it exists.
     */
    where: DatabaseIntegrationWhereUniqueInput
    /**
     * In case the DatabaseIntegration found by the `where` argument doesn't exist, create a new DatabaseIntegration with this data.
     */
    create: XOR<DatabaseIntegrationCreateInput, DatabaseIntegrationUncheckedCreateInput>
    /**
     * In case the DatabaseIntegration was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DatabaseIntegrationUpdateInput, DatabaseIntegrationUncheckedUpdateInput>
  }

  /**
   * DatabaseIntegration delete
   */
  export type DatabaseIntegrationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatabaseIntegration
     */
    select?: DatabaseIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DatabaseIntegration
     */
    omit?: DatabaseIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatabaseIntegrationInclude<ExtArgs> | null
    /**
     * Filter which DatabaseIntegration to delete.
     */
    where: DatabaseIntegrationWhereUniqueInput
  }

  /**
   * DatabaseIntegration deleteMany
   */
  export type DatabaseIntegrationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DatabaseIntegrations to delete
     */
    where?: DatabaseIntegrationWhereInput
    /**
     * Limit how many DatabaseIntegrations to delete.
     */
    limit?: number
  }

  /**
   * DatabaseIntegration without action
   */
  export type DatabaseIntegrationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatabaseIntegration
     */
    select?: DatabaseIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DatabaseIntegration
     */
    omit?: DatabaseIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DatabaseIntegrationInclude<ExtArgs> | null
  }


  /**
   * Model OpenApiIntegration
   */

  export type AggregateOpenApiIntegration = {
    _count: OpenApiIntegrationCountAggregateOutputType | null
    _avg: OpenApiIntegrationAvgAggregateOutputType | null
    _sum: OpenApiIntegrationSumAggregateOutputType | null
    _min: OpenApiIntegrationMinAggregateOutputType | null
    _max: OpenApiIntegrationMaxAggregateOutputType | null
  }

  export type OpenApiIntegrationAvgAggregateOutputType = {
    id: number | null
  }

  export type OpenApiIntegrationSumAggregateOutputType = {
    id: number | null
  }

  export type OpenApiIntegrationMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    integration_uuid: string | null
    spec_url: string | null
    base_url: string | null
    auth_type: $Enums.OpenApiAuthType | null
    auth_config: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type OpenApiIntegrationMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    integration_uuid: string | null
    spec_url: string | null
    base_url: string | null
    auth_type: $Enums.OpenApiAuthType | null
    auth_config: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type OpenApiIntegrationCountAggregateOutputType = {
    id: number
    uuid: number
    integration_uuid: number
    spec_url: number
    spec_json: number
    base_url: number
    auth_type: number
    auth_config: number
    generated_tools: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type OpenApiIntegrationAvgAggregateInputType = {
    id?: true
  }

  export type OpenApiIntegrationSumAggregateInputType = {
    id?: true
  }

  export type OpenApiIntegrationMinAggregateInputType = {
    id?: true
    uuid?: true
    integration_uuid?: true
    spec_url?: true
    base_url?: true
    auth_type?: true
    auth_config?: true
    created_at?: true
    updated_at?: true
  }

  export type OpenApiIntegrationMaxAggregateInputType = {
    id?: true
    uuid?: true
    integration_uuid?: true
    spec_url?: true
    base_url?: true
    auth_type?: true
    auth_config?: true
    created_at?: true
    updated_at?: true
  }

  export type OpenApiIntegrationCountAggregateInputType = {
    id?: true
    uuid?: true
    integration_uuid?: true
    spec_url?: true
    spec_json?: true
    base_url?: true
    auth_type?: true
    auth_config?: true
    generated_tools?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type OpenApiIntegrationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OpenApiIntegration to aggregate.
     */
    where?: OpenApiIntegrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OpenApiIntegrations to fetch.
     */
    orderBy?: OpenApiIntegrationOrderByWithRelationInput | OpenApiIntegrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OpenApiIntegrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OpenApiIntegrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OpenApiIntegrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OpenApiIntegrations
    **/
    _count?: true | OpenApiIntegrationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OpenApiIntegrationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OpenApiIntegrationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OpenApiIntegrationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OpenApiIntegrationMaxAggregateInputType
  }

  export type GetOpenApiIntegrationAggregateType<T extends OpenApiIntegrationAggregateArgs> = {
        [P in keyof T & keyof AggregateOpenApiIntegration]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOpenApiIntegration[P]>
      : GetScalarType<T[P], AggregateOpenApiIntegration[P]>
  }




  export type OpenApiIntegrationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OpenApiIntegrationWhereInput
    orderBy?: OpenApiIntegrationOrderByWithAggregationInput | OpenApiIntegrationOrderByWithAggregationInput[]
    by: OpenApiIntegrationScalarFieldEnum[] | OpenApiIntegrationScalarFieldEnum
    having?: OpenApiIntegrationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OpenApiIntegrationCountAggregateInputType | true
    _avg?: OpenApiIntegrationAvgAggregateInputType
    _sum?: OpenApiIntegrationSumAggregateInputType
    _min?: OpenApiIntegrationMinAggregateInputType
    _max?: OpenApiIntegrationMaxAggregateInputType
  }

  export type OpenApiIntegrationGroupByOutputType = {
    id: number
    uuid: string
    integration_uuid: string
    spec_url: string | null
    spec_json: JsonValue
    base_url: string
    auth_type: $Enums.OpenApiAuthType
    auth_config: string
    generated_tools: JsonValue
    created_at: Date
    updated_at: Date
    _count: OpenApiIntegrationCountAggregateOutputType | null
    _avg: OpenApiIntegrationAvgAggregateOutputType | null
    _sum: OpenApiIntegrationSumAggregateOutputType | null
    _min: OpenApiIntegrationMinAggregateOutputType | null
    _max: OpenApiIntegrationMaxAggregateOutputType | null
  }

  type GetOpenApiIntegrationGroupByPayload<T extends OpenApiIntegrationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OpenApiIntegrationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OpenApiIntegrationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OpenApiIntegrationGroupByOutputType[P]>
            : GetScalarType<T[P], OpenApiIntegrationGroupByOutputType[P]>
        }
      >
    >


  export type OpenApiIntegrationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    integration_uuid?: boolean
    spec_url?: boolean
    spec_json?: boolean
    base_url?: boolean
    auth_type?: boolean
    auth_config?: boolean
    generated_tools?: boolean
    created_at?: boolean
    updated_at?: boolean
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["openApiIntegration"]>

  export type OpenApiIntegrationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    integration_uuid?: boolean
    spec_url?: boolean
    spec_json?: boolean
    base_url?: boolean
    auth_type?: boolean
    auth_config?: boolean
    generated_tools?: boolean
    created_at?: boolean
    updated_at?: boolean
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["openApiIntegration"]>

  export type OpenApiIntegrationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    integration_uuid?: boolean
    spec_url?: boolean
    spec_json?: boolean
    base_url?: boolean
    auth_type?: boolean
    auth_config?: boolean
    generated_tools?: boolean
    created_at?: boolean
    updated_at?: boolean
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["openApiIntegration"]>

  export type OpenApiIntegrationSelectScalar = {
    id?: boolean
    uuid?: boolean
    integration_uuid?: boolean
    spec_url?: boolean
    spec_json?: boolean
    base_url?: boolean
    auth_type?: boolean
    auth_config?: boolean
    generated_tools?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type OpenApiIntegrationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "integration_uuid" | "spec_url" | "spec_json" | "base_url" | "auth_type" | "auth_config" | "generated_tools" | "created_at" | "updated_at", ExtArgs["result"]["openApiIntegration"]>
  export type OpenApiIntegrationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }
  export type OpenApiIntegrationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }
  export type OpenApiIntegrationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }

  export type $OpenApiIntegrationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OpenApiIntegration"
    objects: {
      integration: Prisma.$IntegrationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      integration_uuid: string
      spec_url: string | null
      spec_json: Prisma.JsonValue
      base_url: string
      auth_type: $Enums.OpenApiAuthType
      auth_config: string
      generated_tools: Prisma.JsonValue
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["openApiIntegration"]>
    composites: {}
  }

  type OpenApiIntegrationGetPayload<S extends boolean | null | undefined | OpenApiIntegrationDefaultArgs> = $Result.GetResult<Prisma.$OpenApiIntegrationPayload, S>

  type OpenApiIntegrationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OpenApiIntegrationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OpenApiIntegrationCountAggregateInputType | true
    }

  export interface OpenApiIntegrationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OpenApiIntegration'], meta: { name: 'OpenApiIntegration' } }
    /**
     * Find zero or one OpenApiIntegration that matches the filter.
     * @param {OpenApiIntegrationFindUniqueArgs} args - Arguments to find a OpenApiIntegration
     * @example
     * // Get one OpenApiIntegration
     * const openApiIntegration = await prisma.openApiIntegration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OpenApiIntegrationFindUniqueArgs>(args: SelectSubset<T, OpenApiIntegrationFindUniqueArgs<ExtArgs>>): Prisma__OpenApiIntegrationClient<$Result.GetResult<Prisma.$OpenApiIntegrationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OpenApiIntegration that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OpenApiIntegrationFindUniqueOrThrowArgs} args - Arguments to find a OpenApiIntegration
     * @example
     * // Get one OpenApiIntegration
     * const openApiIntegration = await prisma.openApiIntegration.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OpenApiIntegrationFindUniqueOrThrowArgs>(args: SelectSubset<T, OpenApiIntegrationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OpenApiIntegrationClient<$Result.GetResult<Prisma.$OpenApiIntegrationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OpenApiIntegration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenApiIntegrationFindFirstArgs} args - Arguments to find a OpenApiIntegration
     * @example
     * // Get one OpenApiIntegration
     * const openApiIntegration = await prisma.openApiIntegration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OpenApiIntegrationFindFirstArgs>(args?: SelectSubset<T, OpenApiIntegrationFindFirstArgs<ExtArgs>>): Prisma__OpenApiIntegrationClient<$Result.GetResult<Prisma.$OpenApiIntegrationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OpenApiIntegration that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenApiIntegrationFindFirstOrThrowArgs} args - Arguments to find a OpenApiIntegration
     * @example
     * // Get one OpenApiIntegration
     * const openApiIntegration = await prisma.openApiIntegration.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OpenApiIntegrationFindFirstOrThrowArgs>(args?: SelectSubset<T, OpenApiIntegrationFindFirstOrThrowArgs<ExtArgs>>): Prisma__OpenApiIntegrationClient<$Result.GetResult<Prisma.$OpenApiIntegrationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OpenApiIntegrations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenApiIntegrationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OpenApiIntegrations
     * const openApiIntegrations = await prisma.openApiIntegration.findMany()
     * 
     * // Get first 10 OpenApiIntegrations
     * const openApiIntegrations = await prisma.openApiIntegration.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const openApiIntegrationWithIdOnly = await prisma.openApiIntegration.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OpenApiIntegrationFindManyArgs>(args?: SelectSubset<T, OpenApiIntegrationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OpenApiIntegrationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OpenApiIntegration.
     * @param {OpenApiIntegrationCreateArgs} args - Arguments to create a OpenApiIntegration.
     * @example
     * // Create one OpenApiIntegration
     * const OpenApiIntegration = await prisma.openApiIntegration.create({
     *   data: {
     *     // ... data to create a OpenApiIntegration
     *   }
     * })
     * 
     */
    create<T extends OpenApiIntegrationCreateArgs>(args: SelectSubset<T, OpenApiIntegrationCreateArgs<ExtArgs>>): Prisma__OpenApiIntegrationClient<$Result.GetResult<Prisma.$OpenApiIntegrationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OpenApiIntegrations.
     * @param {OpenApiIntegrationCreateManyArgs} args - Arguments to create many OpenApiIntegrations.
     * @example
     * // Create many OpenApiIntegrations
     * const openApiIntegration = await prisma.openApiIntegration.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OpenApiIntegrationCreateManyArgs>(args?: SelectSubset<T, OpenApiIntegrationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OpenApiIntegrations and returns the data saved in the database.
     * @param {OpenApiIntegrationCreateManyAndReturnArgs} args - Arguments to create many OpenApiIntegrations.
     * @example
     * // Create many OpenApiIntegrations
     * const openApiIntegration = await prisma.openApiIntegration.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OpenApiIntegrations and only return the `id`
     * const openApiIntegrationWithIdOnly = await prisma.openApiIntegration.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OpenApiIntegrationCreateManyAndReturnArgs>(args?: SelectSubset<T, OpenApiIntegrationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OpenApiIntegrationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OpenApiIntegration.
     * @param {OpenApiIntegrationDeleteArgs} args - Arguments to delete one OpenApiIntegration.
     * @example
     * // Delete one OpenApiIntegration
     * const OpenApiIntegration = await prisma.openApiIntegration.delete({
     *   where: {
     *     // ... filter to delete one OpenApiIntegration
     *   }
     * })
     * 
     */
    delete<T extends OpenApiIntegrationDeleteArgs>(args: SelectSubset<T, OpenApiIntegrationDeleteArgs<ExtArgs>>): Prisma__OpenApiIntegrationClient<$Result.GetResult<Prisma.$OpenApiIntegrationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OpenApiIntegration.
     * @param {OpenApiIntegrationUpdateArgs} args - Arguments to update one OpenApiIntegration.
     * @example
     * // Update one OpenApiIntegration
     * const openApiIntegration = await prisma.openApiIntegration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OpenApiIntegrationUpdateArgs>(args: SelectSubset<T, OpenApiIntegrationUpdateArgs<ExtArgs>>): Prisma__OpenApiIntegrationClient<$Result.GetResult<Prisma.$OpenApiIntegrationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OpenApiIntegrations.
     * @param {OpenApiIntegrationDeleteManyArgs} args - Arguments to filter OpenApiIntegrations to delete.
     * @example
     * // Delete a few OpenApiIntegrations
     * const { count } = await prisma.openApiIntegration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OpenApiIntegrationDeleteManyArgs>(args?: SelectSubset<T, OpenApiIntegrationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OpenApiIntegrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenApiIntegrationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OpenApiIntegrations
     * const openApiIntegration = await prisma.openApiIntegration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OpenApiIntegrationUpdateManyArgs>(args: SelectSubset<T, OpenApiIntegrationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OpenApiIntegrations and returns the data updated in the database.
     * @param {OpenApiIntegrationUpdateManyAndReturnArgs} args - Arguments to update many OpenApiIntegrations.
     * @example
     * // Update many OpenApiIntegrations
     * const openApiIntegration = await prisma.openApiIntegration.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OpenApiIntegrations and only return the `id`
     * const openApiIntegrationWithIdOnly = await prisma.openApiIntegration.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OpenApiIntegrationUpdateManyAndReturnArgs>(args: SelectSubset<T, OpenApiIntegrationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OpenApiIntegrationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OpenApiIntegration.
     * @param {OpenApiIntegrationUpsertArgs} args - Arguments to update or create a OpenApiIntegration.
     * @example
     * // Update or create a OpenApiIntegration
     * const openApiIntegration = await prisma.openApiIntegration.upsert({
     *   create: {
     *     // ... data to create a OpenApiIntegration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OpenApiIntegration we want to update
     *   }
     * })
     */
    upsert<T extends OpenApiIntegrationUpsertArgs>(args: SelectSubset<T, OpenApiIntegrationUpsertArgs<ExtArgs>>): Prisma__OpenApiIntegrationClient<$Result.GetResult<Prisma.$OpenApiIntegrationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OpenApiIntegrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenApiIntegrationCountArgs} args - Arguments to filter OpenApiIntegrations to count.
     * @example
     * // Count the number of OpenApiIntegrations
     * const count = await prisma.openApiIntegration.count({
     *   where: {
     *     // ... the filter for the OpenApiIntegrations we want to count
     *   }
     * })
    **/
    count<T extends OpenApiIntegrationCountArgs>(
      args?: Subset<T, OpenApiIntegrationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OpenApiIntegrationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OpenApiIntegration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenApiIntegrationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OpenApiIntegrationAggregateArgs>(args: Subset<T, OpenApiIntegrationAggregateArgs>): Prisma.PrismaPromise<GetOpenApiIntegrationAggregateType<T>>

    /**
     * Group by OpenApiIntegration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenApiIntegrationGroupByArgs} args - Group by arguments.
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
      T extends OpenApiIntegrationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OpenApiIntegrationGroupByArgs['orderBy'] }
        : { orderBy?: OpenApiIntegrationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OpenApiIntegrationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOpenApiIntegrationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OpenApiIntegration model
   */
  readonly fields: OpenApiIntegrationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OpenApiIntegration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OpenApiIntegrationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    integration<T extends IntegrationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, IntegrationDefaultArgs<ExtArgs>>): Prisma__IntegrationClient<$Result.GetResult<Prisma.$IntegrationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the OpenApiIntegration model
   */
  interface OpenApiIntegrationFieldRefs {
    readonly id: FieldRef<"OpenApiIntegration", 'Int'>
    readonly uuid: FieldRef<"OpenApiIntegration", 'String'>
    readonly integration_uuid: FieldRef<"OpenApiIntegration", 'String'>
    readonly spec_url: FieldRef<"OpenApiIntegration", 'String'>
    readonly spec_json: FieldRef<"OpenApiIntegration", 'Json'>
    readonly base_url: FieldRef<"OpenApiIntegration", 'String'>
    readonly auth_type: FieldRef<"OpenApiIntegration", 'OpenApiAuthType'>
    readonly auth_config: FieldRef<"OpenApiIntegration", 'String'>
    readonly generated_tools: FieldRef<"OpenApiIntegration", 'Json'>
    readonly created_at: FieldRef<"OpenApiIntegration", 'DateTime'>
    readonly updated_at: FieldRef<"OpenApiIntegration", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OpenApiIntegration findUnique
   */
  export type OpenApiIntegrationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenApiIntegration
     */
    select?: OpenApiIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenApiIntegration
     */
    omit?: OpenApiIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenApiIntegrationInclude<ExtArgs> | null
    /**
     * Filter, which OpenApiIntegration to fetch.
     */
    where: OpenApiIntegrationWhereUniqueInput
  }

  /**
   * OpenApiIntegration findUniqueOrThrow
   */
  export type OpenApiIntegrationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenApiIntegration
     */
    select?: OpenApiIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenApiIntegration
     */
    omit?: OpenApiIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenApiIntegrationInclude<ExtArgs> | null
    /**
     * Filter, which OpenApiIntegration to fetch.
     */
    where: OpenApiIntegrationWhereUniqueInput
  }

  /**
   * OpenApiIntegration findFirst
   */
  export type OpenApiIntegrationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenApiIntegration
     */
    select?: OpenApiIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenApiIntegration
     */
    omit?: OpenApiIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenApiIntegrationInclude<ExtArgs> | null
    /**
     * Filter, which OpenApiIntegration to fetch.
     */
    where?: OpenApiIntegrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OpenApiIntegrations to fetch.
     */
    orderBy?: OpenApiIntegrationOrderByWithRelationInput | OpenApiIntegrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OpenApiIntegrations.
     */
    cursor?: OpenApiIntegrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OpenApiIntegrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OpenApiIntegrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OpenApiIntegrations.
     */
    distinct?: OpenApiIntegrationScalarFieldEnum | OpenApiIntegrationScalarFieldEnum[]
  }

  /**
   * OpenApiIntegration findFirstOrThrow
   */
  export type OpenApiIntegrationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenApiIntegration
     */
    select?: OpenApiIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenApiIntegration
     */
    omit?: OpenApiIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenApiIntegrationInclude<ExtArgs> | null
    /**
     * Filter, which OpenApiIntegration to fetch.
     */
    where?: OpenApiIntegrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OpenApiIntegrations to fetch.
     */
    orderBy?: OpenApiIntegrationOrderByWithRelationInput | OpenApiIntegrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OpenApiIntegrations.
     */
    cursor?: OpenApiIntegrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OpenApiIntegrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OpenApiIntegrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OpenApiIntegrations.
     */
    distinct?: OpenApiIntegrationScalarFieldEnum | OpenApiIntegrationScalarFieldEnum[]
  }

  /**
   * OpenApiIntegration findMany
   */
  export type OpenApiIntegrationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenApiIntegration
     */
    select?: OpenApiIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenApiIntegration
     */
    omit?: OpenApiIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenApiIntegrationInclude<ExtArgs> | null
    /**
     * Filter, which OpenApiIntegrations to fetch.
     */
    where?: OpenApiIntegrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OpenApiIntegrations to fetch.
     */
    orderBy?: OpenApiIntegrationOrderByWithRelationInput | OpenApiIntegrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OpenApiIntegrations.
     */
    cursor?: OpenApiIntegrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OpenApiIntegrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OpenApiIntegrations.
     */
    skip?: number
    distinct?: OpenApiIntegrationScalarFieldEnum | OpenApiIntegrationScalarFieldEnum[]
  }

  /**
   * OpenApiIntegration create
   */
  export type OpenApiIntegrationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenApiIntegration
     */
    select?: OpenApiIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenApiIntegration
     */
    omit?: OpenApiIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenApiIntegrationInclude<ExtArgs> | null
    /**
     * The data needed to create a OpenApiIntegration.
     */
    data: XOR<OpenApiIntegrationCreateInput, OpenApiIntegrationUncheckedCreateInput>
  }

  /**
   * OpenApiIntegration createMany
   */
  export type OpenApiIntegrationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OpenApiIntegrations.
     */
    data: OpenApiIntegrationCreateManyInput | OpenApiIntegrationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OpenApiIntegration createManyAndReturn
   */
  export type OpenApiIntegrationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenApiIntegration
     */
    select?: OpenApiIntegrationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OpenApiIntegration
     */
    omit?: OpenApiIntegrationOmit<ExtArgs> | null
    /**
     * The data used to create many OpenApiIntegrations.
     */
    data: OpenApiIntegrationCreateManyInput | OpenApiIntegrationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenApiIntegrationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OpenApiIntegration update
   */
  export type OpenApiIntegrationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenApiIntegration
     */
    select?: OpenApiIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenApiIntegration
     */
    omit?: OpenApiIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenApiIntegrationInclude<ExtArgs> | null
    /**
     * The data needed to update a OpenApiIntegration.
     */
    data: XOR<OpenApiIntegrationUpdateInput, OpenApiIntegrationUncheckedUpdateInput>
    /**
     * Choose, which OpenApiIntegration to update.
     */
    where: OpenApiIntegrationWhereUniqueInput
  }

  /**
   * OpenApiIntegration updateMany
   */
  export type OpenApiIntegrationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OpenApiIntegrations.
     */
    data: XOR<OpenApiIntegrationUpdateManyMutationInput, OpenApiIntegrationUncheckedUpdateManyInput>
    /**
     * Filter which OpenApiIntegrations to update
     */
    where?: OpenApiIntegrationWhereInput
    /**
     * Limit how many OpenApiIntegrations to update.
     */
    limit?: number
  }

  /**
   * OpenApiIntegration updateManyAndReturn
   */
  export type OpenApiIntegrationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenApiIntegration
     */
    select?: OpenApiIntegrationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OpenApiIntegration
     */
    omit?: OpenApiIntegrationOmit<ExtArgs> | null
    /**
     * The data used to update OpenApiIntegrations.
     */
    data: XOR<OpenApiIntegrationUpdateManyMutationInput, OpenApiIntegrationUncheckedUpdateManyInput>
    /**
     * Filter which OpenApiIntegrations to update
     */
    where?: OpenApiIntegrationWhereInput
    /**
     * Limit how many OpenApiIntegrations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenApiIntegrationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OpenApiIntegration upsert
   */
  export type OpenApiIntegrationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenApiIntegration
     */
    select?: OpenApiIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenApiIntegration
     */
    omit?: OpenApiIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenApiIntegrationInclude<ExtArgs> | null
    /**
     * The filter to search for the OpenApiIntegration to update in case it exists.
     */
    where: OpenApiIntegrationWhereUniqueInput
    /**
     * In case the OpenApiIntegration found by the `where` argument doesn't exist, create a new OpenApiIntegration with this data.
     */
    create: XOR<OpenApiIntegrationCreateInput, OpenApiIntegrationUncheckedCreateInput>
    /**
     * In case the OpenApiIntegration was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OpenApiIntegrationUpdateInput, OpenApiIntegrationUncheckedUpdateInput>
  }

  /**
   * OpenApiIntegration delete
   */
  export type OpenApiIntegrationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenApiIntegration
     */
    select?: OpenApiIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenApiIntegration
     */
    omit?: OpenApiIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenApiIntegrationInclude<ExtArgs> | null
    /**
     * Filter which OpenApiIntegration to delete.
     */
    where: OpenApiIntegrationWhereUniqueInput
  }

  /**
   * OpenApiIntegration deleteMany
   */
  export type OpenApiIntegrationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OpenApiIntegrations to delete
     */
    where?: OpenApiIntegrationWhereInput
    /**
     * Limit how many OpenApiIntegrations to delete.
     */
    limit?: number
  }

  /**
   * OpenApiIntegration without action
   */
  export type OpenApiIntegrationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenApiIntegration
     */
    select?: OpenApiIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenApiIntegration
     */
    omit?: OpenApiIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenApiIntegrationInclude<ExtArgs> | null
  }


  /**
   * Model McpIntegration
   */

  export type AggregateMcpIntegration = {
    _count: McpIntegrationCountAggregateOutputType | null
    _avg: McpIntegrationAvgAggregateOutputType | null
    _sum: McpIntegrationSumAggregateOutputType | null
    _min: McpIntegrationMinAggregateOutputType | null
    _max: McpIntegrationMaxAggregateOutputType | null
  }

  export type McpIntegrationAvgAggregateOutputType = {
    id: number | null
  }

  export type McpIntegrationSumAggregateOutputType = {
    id: number | null
  }

  export type McpIntegrationMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    integration_uuid: string | null
    server_url: string | null
    transport_type: $Enums.McpTransportType | null
    auth_type: $Enums.McpAuthType | null
    auth_config: string | null
    server_name: string | null
    last_tool_sync: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type McpIntegrationMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    integration_uuid: string | null
    server_url: string | null
    transport_type: $Enums.McpTransportType | null
    auth_type: $Enums.McpAuthType | null
    auth_config: string | null
    server_name: string | null
    last_tool_sync: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type McpIntegrationCountAggregateOutputType = {
    id: number
    uuid: number
    integration_uuid: number
    server_url: number
    transport_type: number
    auth_type: number
    auth_config: number
    server_name: number
    discovered_tools: number
    last_tool_sync: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type McpIntegrationAvgAggregateInputType = {
    id?: true
  }

  export type McpIntegrationSumAggregateInputType = {
    id?: true
  }

  export type McpIntegrationMinAggregateInputType = {
    id?: true
    uuid?: true
    integration_uuid?: true
    server_url?: true
    transport_type?: true
    auth_type?: true
    auth_config?: true
    server_name?: true
    last_tool_sync?: true
    created_at?: true
    updated_at?: true
  }

  export type McpIntegrationMaxAggregateInputType = {
    id?: true
    uuid?: true
    integration_uuid?: true
    server_url?: true
    transport_type?: true
    auth_type?: true
    auth_config?: true
    server_name?: true
    last_tool_sync?: true
    created_at?: true
    updated_at?: true
  }

  export type McpIntegrationCountAggregateInputType = {
    id?: true
    uuid?: true
    integration_uuid?: true
    server_url?: true
    transport_type?: true
    auth_type?: true
    auth_config?: true
    server_name?: true
    discovered_tools?: true
    last_tool_sync?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type McpIntegrationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which McpIntegration to aggregate.
     */
    where?: McpIntegrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of McpIntegrations to fetch.
     */
    orderBy?: McpIntegrationOrderByWithRelationInput | McpIntegrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: McpIntegrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` McpIntegrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` McpIntegrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned McpIntegrations
    **/
    _count?: true | McpIntegrationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: McpIntegrationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: McpIntegrationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: McpIntegrationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: McpIntegrationMaxAggregateInputType
  }

  export type GetMcpIntegrationAggregateType<T extends McpIntegrationAggregateArgs> = {
        [P in keyof T & keyof AggregateMcpIntegration]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMcpIntegration[P]>
      : GetScalarType<T[P], AggregateMcpIntegration[P]>
  }




  export type McpIntegrationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: McpIntegrationWhereInput
    orderBy?: McpIntegrationOrderByWithAggregationInput | McpIntegrationOrderByWithAggregationInput[]
    by: McpIntegrationScalarFieldEnum[] | McpIntegrationScalarFieldEnum
    having?: McpIntegrationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: McpIntegrationCountAggregateInputType | true
    _avg?: McpIntegrationAvgAggregateInputType
    _sum?: McpIntegrationSumAggregateInputType
    _min?: McpIntegrationMinAggregateInputType
    _max?: McpIntegrationMaxAggregateInputType
  }

  export type McpIntegrationGroupByOutputType = {
    id: number
    uuid: string
    integration_uuid: string
    server_url: string
    transport_type: $Enums.McpTransportType
    auth_type: $Enums.McpAuthType
    auth_config: string
    server_name: string | null
    discovered_tools: JsonValue
    last_tool_sync: Date | null
    created_at: Date
    updated_at: Date
    _count: McpIntegrationCountAggregateOutputType | null
    _avg: McpIntegrationAvgAggregateOutputType | null
    _sum: McpIntegrationSumAggregateOutputType | null
    _min: McpIntegrationMinAggregateOutputType | null
    _max: McpIntegrationMaxAggregateOutputType | null
  }

  type GetMcpIntegrationGroupByPayload<T extends McpIntegrationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<McpIntegrationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof McpIntegrationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], McpIntegrationGroupByOutputType[P]>
            : GetScalarType<T[P], McpIntegrationGroupByOutputType[P]>
        }
      >
    >


  export type McpIntegrationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    integration_uuid?: boolean
    server_url?: boolean
    transport_type?: boolean
    auth_type?: boolean
    auth_config?: boolean
    server_name?: boolean
    discovered_tools?: boolean
    last_tool_sync?: boolean
    created_at?: boolean
    updated_at?: boolean
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mcpIntegration"]>

  export type McpIntegrationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    integration_uuid?: boolean
    server_url?: boolean
    transport_type?: boolean
    auth_type?: boolean
    auth_config?: boolean
    server_name?: boolean
    discovered_tools?: boolean
    last_tool_sync?: boolean
    created_at?: boolean
    updated_at?: boolean
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mcpIntegration"]>

  export type McpIntegrationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    integration_uuid?: boolean
    server_url?: boolean
    transport_type?: boolean
    auth_type?: boolean
    auth_config?: boolean
    server_name?: boolean
    discovered_tools?: boolean
    last_tool_sync?: boolean
    created_at?: boolean
    updated_at?: boolean
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mcpIntegration"]>

  export type McpIntegrationSelectScalar = {
    id?: boolean
    uuid?: boolean
    integration_uuid?: boolean
    server_url?: boolean
    transport_type?: boolean
    auth_type?: boolean
    auth_config?: boolean
    server_name?: boolean
    discovered_tools?: boolean
    last_tool_sync?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type McpIntegrationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "integration_uuid" | "server_url" | "transport_type" | "auth_type" | "auth_config" | "server_name" | "discovered_tools" | "last_tool_sync" | "created_at" | "updated_at", ExtArgs["result"]["mcpIntegration"]>
  export type McpIntegrationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }
  export type McpIntegrationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }
  export type McpIntegrationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }

  export type $McpIntegrationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "McpIntegration"
    objects: {
      integration: Prisma.$IntegrationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      integration_uuid: string
      server_url: string
      transport_type: $Enums.McpTransportType
      auth_type: $Enums.McpAuthType
      auth_config: string
      server_name: string | null
      discovered_tools: Prisma.JsonValue
      last_tool_sync: Date | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["mcpIntegration"]>
    composites: {}
  }

  type McpIntegrationGetPayload<S extends boolean | null | undefined | McpIntegrationDefaultArgs> = $Result.GetResult<Prisma.$McpIntegrationPayload, S>

  type McpIntegrationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<McpIntegrationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: McpIntegrationCountAggregateInputType | true
    }

  export interface McpIntegrationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['McpIntegration'], meta: { name: 'McpIntegration' } }
    /**
     * Find zero or one McpIntegration that matches the filter.
     * @param {McpIntegrationFindUniqueArgs} args - Arguments to find a McpIntegration
     * @example
     * // Get one McpIntegration
     * const mcpIntegration = await prisma.mcpIntegration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends McpIntegrationFindUniqueArgs>(args: SelectSubset<T, McpIntegrationFindUniqueArgs<ExtArgs>>): Prisma__McpIntegrationClient<$Result.GetResult<Prisma.$McpIntegrationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one McpIntegration that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {McpIntegrationFindUniqueOrThrowArgs} args - Arguments to find a McpIntegration
     * @example
     * // Get one McpIntegration
     * const mcpIntegration = await prisma.mcpIntegration.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends McpIntegrationFindUniqueOrThrowArgs>(args: SelectSubset<T, McpIntegrationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__McpIntegrationClient<$Result.GetResult<Prisma.$McpIntegrationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first McpIntegration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpIntegrationFindFirstArgs} args - Arguments to find a McpIntegration
     * @example
     * // Get one McpIntegration
     * const mcpIntegration = await prisma.mcpIntegration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends McpIntegrationFindFirstArgs>(args?: SelectSubset<T, McpIntegrationFindFirstArgs<ExtArgs>>): Prisma__McpIntegrationClient<$Result.GetResult<Prisma.$McpIntegrationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first McpIntegration that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpIntegrationFindFirstOrThrowArgs} args - Arguments to find a McpIntegration
     * @example
     * // Get one McpIntegration
     * const mcpIntegration = await prisma.mcpIntegration.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends McpIntegrationFindFirstOrThrowArgs>(args?: SelectSubset<T, McpIntegrationFindFirstOrThrowArgs<ExtArgs>>): Prisma__McpIntegrationClient<$Result.GetResult<Prisma.$McpIntegrationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more McpIntegrations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpIntegrationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all McpIntegrations
     * const mcpIntegrations = await prisma.mcpIntegration.findMany()
     * 
     * // Get first 10 McpIntegrations
     * const mcpIntegrations = await prisma.mcpIntegration.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mcpIntegrationWithIdOnly = await prisma.mcpIntegration.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends McpIntegrationFindManyArgs>(args?: SelectSubset<T, McpIntegrationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$McpIntegrationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a McpIntegration.
     * @param {McpIntegrationCreateArgs} args - Arguments to create a McpIntegration.
     * @example
     * // Create one McpIntegration
     * const McpIntegration = await prisma.mcpIntegration.create({
     *   data: {
     *     // ... data to create a McpIntegration
     *   }
     * })
     * 
     */
    create<T extends McpIntegrationCreateArgs>(args: SelectSubset<T, McpIntegrationCreateArgs<ExtArgs>>): Prisma__McpIntegrationClient<$Result.GetResult<Prisma.$McpIntegrationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many McpIntegrations.
     * @param {McpIntegrationCreateManyArgs} args - Arguments to create many McpIntegrations.
     * @example
     * // Create many McpIntegrations
     * const mcpIntegration = await prisma.mcpIntegration.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends McpIntegrationCreateManyArgs>(args?: SelectSubset<T, McpIntegrationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many McpIntegrations and returns the data saved in the database.
     * @param {McpIntegrationCreateManyAndReturnArgs} args - Arguments to create many McpIntegrations.
     * @example
     * // Create many McpIntegrations
     * const mcpIntegration = await prisma.mcpIntegration.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many McpIntegrations and only return the `id`
     * const mcpIntegrationWithIdOnly = await prisma.mcpIntegration.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends McpIntegrationCreateManyAndReturnArgs>(args?: SelectSubset<T, McpIntegrationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$McpIntegrationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a McpIntegration.
     * @param {McpIntegrationDeleteArgs} args - Arguments to delete one McpIntegration.
     * @example
     * // Delete one McpIntegration
     * const McpIntegration = await prisma.mcpIntegration.delete({
     *   where: {
     *     // ... filter to delete one McpIntegration
     *   }
     * })
     * 
     */
    delete<T extends McpIntegrationDeleteArgs>(args: SelectSubset<T, McpIntegrationDeleteArgs<ExtArgs>>): Prisma__McpIntegrationClient<$Result.GetResult<Prisma.$McpIntegrationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one McpIntegration.
     * @param {McpIntegrationUpdateArgs} args - Arguments to update one McpIntegration.
     * @example
     * // Update one McpIntegration
     * const mcpIntegration = await prisma.mcpIntegration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends McpIntegrationUpdateArgs>(args: SelectSubset<T, McpIntegrationUpdateArgs<ExtArgs>>): Prisma__McpIntegrationClient<$Result.GetResult<Prisma.$McpIntegrationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more McpIntegrations.
     * @param {McpIntegrationDeleteManyArgs} args - Arguments to filter McpIntegrations to delete.
     * @example
     * // Delete a few McpIntegrations
     * const { count } = await prisma.mcpIntegration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends McpIntegrationDeleteManyArgs>(args?: SelectSubset<T, McpIntegrationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more McpIntegrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpIntegrationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many McpIntegrations
     * const mcpIntegration = await prisma.mcpIntegration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends McpIntegrationUpdateManyArgs>(args: SelectSubset<T, McpIntegrationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more McpIntegrations and returns the data updated in the database.
     * @param {McpIntegrationUpdateManyAndReturnArgs} args - Arguments to update many McpIntegrations.
     * @example
     * // Update many McpIntegrations
     * const mcpIntegration = await prisma.mcpIntegration.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more McpIntegrations and only return the `id`
     * const mcpIntegrationWithIdOnly = await prisma.mcpIntegration.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends McpIntegrationUpdateManyAndReturnArgs>(args: SelectSubset<T, McpIntegrationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$McpIntegrationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one McpIntegration.
     * @param {McpIntegrationUpsertArgs} args - Arguments to update or create a McpIntegration.
     * @example
     * // Update or create a McpIntegration
     * const mcpIntegration = await prisma.mcpIntegration.upsert({
     *   create: {
     *     // ... data to create a McpIntegration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the McpIntegration we want to update
     *   }
     * })
     */
    upsert<T extends McpIntegrationUpsertArgs>(args: SelectSubset<T, McpIntegrationUpsertArgs<ExtArgs>>): Prisma__McpIntegrationClient<$Result.GetResult<Prisma.$McpIntegrationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of McpIntegrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpIntegrationCountArgs} args - Arguments to filter McpIntegrations to count.
     * @example
     * // Count the number of McpIntegrations
     * const count = await prisma.mcpIntegration.count({
     *   where: {
     *     // ... the filter for the McpIntegrations we want to count
     *   }
     * })
    **/
    count<T extends McpIntegrationCountArgs>(
      args?: Subset<T, McpIntegrationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], McpIntegrationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a McpIntegration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpIntegrationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends McpIntegrationAggregateArgs>(args: Subset<T, McpIntegrationAggregateArgs>): Prisma.PrismaPromise<GetMcpIntegrationAggregateType<T>>

    /**
     * Group by McpIntegration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpIntegrationGroupByArgs} args - Group by arguments.
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
      T extends McpIntegrationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: McpIntegrationGroupByArgs['orderBy'] }
        : { orderBy?: McpIntegrationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, McpIntegrationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMcpIntegrationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the McpIntegration model
   */
  readonly fields: McpIntegrationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for McpIntegration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__McpIntegrationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    integration<T extends IntegrationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, IntegrationDefaultArgs<ExtArgs>>): Prisma__IntegrationClient<$Result.GetResult<Prisma.$IntegrationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the McpIntegration model
   */
  interface McpIntegrationFieldRefs {
    readonly id: FieldRef<"McpIntegration", 'Int'>
    readonly uuid: FieldRef<"McpIntegration", 'String'>
    readonly integration_uuid: FieldRef<"McpIntegration", 'String'>
    readonly server_url: FieldRef<"McpIntegration", 'String'>
    readonly transport_type: FieldRef<"McpIntegration", 'McpTransportType'>
    readonly auth_type: FieldRef<"McpIntegration", 'McpAuthType'>
    readonly auth_config: FieldRef<"McpIntegration", 'String'>
    readonly server_name: FieldRef<"McpIntegration", 'String'>
    readonly discovered_tools: FieldRef<"McpIntegration", 'Json'>
    readonly last_tool_sync: FieldRef<"McpIntegration", 'DateTime'>
    readonly created_at: FieldRef<"McpIntegration", 'DateTime'>
    readonly updated_at: FieldRef<"McpIntegration", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * McpIntegration findUnique
   */
  export type McpIntegrationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpIntegration
     */
    select?: McpIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpIntegration
     */
    omit?: McpIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpIntegrationInclude<ExtArgs> | null
    /**
     * Filter, which McpIntegration to fetch.
     */
    where: McpIntegrationWhereUniqueInput
  }

  /**
   * McpIntegration findUniqueOrThrow
   */
  export type McpIntegrationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpIntegration
     */
    select?: McpIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpIntegration
     */
    omit?: McpIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpIntegrationInclude<ExtArgs> | null
    /**
     * Filter, which McpIntegration to fetch.
     */
    where: McpIntegrationWhereUniqueInput
  }

  /**
   * McpIntegration findFirst
   */
  export type McpIntegrationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpIntegration
     */
    select?: McpIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpIntegration
     */
    omit?: McpIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpIntegrationInclude<ExtArgs> | null
    /**
     * Filter, which McpIntegration to fetch.
     */
    where?: McpIntegrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of McpIntegrations to fetch.
     */
    orderBy?: McpIntegrationOrderByWithRelationInput | McpIntegrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for McpIntegrations.
     */
    cursor?: McpIntegrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` McpIntegrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` McpIntegrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of McpIntegrations.
     */
    distinct?: McpIntegrationScalarFieldEnum | McpIntegrationScalarFieldEnum[]
  }

  /**
   * McpIntegration findFirstOrThrow
   */
  export type McpIntegrationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpIntegration
     */
    select?: McpIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpIntegration
     */
    omit?: McpIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpIntegrationInclude<ExtArgs> | null
    /**
     * Filter, which McpIntegration to fetch.
     */
    where?: McpIntegrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of McpIntegrations to fetch.
     */
    orderBy?: McpIntegrationOrderByWithRelationInput | McpIntegrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for McpIntegrations.
     */
    cursor?: McpIntegrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` McpIntegrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` McpIntegrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of McpIntegrations.
     */
    distinct?: McpIntegrationScalarFieldEnum | McpIntegrationScalarFieldEnum[]
  }

  /**
   * McpIntegration findMany
   */
  export type McpIntegrationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpIntegration
     */
    select?: McpIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpIntegration
     */
    omit?: McpIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpIntegrationInclude<ExtArgs> | null
    /**
     * Filter, which McpIntegrations to fetch.
     */
    where?: McpIntegrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of McpIntegrations to fetch.
     */
    orderBy?: McpIntegrationOrderByWithRelationInput | McpIntegrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing McpIntegrations.
     */
    cursor?: McpIntegrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` McpIntegrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` McpIntegrations.
     */
    skip?: number
    distinct?: McpIntegrationScalarFieldEnum | McpIntegrationScalarFieldEnum[]
  }

  /**
   * McpIntegration create
   */
  export type McpIntegrationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpIntegration
     */
    select?: McpIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpIntegration
     */
    omit?: McpIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpIntegrationInclude<ExtArgs> | null
    /**
     * The data needed to create a McpIntegration.
     */
    data: XOR<McpIntegrationCreateInput, McpIntegrationUncheckedCreateInput>
  }

  /**
   * McpIntegration createMany
   */
  export type McpIntegrationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many McpIntegrations.
     */
    data: McpIntegrationCreateManyInput | McpIntegrationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * McpIntegration createManyAndReturn
   */
  export type McpIntegrationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpIntegration
     */
    select?: McpIntegrationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the McpIntegration
     */
    omit?: McpIntegrationOmit<ExtArgs> | null
    /**
     * The data used to create many McpIntegrations.
     */
    data: McpIntegrationCreateManyInput | McpIntegrationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpIntegrationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * McpIntegration update
   */
  export type McpIntegrationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpIntegration
     */
    select?: McpIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpIntegration
     */
    omit?: McpIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpIntegrationInclude<ExtArgs> | null
    /**
     * The data needed to update a McpIntegration.
     */
    data: XOR<McpIntegrationUpdateInput, McpIntegrationUncheckedUpdateInput>
    /**
     * Choose, which McpIntegration to update.
     */
    where: McpIntegrationWhereUniqueInput
  }

  /**
   * McpIntegration updateMany
   */
  export type McpIntegrationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update McpIntegrations.
     */
    data: XOR<McpIntegrationUpdateManyMutationInput, McpIntegrationUncheckedUpdateManyInput>
    /**
     * Filter which McpIntegrations to update
     */
    where?: McpIntegrationWhereInput
    /**
     * Limit how many McpIntegrations to update.
     */
    limit?: number
  }

  /**
   * McpIntegration updateManyAndReturn
   */
  export type McpIntegrationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpIntegration
     */
    select?: McpIntegrationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the McpIntegration
     */
    omit?: McpIntegrationOmit<ExtArgs> | null
    /**
     * The data used to update McpIntegrations.
     */
    data: XOR<McpIntegrationUpdateManyMutationInput, McpIntegrationUncheckedUpdateManyInput>
    /**
     * Filter which McpIntegrations to update
     */
    where?: McpIntegrationWhereInput
    /**
     * Limit how many McpIntegrations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpIntegrationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * McpIntegration upsert
   */
  export type McpIntegrationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpIntegration
     */
    select?: McpIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpIntegration
     */
    omit?: McpIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpIntegrationInclude<ExtArgs> | null
    /**
     * The filter to search for the McpIntegration to update in case it exists.
     */
    where: McpIntegrationWhereUniqueInput
    /**
     * In case the McpIntegration found by the `where` argument doesn't exist, create a new McpIntegration with this data.
     */
    create: XOR<McpIntegrationCreateInput, McpIntegrationUncheckedCreateInput>
    /**
     * In case the McpIntegration was found with the provided `where` argument, update it with this data.
     */
    update: XOR<McpIntegrationUpdateInput, McpIntegrationUncheckedUpdateInput>
  }

  /**
   * McpIntegration delete
   */
  export type McpIntegrationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpIntegration
     */
    select?: McpIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpIntegration
     */
    omit?: McpIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpIntegrationInclude<ExtArgs> | null
    /**
     * Filter which McpIntegration to delete.
     */
    where: McpIntegrationWhereUniqueInput
  }

  /**
   * McpIntegration deleteMany
   */
  export type McpIntegrationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which McpIntegrations to delete
     */
    where?: McpIntegrationWhereInput
    /**
     * Limit how many McpIntegrations to delete.
     */
    limit?: number
  }

  /**
   * McpIntegration without action
   */
  export type McpIntegrationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpIntegration
     */
    select?: McpIntegrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpIntegration
     */
    omit?: McpIntegrationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpIntegrationInclude<ExtArgs> | null
  }


  /**
   * Model IntegrationAction
   */

  export type AggregateIntegrationAction = {
    _count: IntegrationActionCountAggregateOutputType | null
    _avg: IntegrationActionAvgAggregateOutputType | null
    _sum: IntegrationActionSumAggregateOutputType | null
    _min: IntegrationActionMinAggregateOutputType | null
    _max: IntegrationActionMaxAggregateOutputType | null
  }

  export type IntegrationActionAvgAggregateOutputType = {
    id: number | null
  }

  export type IntegrationActionSumAggregateOutputType = {
    id: number | null
  }

  export type IntegrationActionMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    integration_uuid: string | null
    key: string | null
    label: string | null
    description: string | null
    enabled: boolean | null
    required_permission_key: string | null
  }

  export type IntegrationActionMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    integration_uuid: string | null
    key: string | null
    label: string | null
    description: string | null
    enabled: boolean | null
    required_permission_key: string | null
  }

  export type IntegrationActionCountAggregateOutputType = {
    id: number
    uuid: number
    integration_uuid: number
    key: number
    label: number
    description: number
    enabled: number
    required_permission_key: number
    _all: number
  }


  export type IntegrationActionAvgAggregateInputType = {
    id?: true
  }

  export type IntegrationActionSumAggregateInputType = {
    id?: true
  }

  export type IntegrationActionMinAggregateInputType = {
    id?: true
    uuid?: true
    integration_uuid?: true
    key?: true
    label?: true
    description?: true
    enabled?: true
    required_permission_key?: true
  }

  export type IntegrationActionMaxAggregateInputType = {
    id?: true
    uuid?: true
    integration_uuid?: true
    key?: true
    label?: true
    description?: true
    enabled?: true
    required_permission_key?: true
  }

  export type IntegrationActionCountAggregateInputType = {
    id?: true
    uuid?: true
    integration_uuid?: true
    key?: true
    label?: true
    description?: true
    enabled?: true
    required_permission_key?: true
    _all?: true
  }

  export type IntegrationActionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IntegrationAction to aggregate.
     */
    where?: IntegrationActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IntegrationActions to fetch.
     */
    orderBy?: IntegrationActionOrderByWithRelationInput | IntegrationActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IntegrationActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IntegrationActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IntegrationActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned IntegrationActions
    **/
    _count?: true | IntegrationActionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: IntegrationActionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: IntegrationActionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IntegrationActionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IntegrationActionMaxAggregateInputType
  }

  export type GetIntegrationActionAggregateType<T extends IntegrationActionAggregateArgs> = {
        [P in keyof T & keyof AggregateIntegrationAction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIntegrationAction[P]>
      : GetScalarType<T[P], AggregateIntegrationAction[P]>
  }




  export type IntegrationActionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IntegrationActionWhereInput
    orderBy?: IntegrationActionOrderByWithAggregationInput | IntegrationActionOrderByWithAggregationInput[]
    by: IntegrationActionScalarFieldEnum[] | IntegrationActionScalarFieldEnum
    having?: IntegrationActionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IntegrationActionCountAggregateInputType | true
    _avg?: IntegrationActionAvgAggregateInputType
    _sum?: IntegrationActionSumAggregateInputType
    _min?: IntegrationActionMinAggregateInputType
    _max?: IntegrationActionMaxAggregateInputType
  }

  export type IntegrationActionGroupByOutputType = {
    id: number
    uuid: string
    integration_uuid: string
    key: string
    label: string
    description: string
    enabled: boolean
    required_permission_key: string | null
    _count: IntegrationActionCountAggregateOutputType | null
    _avg: IntegrationActionAvgAggregateOutputType | null
    _sum: IntegrationActionSumAggregateOutputType | null
    _min: IntegrationActionMinAggregateOutputType | null
    _max: IntegrationActionMaxAggregateOutputType | null
  }

  type GetIntegrationActionGroupByPayload<T extends IntegrationActionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IntegrationActionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IntegrationActionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IntegrationActionGroupByOutputType[P]>
            : GetScalarType<T[P], IntegrationActionGroupByOutputType[P]>
        }
      >
    >


  export type IntegrationActionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    integration_uuid?: boolean
    key?: boolean
    label?: boolean
    description?: boolean
    enabled?: boolean
    required_permission_key?: boolean
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["integrationAction"]>

  export type IntegrationActionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    integration_uuid?: boolean
    key?: boolean
    label?: boolean
    description?: boolean
    enabled?: boolean
    required_permission_key?: boolean
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["integrationAction"]>

  export type IntegrationActionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    integration_uuid?: boolean
    key?: boolean
    label?: boolean
    description?: boolean
    enabled?: boolean
    required_permission_key?: boolean
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["integrationAction"]>

  export type IntegrationActionSelectScalar = {
    id?: boolean
    uuid?: boolean
    integration_uuid?: boolean
    key?: boolean
    label?: boolean
    description?: boolean
    enabled?: boolean
    required_permission_key?: boolean
  }

  export type IntegrationActionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "integration_uuid" | "key" | "label" | "description" | "enabled" | "required_permission_key", ExtArgs["result"]["integrationAction"]>
  export type IntegrationActionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }
  export type IntegrationActionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }
  export type IntegrationActionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    integration?: boolean | IntegrationDefaultArgs<ExtArgs>
  }

  export type $IntegrationActionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "IntegrationAction"
    objects: {
      integration: Prisma.$IntegrationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      integration_uuid: string
      key: string
      label: string
      description: string
      enabled: boolean
      required_permission_key: string | null
    }, ExtArgs["result"]["integrationAction"]>
    composites: {}
  }

  type IntegrationActionGetPayload<S extends boolean | null | undefined | IntegrationActionDefaultArgs> = $Result.GetResult<Prisma.$IntegrationActionPayload, S>

  type IntegrationActionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IntegrationActionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: IntegrationActionCountAggregateInputType | true
    }

  export interface IntegrationActionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['IntegrationAction'], meta: { name: 'IntegrationAction' } }
    /**
     * Find zero or one IntegrationAction that matches the filter.
     * @param {IntegrationActionFindUniqueArgs} args - Arguments to find a IntegrationAction
     * @example
     * // Get one IntegrationAction
     * const integrationAction = await prisma.integrationAction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IntegrationActionFindUniqueArgs>(args: SelectSubset<T, IntegrationActionFindUniqueArgs<ExtArgs>>): Prisma__IntegrationActionClient<$Result.GetResult<Prisma.$IntegrationActionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one IntegrationAction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IntegrationActionFindUniqueOrThrowArgs} args - Arguments to find a IntegrationAction
     * @example
     * // Get one IntegrationAction
     * const integrationAction = await prisma.integrationAction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IntegrationActionFindUniqueOrThrowArgs>(args: SelectSubset<T, IntegrationActionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IntegrationActionClient<$Result.GetResult<Prisma.$IntegrationActionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IntegrationAction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationActionFindFirstArgs} args - Arguments to find a IntegrationAction
     * @example
     * // Get one IntegrationAction
     * const integrationAction = await prisma.integrationAction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IntegrationActionFindFirstArgs>(args?: SelectSubset<T, IntegrationActionFindFirstArgs<ExtArgs>>): Prisma__IntegrationActionClient<$Result.GetResult<Prisma.$IntegrationActionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IntegrationAction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationActionFindFirstOrThrowArgs} args - Arguments to find a IntegrationAction
     * @example
     * // Get one IntegrationAction
     * const integrationAction = await prisma.integrationAction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IntegrationActionFindFirstOrThrowArgs>(args?: SelectSubset<T, IntegrationActionFindFirstOrThrowArgs<ExtArgs>>): Prisma__IntegrationActionClient<$Result.GetResult<Prisma.$IntegrationActionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more IntegrationActions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationActionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IntegrationActions
     * const integrationActions = await prisma.integrationAction.findMany()
     * 
     * // Get first 10 IntegrationActions
     * const integrationActions = await prisma.integrationAction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const integrationActionWithIdOnly = await prisma.integrationAction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IntegrationActionFindManyArgs>(args?: SelectSubset<T, IntegrationActionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IntegrationActionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a IntegrationAction.
     * @param {IntegrationActionCreateArgs} args - Arguments to create a IntegrationAction.
     * @example
     * // Create one IntegrationAction
     * const IntegrationAction = await prisma.integrationAction.create({
     *   data: {
     *     // ... data to create a IntegrationAction
     *   }
     * })
     * 
     */
    create<T extends IntegrationActionCreateArgs>(args: SelectSubset<T, IntegrationActionCreateArgs<ExtArgs>>): Prisma__IntegrationActionClient<$Result.GetResult<Prisma.$IntegrationActionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many IntegrationActions.
     * @param {IntegrationActionCreateManyArgs} args - Arguments to create many IntegrationActions.
     * @example
     * // Create many IntegrationActions
     * const integrationAction = await prisma.integrationAction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IntegrationActionCreateManyArgs>(args?: SelectSubset<T, IntegrationActionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many IntegrationActions and returns the data saved in the database.
     * @param {IntegrationActionCreateManyAndReturnArgs} args - Arguments to create many IntegrationActions.
     * @example
     * // Create many IntegrationActions
     * const integrationAction = await prisma.integrationAction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many IntegrationActions and only return the `id`
     * const integrationActionWithIdOnly = await prisma.integrationAction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IntegrationActionCreateManyAndReturnArgs>(args?: SelectSubset<T, IntegrationActionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IntegrationActionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a IntegrationAction.
     * @param {IntegrationActionDeleteArgs} args - Arguments to delete one IntegrationAction.
     * @example
     * // Delete one IntegrationAction
     * const IntegrationAction = await prisma.integrationAction.delete({
     *   where: {
     *     // ... filter to delete one IntegrationAction
     *   }
     * })
     * 
     */
    delete<T extends IntegrationActionDeleteArgs>(args: SelectSubset<T, IntegrationActionDeleteArgs<ExtArgs>>): Prisma__IntegrationActionClient<$Result.GetResult<Prisma.$IntegrationActionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one IntegrationAction.
     * @param {IntegrationActionUpdateArgs} args - Arguments to update one IntegrationAction.
     * @example
     * // Update one IntegrationAction
     * const integrationAction = await prisma.integrationAction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IntegrationActionUpdateArgs>(args: SelectSubset<T, IntegrationActionUpdateArgs<ExtArgs>>): Prisma__IntegrationActionClient<$Result.GetResult<Prisma.$IntegrationActionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more IntegrationActions.
     * @param {IntegrationActionDeleteManyArgs} args - Arguments to filter IntegrationActions to delete.
     * @example
     * // Delete a few IntegrationActions
     * const { count } = await prisma.integrationAction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IntegrationActionDeleteManyArgs>(args?: SelectSubset<T, IntegrationActionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IntegrationActions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationActionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IntegrationActions
     * const integrationAction = await prisma.integrationAction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IntegrationActionUpdateManyArgs>(args: SelectSubset<T, IntegrationActionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IntegrationActions and returns the data updated in the database.
     * @param {IntegrationActionUpdateManyAndReturnArgs} args - Arguments to update many IntegrationActions.
     * @example
     * // Update many IntegrationActions
     * const integrationAction = await prisma.integrationAction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more IntegrationActions and only return the `id`
     * const integrationActionWithIdOnly = await prisma.integrationAction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends IntegrationActionUpdateManyAndReturnArgs>(args: SelectSubset<T, IntegrationActionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IntegrationActionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one IntegrationAction.
     * @param {IntegrationActionUpsertArgs} args - Arguments to update or create a IntegrationAction.
     * @example
     * // Update or create a IntegrationAction
     * const integrationAction = await prisma.integrationAction.upsert({
     *   create: {
     *     // ... data to create a IntegrationAction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IntegrationAction we want to update
     *   }
     * })
     */
    upsert<T extends IntegrationActionUpsertArgs>(args: SelectSubset<T, IntegrationActionUpsertArgs<ExtArgs>>): Prisma__IntegrationActionClient<$Result.GetResult<Prisma.$IntegrationActionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of IntegrationActions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationActionCountArgs} args - Arguments to filter IntegrationActions to count.
     * @example
     * // Count the number of IntegrationActions
     * const count = await prisma.integrationAction.count({
     *   where: {
     *     // ... the filter for the IntegrationActions we want to count
     *   }
     * })
    **/
    count<T extends IntegrationActionCountArgs>(
      args?: Subset<T, IntegrationActionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IntegrationActionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a IntegrationAction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationActionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends IntegrationActionAggregateArgs>(args: Subset<T, IntegrationActionAggregateArgs>): Prisma.PrismaPromise<GetIntegrationActionAggregateType<T>>

    /**
     * Group by IntegrationAction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationActionGroupByArgs} args - Group by arguments.
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
      T extends IntegrationActionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IntegrationActionGroupByArgs['orderBy'] }
        : { orderBy?: IntegrationActionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, IntegrationActionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIntegrationActionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the IntegrationAction model
   */
  readonly fields: IntegrationActionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IntegrationAction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IntegrationActionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    integration<T extends IntegrationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, IntegrationDefaultArgs<ExtArgs>>): Prisma__IntegrationClient<$Result.GetResult<Prisma.$IntegrationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the IntegrationAction model
   */
  interface IntegrationActionFieldRefs {
    readonly id: FieldRef<"IntegrationAction", 'Int'>
    readonly uuid: FieldRef<"IntegrationAction", 'String'>
    readonly integration_uuid: FieldRef<"IntegrationAction", 'String'>
    readonly key: FieldRef<"IntegrationAction", 'String'>
    readonly label: FieldRef<"IntegrationAction", 'String'>
    readonly description: FieldRef<"IntegrationAction", 'String'>
    readonly enabled: FieldRef<"IntegrationAction", 'Boolean'>
    readonly required_permission_key: FieldRef<"IntegrationAction", 'String'>
  }
    

  // Custom InputTypes
  /**
   * IntegrationAction findUnique
   */
  export type IntegrationActionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationAction
     */
    select?: IntegrationActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationAction
     */
    omit?: IntegrationActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationActionInclude<ExtArgs> | null
    /**
     * Filter, which IntegrationAction to fetch.
     */
    where: IntegrationActionWhereUniqueInput
  }

  /**
   * IntegrationAction findUniqueOrThrow
   */
  export type IntegrationActionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationAction
     */
    select?: IntegrationActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationAction
     */
    omit?: IntegrationActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationActionInclude<ExtArgs> | null
    /**
     * Filter, which IntegrationAction to fetch.
     */
    where: IntegrationActionWhereUniqueInput
  }

  /**
   * IntegrationAction findFirst
   */
  export type IntegrationActionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationAction
     */
    select?: IntegrationActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationAction
     */
    omit?: IntegrationActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationActionInclude<ExtArgs> | null
    /**
     * Filter, which IntegrationAction to fetch.
     */
    where?: IntegrationActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IntegrationActions to fetch.
     */
    orderBy?: IntegrationActionOrderByWithRelationInput | IntegrationActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IntegrationActions.
     */
    cursor?: IntegrationActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IntegrationActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IntegrationActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IntegrationActions.
     */
    distinct?: IntegrationActionScalarFieldEnum | IntegrationActionScalarFieldEnum[]
  }

  /**
   * IntegrationAction findFirstOrThrow
   */
  export type IntegrationActionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationAction
     */
    select?: IntegrationActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationAction
     */
    omit?: IntegrationActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationActionInclude<ExtArgs> | null
    /**
     * Filter, which IntegrationAction to fetch.
     */
    where?: IntegrationActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IntegrationActions to fetch.
     */
    orderBy?: IntegrationActionOrderByWithRelationInput | IntegrationActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IntegrationActions.
     */
    cursor?: IntegrationActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IntegrationActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IntegrationActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IntegrationActions.
     */
    distinct?: IntegrationActionScalarFieldEnum | IntegrationActionScalarFieldEnum[]
  }

  /**
   * IntegrationAction findMany
   */
  export type IntegrationActionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationAction
     */
    select?: IntegrationActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationAction
     */
    omit?: IntegrationActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationActionInclude<ExtArgs> | null
    /**
     * Filter, which IntegrationActions to fetch.
     */
    where?: IntegrationActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IntegrationActions to fetch.
     */
    orderBy?: IntegrationActionOrderByWithRelationInput | IntegrationActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing IntegrationActions.
     */
    cursor?: IntegrationActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IntegrationActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IntegrationActions.
     */
    skip?: number
    distinct?: IntegrationActionScalarFieldEnum | IntegrationActionScalarFieldEnum[]
  }

  /**
   * IntegrationAction create
   */
  export type IntegrationActionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationAction
     */
    select?: IntegrationActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationAction
     */
    omit?: IntegrationActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationActionInclude<ExtArgs> | null
    /**
     * The data needed to create a IntegrationAction.
     */
    data: XOR<IntegrationActionCreateInput, IntegrationActionUncheckedCreateInput>
  }

  /**
   * IntegrationAction createMany
   */
  export type IntegrationActionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many IntegrationActions.
     */
    data: IntegrationActionCreateManyInput | IntegrationActionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IntegrationAction createManyAndReturn
   */
  export type IntegrationActionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationAction
     */
    select?: IntegrationActionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationAction
     */
    omit?: IntegrationActionOmit<ExtArgs> | null
    /**
     * The data used to create many IntegrationActions.
     */
    data: IntegrationActionCreateManyInput | IntegrationActionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationActionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * IntegrationAction update
   */
  export type IntegrationActionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationAction
     */
    select?: IntegrationActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationAction
     */
    omit?: IntegrationActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationActionInclude<ExtArgs> | null
    /**
     * The data needed to update a IntegrationAction.
     */
    data: XOR<IntegrationActionUpdateInput, IntegrationActionUncheckedUpdateInput>
    /**
     * Choose, which IntegrationAction to update.
     */
    where: IntegrationActionWhereUniqueInput
  }

  /**
   * IntegrationAction updateMany
   */
  export type IntegrationActionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update IntegrationActions.
     */
    data: XOR<IntegrationActionUpdateManyMutationInput, IntegrationActionUncheckedUpdateManyInput>
    /**
     * Filter which IntegrationActions to update
     */
    where?: IntegrationActionWhereInput
    /**
     * Limit how many IntegrationActions to update.
     */
    limit?: number
  }

  /**
   * IntegrationAction updateManyAndReturn
   */
  export type IntegrationActionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationAction
     */
    select?: IntegrationActionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationAction
     */
    omit?: IntegrationActionOmit<ExtArgs> | null
    /**
     * The data used to update IntegrationActions.
     */
    data: XOR<IntegrationActionUpdateManyMutationInput, IntegrationActionUncheckedUpdateManyInput>
    /**
     * Filter which IntegrationActions to update
     */
    where?: IntegrationActionWhereInput
    /**
     * Limit how many IntegrationActions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationActionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * IntegrationAction upsert
   */
  export type IntegrationActionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationAction
     */
    select?: IntegrationActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationAction
     */
    omit?: IntegrationActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationActionInclude<ExtArgs> | null
    /**
     * The filter to search for the IntegrationAction to update in case it exists.
     */
    where: IntegrationActionWhereUniqueInput
    /**
     * In case the IntegrationAction found by the `where` argument doesn't exist, create a new IntegrationAction with this data.
     */
    create: XOR<IntegrationActionCreateInput, IntegrationActionUncheckedCreateInput>
    /**
     * In case the IntegrationAction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IntegrationActionUpdateInput, IntegrationActionUncheckedUpdateInput>
  }

  /**
   * IntegrationAction delete
   */
  export type IntegrationActionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationAction
     */
    select?: IntegrationActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationAction
     */
    omit?: IntegrationActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationActionInclude<ExtArgs> | null
    /**
     * Filter which IntegrationAction to delete.
     */
    where: IntegrationActionWhereUniqueInput
  }

  /**
   * IntegrationAction deleteMany
   */
  export type IntegrationActionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IntegrationActions to delete
     */
    where?: IntegrationActionWhereInput
    /**
     * Limit how many IntegrationActions to delete.
     */
    limit?: number
  }

  /**
   * IntegrationAction without action
   */
  export type IntegrationActionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationAction
     */
    select?: IntegrationActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationAction
     */
    omit?: IntegrationActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IntegrationActionInclude<ExtArgs> | null
  }


  /**
   * Model Document
   */

  export type AggregateDocument = {
    _count: DocumentCountAggregateOutputType | null
    _avg: DocumentAvgAggregateOutputType | null
    _sum: DocumentSumAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  export type DocumentAvgAggregateOutputType = {
    id: number | null
    size: number | null
  }

  export type DocumentSumAggregateOutputType = {
    id: number | null
    size: number | null
  }

  export type DocumentMinAggregateOutputType = {
    id: number | null
    uuid: string | null
    user_uuid: string | null
    filename: string | null
    mimetype: string | null
    size: number | null
    url: string | null
    path: string | null
    type: $Enums.DocumentType | null
    created_at: Date | null
  }

  export type DocumentMaxAggregateOutputType = {
    id: number | null
    uuid: string | null
    user_uuid: string | null
    filename: string | null
    mimetype: string | null
    size: number | null
    url: string | null
    path: string | null
    type: $Enums.DocumentType | null
    created_at: Date | null
  }

  export type DocumentCountAggregateOutputType = {
    id: number
    uuid: number
    user_uuid: number
    filename: number
    mimetype: number
    size: number
    url: number
    path: number
    type: number
    created_at: number
    _all: number
  }


  export type DocumentAvgAggregateInputType = {
    id?: true
    size?: true
  }

  export type DocumentSumAggregateInputType = {
    id?: true
    size?: true
  }

  export type DocumentMinAggregateInputType = {
    id?: true
    uuid?: true
    user_uuid?: true
    filename?: true
    mimetype?: true
    size?: true
    url?: true
    path?: true
    type?: true
    created_at?: true
  }

  export type DocumentMaxAggregateInputType = {
    id?: true
    uuid?: true
    user_uuid?: true
    filename?: true
    mimetype?: true
    size?: true
    url?: true
    path?: true
    type?: true
    created_at?: true
  }

  export type DocumentCountAggregateInputType = {
    id?: true
    uuid?: true
    user_uuid?: true
    filename?: true
    mimetype?: true
    size?: true
    url?: true
    path?: true
    type?: true
    created_at?: true
    _all?: true
  }

  export type DocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Document to aggregate.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Documents
    **/
    _count?: true | DocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DocumentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DocumentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocumentMaxAggregateInputType
  }

  export type GetDocumentAggregateType<T extends DocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocument[P]>
      : GetScalarType<T[P], AggregateDocument[P]>
  }




  export type DocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithAggregationInput | DocumentOrderByWithAggregationInput[]
    by: DocumentScalarFieldEnum[] | DocumentScalarFieldEnum
    having?: DocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocumentCountAggregateInputType | true
    _avg?: DocumentAvgAggregateInputType
    _sum?: DocumentSumAggregateInputType
    _min?: DocumentMinAggregateInputType
    _max?: DocumentMaxAggregateInputType
  }

  export type DocumentGroupByOutputType = {
    id: number
    uuid: string
    user_uuid: string
    filename: string
    mimetype: string
    size: number
    url: string
    path: string
    type: $Enums.DocumentType
    created_at: Date
    _count: DocumentCountAggregateOutputType | null
    _avg: DocumentAvgAggregateOutputType | null
    _sum: DocumentSumAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  type GetDocumentGroupByPayload<T extends DocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocumentGroupByOutputType[P]>
            : GetScalarType<T[P], DocumentGroupByOutputType[P]>
        }
      >
    >


  export type DocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    user_uuid?: boolean
    filename?: boolean
    mimetype?: boolean
    size?: boolean
    url?: boolean
    path?: boolean
    type?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    user_uuid?: boolean
    filename?: boolean
    mimetype?: boolean
    size?: boolean
    url?: boolean
    path?: boolean
    type?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    user_uuid?: boolean
    filename?: boolean
    mimetype?: boolean
    size?: boolean
    url?: boolean
    path?: boolean
    type?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectScalar = {
    id?: boolean
    uuid?: boolean
    user_uuid?: boolean
    filename?: boolean
    mimetype?: boolean
    size?: boolean
    url?: boolean
    path?: boolean
    type?: boolean
    created_at?: boolean
  }

  export type DocumentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "user_uuid" | "filename" | "mimetype" | "size" | "url" | "path" | "type" | "created_at", ExtArgs["result"]["document"]>

  export type $DocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Document"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uuid: string
      user_uuid: string
      filename: string
      mimetype: string
      size: number
      url: string
      path: string
      type: $Enums.DocumentType
      created_at: Date
    }, ExtArgs["result"]["document"]>
    composites: {}
  }

  type DocumentGetPayload<S extends boolean | null | undefined | DocumentDefaultArgs> = $Result.GetResult<Prisma.$DocumentPayload, S>

  type DocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DocumentCountAggregateInputType | true
    }

  export interface DocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Document'], meta: { name: 'Document' } }
    /**
     * Find zero or one Document that matches the filter.
     * @param {DocumentFindUniqueArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocumentFindUniqueArgs>(args: SelectSubset<T, DocumentFindUniqueArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Document that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DocumentFindUniqueOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, DocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocumentFindFirstArgs>(args?: SelectSubset<T, DocumentFindFirstArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, DocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Documents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Documents
     * const documents = await prisma.document.findMany()
     * 
     * // Get first 10 Documents
     * const documents = await prisma.document.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const documentWithIdOnly = await prisma.document.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DocumentFindManyArgs>(args?: SelectSubset<T, DocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Document.
     * @param {DocumentCreateArgs} args - Arguments to create a Document.
     * @example
     * // Create one Document
     * const Document = await prisma.document.create({
     *   data: {
     *     // ... data to create a Document
     *   }
     * })
     * 
     */
    create<T extends DocumentCreateArgs>(args: SelectSubset<T, DocumentCreateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Documents.
     * @param {DocumentCreateManyArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DocumentCreateManyArgs>(args?: SelectSubset<T, DocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Documents and returns the data saved in the database.
     * @param {DocumentCreateManyAndReturnArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, DocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Document.
     * @param {DocumentDeleteArgs} args - Arguments to delete one Document.
     * @example
     * // Delete one Document
     * const Document = await prisma.document.delete({
     *   where: {
     *     // ... filter to delete one Document
     *   }
     * })
     * 
     */
    delete<T extends DocumentDeleteArgs>(args: SelectSubset<T, DocumentDeleteArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Document.
     * @param {DocumentUpdateArgs} args - Arguments to update one Document.
     * @example
     * // Update one Document
     * const document = await prisma.document.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DocumentUpdateArgs>(args: SelectSubset<T, DocumentUpdateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Documents.
     * @param {DocumentDeleteManyArgs} args - Arguments to filter Documents to delete.
     * @example
     * // Delete a few Documents
     * const { count } = await prisma.document.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DocumentDeleteManyArgs>(args?: SelectSubset<T, DocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DocumentUpdateManyArgs>(args: SelectSubset<T, DocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents and returns the data updated in the database.
     * @param {DocumentUpdateManyAndReturnArgs} args - Arguments to update many Documents.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DocumentUpdateManyAndReturnArgs>(args: SelectSubset<T, DocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Document.
     * @param {DocumentUpsertArgs} args - Arguments to update or create a Document.
     * @example
     * // Update or create a Document
     * const document = await prisma.document.upsert({
     *   create: {
     *     // ... data to create a Document
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Document we want to update
     *   }
     * })
     */
    upsert<T extends DocumentUpsertArgs>(args: SelectSubset<T, DocumentUpsertArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentCountArgs} args - Arguments to filter Documents to count.
     * @example
     * // Count the number of Documents
     * const count = await prisma.document.count({
     *   where: {
     *     // ... the filter for the Documents we want to count
     *   }
     * })
    **/
    count<T extends DocumentCountArgs>(
      args?: Subset<T, DocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DocumentAggregateArgs>(args: Subset<T, DocumentAggregateArgs>): Prisma.PrismaPromise<GetDocumentAggregateType<T>>

    /**
     * Group by Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentGroupByArgs} args - Group by arguments.
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
      T extends DocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DocumentGroupByArgs['orderBy'] }
        : { orderBy?: DocumentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Document model
   */
  readonly fields: DocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Document.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Document model
   */
  interface DocumentFieldRefs {
    readonly id: FieldRef<"Document", 'Int'>
    readonly uuid: FieldRef<"Document", 'String'>
    readonly user_uuid: FieldRef<"Document", 'String'>
    readonly filename: FieldRef<"Document", 'String'>
    readonly mimetype: FieldRef<"Document", 'String'>
    readonly size: FieldRef<"Document", 'Int'>
    readonly url: FieldRef<"Document", 'String'>
    readonly path: FieldRef<"Document", 'String'>
    readonly type: FieldRef<"Document", 'DocumentType'>
    readonly created_at: FieldRef<"Document", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Document findUnique
   */
  export type DocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findUniqueOrThrow
   */
  export type DocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findFirst
   */
  export type DocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findFirstOrThrow
   */
  export type DocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findMany
   */
  export type DocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Filter, which Documents to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document create
   */
  export type DocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data needed to create a Document.
     */
    data: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
  }

  /**
   * Document createMany
   */
  export type DocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Document createManyAndReturn
   */
  export type DocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Document update
   */
  export type DocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data needed to update a Document.
     */
    data: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
    /**
     * Choose, which Document to update.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document updateMany
   */
  export type DocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to update.
     */
    limit?: number
  }

  /**
   * Document updateManyAndReturn
   */
  export type DocumentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to update.
     */
    limit?: number
  }

  /**
   * Document upsert
   */
  export type DocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The filter to search for the Document to update in case it exists.
     */
    where: DocumentWhereUniqueInput
    /**
     * In case the Document found by the `where` argument doesn't exist, create a new Document with this data.
     */
    create: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
    /**
     * In case the Document was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
  }

  /**
   * Document delete
   */
  export type DocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Filter which Document to delete.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document deleteMany
   */
  export type DocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Documents to delete
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to delete.
     */
    limit?: number
  }

  /**
   * Document without action
   */
  export type DocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
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


  export const UserScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    email: 'email',
    phone: 'phone',
    password: 'password',
    role: 'role',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const OrganizationScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    name: 'name',
    slug: 'slug',
    logo_url: 'logo_url',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type OrganizationScalarFieldEnum = (typeof OrganizationScalarFieldEnum)[keyof typeof OrganizationScalarFieldEnum]


  export const OrganizationMemberScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    org_uuid: 'org_uuid',
    user_uuid: 'user_uuid',
    role_uuid: 'role_uuid',
    status: 'status',
    invited_at: 'invited_at',
    joined_at: 'joined_at'
  };

  export type OrganizationMemberScalarFieldEnum = (typeof OrganizationMemberScalarFieldEnum)[keyof typeof OrganizationMemberScalarFieldEnum]


  export const OrganizationRoleScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    org_uuid: 'org_uuid',
    name: 'name',
    is_system: 'is_system'
  };

  export type OrganizationRoleScalarFieldEnum = (typeof OrganizationRoleScalarFieldEnum)[keyof typeof OrganizationRoleScalarFieldEnum]


  export const PermissionScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    key: 'key',
    label: 'label',
    group: 'group'
  };

  export type PermissionScalarFieldEnum = (typeof PermissionScalarFieldEnum)[keyof typeof PermissionScalarFieldEnum]


  export const RolePermissionScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    role_uuid: 'role_uuid',
    permission_uuid: 'permission_uuid'
  };

  export type RolePermissionScalarFieldEnum = (typeof RolePermissionScalarFieldEnum)[keyof typeof RolePermissionScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    org_uuid: 'org_uuid',
    user_uuid: 'user_uuid',
    action: 'action',
    resource_type: 'resource_type',
    resource_id: 'resource_id',
    metadata: 'metadata',
    created_at: 'created_at'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const IntegrationScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    org_uuid: 'org_uuid',
    name: 'name',
    description: 'description',
    provider: 'provider',
    status: 'status',
    config: 'config',
    metadata: 'metadata',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type IntegrationScalarFieldEnum = (typeof IntegrationScalarFieldEnum)[keyof typeof IntegrationScalarFieldEnum]


  export const DatabaseIntegrationScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    integration_uuid: 'integration_uuid',
    db_type: 'db_type',
    connection_string: 'connection_string',
    schema_cache: 'schema_cache',
    allowed_ops: 'allowed_ops',
    last_schema_sync: 'last_schema_sync',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type DatabaseIntegrationScalarFieldEnum = (typeof DatabaseIntegrationScalarFieldEnum)[keyof typeof DatabaseIntegrationScalarFieldEnum]


  export const OpenApiIntegrationScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    integration_uuid: 'integration_uuid',
    spec_url: 'spec_url',
    spec_json: 'spec_json',
    base_url: 'base_url',
    auth_type: 'auth_type',
    auth_config: 'auth_config',
    generated_tools: 'generated_tools',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type OpenApiIntegrationScalarFieldEnum = (typeof OpenApiIntegrationScalarFieldEnum)[keyof typeof OpenApiIntegrationScalarFieldEnum]


  export const McpIntegrationScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    integration_uuid: 'integration_uuid',
    server_url: 'server_url',
    transport_type: 'transport_type',
    auth_type: 'auth_type',
    auth_config: 'auth_config',
    server_name: 'server_name',
    discovered_tools: 'discovered_tools',
    last_tool_sync: 'last_tool_sync',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type McpIntegrationScalarFieldEnum = (typeof McpIntegrationScalarFieldEnum)[keyof typeof McpIntegrationScalarFieldEnum]


  export const IntegrationActionScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    integration_uuid: 'integration_uuid',
    key: 'key',
    label: 'label',
    description: 'description',
    enabled: 'enabled',
    required_permission_key: 'required_permission_key'
  };

  export type IntegrationActionScalarFieldEnum = (typeof IntegrationActionScalarFieldEnum)[keyof typeof IntegrationActionScalarFieldEnum]


  export const DocumentScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    user_uuid: 'user_uuid',
    filename: 'filename',
    mimetype: 'mimetype',
    size: 'size',
    url: 'url',
    path: 'path',
    type: 'type',
    created_at: 'created_at'
  };

  export type DocumentScalarFieldEnum = (typeof DocumentScalarFieldEnum)[keyof typeof DocumentScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'AuthRole'
   */
  export type EnumAuthRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuthRole'>
    


  /**
   * Reference to a field of type 'AuthRole[]'
   */
  export type ListEnumAuthRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuthRole[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'OrganizationMemberStatus'
   */
  export type EnumOrganizationMemberStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrganizationMemberStatus'>
    


  /**
   * Reference to a field of type 'OrganizationMemberStatus[]'
   */
  export type ListEnumOrganizationMemberStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrganizationMemberStatus[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'IntegrationProvider'
   */
  export type EnumIntegrationProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IntegrationProvider'>
    


  /**
   * Reference to a field of type 'IntegrationProvider[]'
   */
  export type ListEnumIntegrationProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IntegrationProvider[]'>
    


  /**
   * Reference to a field of type 'IntegrationStatus'
   */
  export type EnumIntegrationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IntegrationStatus'>
    


  /**
   * Reference to a field of type 'IntegrationStatus[]'
   */
  export type ListEnumIntegrationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IntegrationStatus[]'>
    


  /**
   * Reference to a field of type 'DatabaseType'
   */
  export type EnumDatabaseTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DatabaseType'>
    


  /**
   * Reference to a field of type 'DatabaseType[]'
   */
  export type ListEnumDatabaseTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DatabaseType[]'>
    


  /**
   * Reference to a field of type 'DatabaseOperation[]'
   */
  export type ListEnumDatabaseOperationFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DatabaseOperation[]'>
    


  /**
   * Reference to a field of type 'DatabaseOperation'
   */
  export type EnumDatabaseOperationFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DatabaseOperation'>
    


  /**
   * Reference to a field of type 'OpenApiAuthType'
   */
  export type EnumOpenApiAuthTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OpenApiAuthType'>
    


  /**
   * Reference to a field of type 'OpenApiAuthType[]'
   */
  export type ListEnumOpenApiAuthTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OpenApiAuthType[]'>
    


  /**
   * Reference to a field of type 'McpTransportType'
   */
  export type EnumMcpTransportTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'McpTransportType'>
    


  /**
   * Reference to a field of type 'McpTransportType[]'
   */
  export type ListEnumMcpTransportTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'McpTransportType[]'>
    


  /**
   * Reference to a field of type 'McpAuthType'
   */
  export type EnumMcpAuthTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'McpAuthType'>
    


  /**
   * Reference to a field of type 'McpAuthType[]'
   */
  export type ListEnumMcpAuthTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'McpAuthType[]'>
    


  /**
   * Reference to a field of type 'DocumentType'
   */
  export type EnumDocumentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentType'>
    


  /**
   * Reference to a field of type 'DocumentType[]'
   */
  export type ListEnumDocumentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentType[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    uuid?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    role?: EnumAuthRoleFilter<"User"> | $Enums.AuthRole
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    organization_members?: OrganizationMemberListRelationFilter
    audit_logs?: AuditLogListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    password?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    organization_members?: OrganizationMemberOrderByRelationAggregateInput
    audit_logs?: AuditLogOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    email?: string
    phone?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    role?: EnumAuthRoleFilter<"User"> | $Enums.AuthRole
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    organization_members?: OrganizationMemberListRelationFilter
    audit_logs?: AuditLogListRelationFilter
  }, "id" | "uuid" | "email" | "phone">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    password?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    uuid?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringWithAggregatesFilter<"User"> | string
    role?: EnumAuthRoleWithAggregatesFilter<"User"> | $Enums.AuthRole
    created_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type OrganizationWhereInput = {
    AND?: OrganizationWhereInput | OrganizationWhereInput[]
    OR?: OrganizationWhereInput[]
    NOT?: OrganizationWhereInput | OrganizationWhereInput[]
    id?: IntFilter<"Organization"> | number
    uuid?: StringFilter<"Organization"> | string
    name?: StringFilter<"Organization"> | string
    slug?: StringFilter<"Organization"> | string
    logo_url?: StringNullableFilter<"Organization"> | string | null
    created_at?: DateTimeFilter<"Organization"> | Date | string
    updated_at?: DateTimeFilter<"Organization"> | Date | string
    members?: OrganizationMemberListRelationFilter
    roles?: OrganizationRoleListRelationFilter
    audit_logs?: AuditLogListRelationFilter
    integrations?: IntegrationListRelationFilter
  }

  export type OrganizationOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    logo_url?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    members?: OrganizationMemberOrderByRelationAggregateInput
    roles?: OrganizationRoleOrderByRelationAggregateInput
    audit_logs?: AuditLogOrderByRelationAggregateInput
    integrations?: IntegrationOrderByRelationAggregateInput
  }

  export type OrganizationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    slug?: string
    AND?: OrganizationWhereInput | OrganizationWhereInput[]
    OR?: OrganizationWhereInput[]
    NOT?: OrganizationWhereInput | OrganizationWhereInput[]
    name?: StringFilter<"Organization"> | string
    logo_url?: StringNullableFilter<"Organization"> | string | null
    created_at?: DateTimeFilter<"Organization"> | Date | string
    updated_at?: DateTimeFilter<"Organization"> | Date | string
    members?: OrganizationMemberListRelationFilter
    roles?: OrganizationRoleListRelationFilter
    audit_logs?: AuditLogListRelationFilter
    integrations?: IntegrationListRelationFilter
  }, "id" | "uuid" | "slug">

  export type OrganizationOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    logo_url?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: OrganizationCountOrderByAggregateInput
    _avg?: OrganizationAvgOrderByAggregateInput
    _max?: OrganizationMaxOrderByAggregateInput
    _min?: OrganizationMinOrderByAggregateInput
    _sum?: OrganizationSumOrderByAggregateInput
  }

  export type OrganizationScalarWhereWithAggregatesInput = {
    AND?: OrganizationScalarWhereWithAggregatesInput | OrganizationScalarWhereWithAggregatesInput[]
    OR?: OrganizationScalarWhereWithAggregatesInput[]
    NOT?: OrganizationScalarWhereWithAggregatesInput | OrganizationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Organization"> | number
    uuid?: StringWithAggregatesFilter<"Organization"> | string
    name?: StringWithAggregatesFilter<"Organization"> | string
    slug?: StringWithAggregatesFilter<"Organization"> | string
    logo_url?: StringNullableWithAggregatesFilter<"Organization"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Organization"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Organization"> | Date | string
  }

  export type OrganizationMemberWhereInput = {
    AND?: OrganizationMemberWhereInput | OrganizationMemberWhereInput[]
    OR?: OrganizationMemberWhereInput[]
    NOT?: OrganizationMemberWhereInput | OrganizationMemberWhereInput[]
    id?: IntFilter<"OrganizationMember"> | number
    uuid?: StringFilter<"OrganizationMember"> | string
    org_uuid?: StringFilter<"OrganizationMember"> | string
    user_uuid?: StringFilter<"OrganizationMember"> | string
    role_uuid?: StringFilter<"OrganizationMember"> | string
    status?: EnumOrganizationMemberStatusFilter<"OrganizationMember"> | $Enums.OrganizationMemberStatus
    invited_at?: DateTimeFilter<"OrganizationMember"> | Date | string
    joined_at?: DateTimeNullableFilter<"OrganizationMember"> | Date | string | null
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    role?: XOR<OrganizationRoleScalarRelationFilter, OrganizationRoleWhereInput>
  }

  export type OrganizationMemberOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    org_uuid?: SortOrder
    user_uuid?: SortOrder
    role_uuid?: SortOrder
    status?: SortOrder
    invited_at?: SortOrder
    joined_at?: SortOrderInput | SortOrder
    organization?: OrganizationOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    role?: OrganizationRoleOrderByWithRelationInput
  }

  export type OrganizationMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    org_uuid_user_uuid?: OrganizationMemberOrg_uuidUser_uuidCompoundUniqueInput
    AND?: OrganizationMemberWhereInput | OrganizationMemberWhereInput[]
    OR?: OrganizationMemberWhereInput[]
    NOT?: OrganizationMemberWhereInput | OrganizationMemberWhereInput[]
    org_uuid?: StringFilter<"OrganizationMember"> | string
    user_uuid?: StringFilter<"OrganizationMember"> | string
    role_uuid?: StringFilter<"OrganizationMember"> | string
    status?: EnumOrganizationMemberStatusFilter<"OrganizationMember"> | $Enums.OrganizationMemberStatus
    invited_at?: DateTimeFilter<"OrganizationMember"> | Date | string
    joined_at?: DateTimeNullableFilter<"OrganizationMember"> | Date | string | null
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    role?: XOR<OrganizationRoleScalarRelationFilter, OrganizationRoleWhereInput>
  }, "id" | "uuid" | "org_uuid_user_uuid">

  export type OrganizationMemberOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    org_uuid?: SortOrder
    user_uuid?: SortOrder
    role_uuid?: SortOrder
    status?: SortOrder
    invited_at?: SortOrder
    joined_at?: SortOrderInput | SortOrder
    _count?: OrganizationMemberCountOrderByAggregateInput
    _avg?: OrganizationMemberAvgOrderByAggregateInput
    _max?: OrganizationMemberMaxOrderByAggregateInput
    _min?: OrganizationMemberMinOrderByAggregateInput
    _sum?: OrganizationMemberSumOrderByAggregateInput
  }

  export type OrganizationMemberScalarWhereWithAggregatesInput = {
    AND?: OrganizationMemberScalarWhereWithAggregatesInput | OrganizationMemberScalarWhereWithAggregatesInput[]
    OR?: OrganizationMemberScalarWhereWithAggregatesInput[]
    NOT?: OrganizationMemberScalarWhereWithAggregatesInput | OrganizationMemberScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"OrganizationMember"> | number
    uuid?: StringWithAggregatesFilter<"OrganizationMember"> | string
    org_uuid?: StringWithAggregatesFilter<"OrganizationMember"> | string
    user_uuid?: StringWithAggregatesFilter<"OrganizationMember"> | string
    role_uuid?: StringWithAggregatesFilter<"OrganizationMember"> | string
    status?: EnumOrganizationMemberStatusWithAggregatesFilter<"OrganizationMember"> | $Enums.OrganizationMemberStatus
    invited_at?: DateTimeWithAggregatesFilter<"OrganizationMember"> | Date | string
    joined_at?: DateTimeNullableWithAggregatesFilter<"OrganizationMember"> | Date | string | null
  }

  export type OrganizationRoleWhereInput = {
    AND?: OrganizationRoleWhereInput | OrganizationRoleWhereInput[]
    OR?: OrganizationRoleWhereInput[]
    NOT?: OrganizationRoleWhereInput | OrganizationRoleWhereInput[]
    id?: IntFilter<"OrganizationRole"> | number
    uuid?: StringFilter<"OrganizationRole"> | string
    org_uuid?: StringFilter<"OrganizationRole"> | string
    name?: StringFilter<"OrganizationRole"> | string
    is_system?: BoolFilter<"OrganizationRole"> | boolean
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    members?: OrganizationMemberListRelationFilter
    permissions?: RolePermissionListRelationFilter
  }

  export type OrganizationRoleOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    org_uuid?: SortOrder
    name?: SortOrder
    is_system?: SortOrder
    organization?: OrganizationOrderByWithRelationInput
    members?: OrganizationMemberOrderByRelationAggregateInput
    permissions?: RolePermissionOrderByRelationAggregateInput
  }

  export type OrganizationRoleWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    org_uuid_name?: OrganizationRoleOrg_uuidNameCompoundUniqueInput
    AND?: OrganizationRoleWhereInput | OrganizationRoleWhereInput[]
    OR?: OrganizationRoleWhereInput[]
    NOT?: OrganizationRoleWhereInput | OrganizationRoleWhereInput[]
    org_uuid?: StringFilter<"OrganizationRole"> | string
    name?: StringFilter<"OrganizationRole"> | string
    is_system?: BoolFilter<"OrganizationRole"> | boolean
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    members?: OrganizationMemberListRelationFilter
    permissions?: RolePermissionListRelationFilter
  }, "id" | "uuid" | "org_uuid_name">

  export type OrganizationRoleOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    org_uuid?: SortOrder
    name?: SortOrder
    is_system?: SortOrder
    _count?: OrganizationRoleCountOrderByAggregateInput
    _avg?: OrganizationRoleAvgOrderByAggregateInput
    _max?: OrganizationRoleMaxOrderByAggregateInput
    _min?: OrganizationRoleMinOrderByAggregateInput
    _sum?: OrganizationRoleSumOrderByAggregateInput
  }

  export type OrganizationRoleScalarWhereWithAggregatesInput = {
    AND?: OrganizationRoleScalarWhereWithAggregatesInput | OrganizationRoleScalarWhereWithAggregatesInput[]
    OR?: OrganizationRoleScalarWhereWithAggregatesInput[]
    NOT?: OrganizationRoleScalarWhereWithAggregatesInput | OrganizationRoleScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"OrganizationRole"> | number
    uuid?: StringWithAggregatesFilter<"OrganizationRole"> | string
    org_uuid?: StringWithAggregatesFilter<"OrganizationRole"> | string
    name?: StringWithAggregatesFilter<"OrganizationRole"> | string
    is_system?: BoolWithAggregatesFilter<"OrganizationRole"> | boolean
  }

  export type PermissionWhereInput = {
    AND?: PermissionWhereInput | PermissionWhereInput[]
    OR?: PermissionWhereInput[]
    NOT?: PermissionWhereInput | PermissionWhereInput[]
    id?: IntFilter<"Permission"> | number
    uuid?: StringFilter<"Permission"> | string
    key?: StringFilter<"Permission"> | string
    label?: StringFilter<"Permission"> | string
    group?: StringFilter<"Permission"> | string
    roles?: RolePermissionListRelationFilter
  }

  export type PermissionOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    key?: SortOrder
    label?: SortOrder
    group?: SortOrder
    roles?: RolePermissionOrderByRelationAggregateInput
  }

  export type PermissionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    key?: string
    AND?: PermissionWhereInput | PermissionWhereInput[]
    OR?: PermissionWhereInput[]
    NOT?: PermissionWhereInput | PermissionWhereInput[]
    label?: StringFilter<"Permission"> | string
    group?: StringFilter<"Permission"> | string
    roles?: RolePermissionListRelationFilter
  }, "id" | "uuid" | "key">

  export type PermissionOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    key?: SortOrder
    label?: SortOrder
    group?: SortOrder
    _count?: PermissionCountOrderByAggregateInput
    _avg?: PermissionAvgOrderByAggregateInput
    _max?: PermissionMaxOrderByAggregateInput
    _min?: PermissionMinOrderByAggregateInput
    _sum?: PermissionSumOrderByAggregateInput
  }

  export type PermissionScalarWhereWithAggregatesInput = {
    AND?: PermissionScalarWhereWithAggregatesInput | PermissionScalarWhereWithAggregatesInput[]
    OR?: PermissionScalarWhereWithAggregatesInput[]
    NOT?: PermissionScalarWhereWithAggregatesInput | PermissionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Permission"> | number
    uuid?: StringWithAggregatesFilter<"Permission"> | string
    key?: StringWithAggregatesFilter<"Permission"> | string
    label?: StringWithAggregatesFilter<"Permission"> | string
    group?: StringWithAggregatesFilter<"Permission"> | string
  }

  export type RolePermissionWhereInput = {
    AND?: RolePermissionWhereInput | RolePermissionWhereInput[]
    OR?: RolePermissionWhereInput[]
    NOT?: RolePermissionWhereInput | RolePermissionWhereInput[]
    id?: IntFilter<"RolePermission"> | number
    uuid?: StringFilter<"RolePermission"> | string
    role_uuid?: StringFilter<"RolePermission"> | string
    permission_uuid?: StringFilter<"RolePermission"> | string
    role?: XOR<OrganizationRoleScalarRelationFilter, OrganizationRoleWhereInput>
    permission?: XOR<PermissionScalarRelationFilter, PermissionWhereInput>
  }

  export type RolePermissionOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    role_uuid?: SortOrder
    permission_uuid?: SortOrder
    role?: OrganizationRoleOrderByWithRelationInput
    permission?: PermissionOrderByWithRelationInput
  }

  export type RolePermissionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    role_uuid_permission_uuid?: RolePermissionRole_uuidPermission_uuidCompoundUniqueInput
    AND?: RolePermissionWhereInput | RolePermissionWhereInput[]
    OR?: RolePermissionWhereInput[]
    NOT?: RolePermissionWhereInput | RolePermissionWhereInput[]
    role_uuid?: StringFilter<"RolePermission"> | string
    permission_uuid?: StringFilter<"RolePermission"> | string
    role?: XOR<OrganizationRoleScalarRelationFilter, OrganizationRoleWhereInput>
    permission?: XOR<PermissionScalarRelationFilter, PermissionWhereInput>
  }, "id" | "uuid" | "role_uuid_permission_uuid">

  export type RolePermissionOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    role_uuid?: SortOrder
    permission_uuid?: SortOrder
    _count?: RolePermissionCountOrderByAggregateInput
    _avg?: RolePermissionAvgOrderByAggregateInput
    _max?: RolePermissionMaxOrderByAggregateInput
    _min?: RolePermissionMinOrderByAggregateInput
    _sum?: RolePermissionSumOrderByAggregateInput
  }

  export type RolePermissionScalarWhereWithAggregatesInput = {
    AND?: RolePermissionScalarWhereWithAggregatesInput | RolePermissionScalarWhereWithAggregatesInput[]
    OR?: RolePermissionScalarWhereWithAggregatesInput[]
    NOT?: RolePermissionScalarWhereWithAggregatesInput | RolePermissionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"RolePermission"> | number
    uuid?: StringWithAggregatesFilter<"RolePermission"> | string
    role_uuid?: StringWithAggregatesFilter<"RolePermission"> | string
    permission_uuid?: StringWithAggregatesFilter<"RolePermission"> | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: IntFilter<"AuditLog"> | number
    uuid?: StringFilter<"AuditLog"> | string
    org_uuid?: StringFilter<"AuditLog"> | string
    user_uuid?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    resource_type?: StringFilter<"AuditLog"> | string
    resource_id?: StringNullableFilter<"AuditLog"> | string | null
    metadata?: JsonFilter<"AuditLog">
    created_at?: DateTimeFilter<"AuditLog"> | Date | string
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    org_uuid?: SortOrder
    user_uuid?: SortOrder
    action?: SortOrder
    resource_type?: SortOrder
    resource_id?: SortOrderInput | SortOrder
    metadata?: SortOrder
    created_at?: SortOrder
    organization?: OrganizationOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    org_uuid?: StringFilter<"AuditLog"> | string
    user_uuid?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    resource_type?: StringFilter<"AuditLog"> | string
    resource_id?: StringNullableFilter<"AuditLog"> | string | null
    metadata?: JsonFilter<"AuditLog">
    created_at?: DateTimeFilter<"AuditLog"> | Date | string
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "uuid">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    org_uuid?: SortOrder
    user_uuid?: SortOrder
    action?: SortOrder
    resource_type?: SortOrder
    resource_id?: SortOrderInput | SortOrder
    metadata?: SortOrder
    created_at?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _avg?: AuditLogAvgOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
    _sum?: AuditLogSumOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"AuditLog"> | number
    uuid?: StringWithAggregatesFilter<"AuditLog"> | string
    org_uuid?: StringWithAggregatesFilter<"AuditLog"> | string
    user_uuid?: StringWithAggregatesFilter<"AuditLog"> | string
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    resource_type?: StringWithAggregatesFilter<"AuditLog"> | string
    resource_id?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    metadata?: JsonWithAggregatesFilter<"AuditLog">
    created_at?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type IntegrationWhereInput = {
    AND?: IntegrationWhereInput | IntegrationWhereInput[]
    OR?: IntegrationWhereInput[]
    NOT?: IntegrationWhereInput | IntegrationWhereInput[]
    id?: IntFilter<"Integration"> | number
    uuid?: StringFilter<"Integration"> | string
    org_uuid?: StringFilter<"Integration"> | string
    name?: StringFilter<"Integration"> | string
    description?: StringNullableFilter<"Integration"> | string | null
    provider?: EnumIntegrationProviderFilter<"Integration"> | $Enums.IntegrationProvider
    status?: EnumIntegrationStatusFilter<"Integration"> | $Enums.IntegrationStatus
    config?: StringFilter<"Integration"> | string
    metadata?: JsonNullableFilter<"Integration">
    created_at?: DateTimeFilter<"Integration"> | Date | string
    updated_at?: DateTimeFilter<"Integration"> | Date | string
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    actions?: IntegrationActionListRelationFilter
    database?: XOR<DatabaseIntegrationNullableScalarRelationFilter, DatabaseIntegrationWhereInput> | null
    openapi?: XOR<OpenApiIntegrationNullableScalarRelationFilter, OpenApiIntegrationWhereInput> | null
    mcp?: XOR<McpIntegrationNullableScalarRelationFilter, McpIntegrationWhereInput> | null
  }

  export type IntegrationOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    org_uuid?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    provider?: SortOrder
    status?: SortOrder
    config?: SortOrder
    metadata?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    organization?: OrganizationOrderByWithRelationInput
    actions?: IntegrationActionOrderByRelationAggregateInput
    database?: DatabaseIntegrationOrderByWithRelationInput
    openapi?: OpenApiIntegrationOrderByWithRelationInput
    mcp?: McpIntegrationOrderByWithRelationInput
  }

  export type IntegrationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    AND?: IntegrationWhereInput | IntegrationWhereInput[]
    OR?: IntegrationWhereInput[]
    NOT?: IntegrationWhereInput | IntegrationWhereInput[]
    org_uuid?: StringFilter<"Integration"> | string
    name?: StringFilter<"Integration"> | string
    description?: StringNullableFilter<"Integration"> | string | null
    provider?: EnumIntegrationProviderFilter<"Integration"> | $Enums.IntegrationProvider
    status?: EnumIntegrationStatusFilter<"Integration"> | $Enums.IntegrationStatus
    config?: StringFilter<"Integration"> | string
    metadata?: JsonNullableFilter<"Integration">
    created_at?: DateTimeFilter<"Integration"> | Date | string
    updated_at?: DateTimeFilter<"Integration"> | Date | string
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    actions?: IntegrationActionListRelationFilter
    database?: XOR<DatabaseIntegrationNullableScalarRelationFilter, DatabaseIntegrationWhereInput> | null
    openapi?: XOR<OpenApiIntegrationNullableScalarRelationFilter, OpenApiIntegrationWhereInput> | null
    mcp?: XOR<McpIntegrationNullableScalarRelationFilter, McpIntegrationWhereInput> | null
  }, "id" | "uuid">

  export type IntegrationOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    org_uuid?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    provider?: SortOrder
    status?: SortOrder
    config?: SortOrder
    metadata?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: IntegrationCountOrderByAggregateInput
    _avg?: IntegrationAvgOrderByAggregateInput
    _max?: IntegrationMaxOrderByAggregateInput
    _min?: IntegrationMinOrderByAggregateInput
    _sum?: IntegrationSumOrderByAggregateInput
  }

  export type IntegrationScalarWhereWithAggregatesInput = {
    AND?: IntegrationScalarWhereWithAggregatesInput | IntegrationScalarWhereWithAggregatesInput[]
    OR?: IntegrationScalarWhereWithAggregatesInput[]
    NOT?: IntegrationScalarWhereWithAggregatesInput | IntegrationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Integration"> | number
    uuid?: StringWithAggregatesFilter<"Integration"> | string
    org_uuid?: StringWithAggregatesFilter<"Integration"> | string
    name?: StringWithAggregatesFilter<"Integration"> | string
    description?: StringNullableWithAggregatesFilter<"Integration"> | string | null
    provider?: EnumIntegrationProviderWithAggregatesFilter<"Integration"> | $Enums.IntegrationProvider
    status?: EnumIntegrationStatusWithAggregatesFilter<"Integration"> | $Enums.IntegrationStatus
    config?: StringWithAggregatesFilter<"Integration"> | string
    metadata?: JsonNullableWithAggregatesFilter<"Integration">
    created_at?: DateTimeWithAggregatesFilter<"Integration"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Integration"> | Date | string
  }

  export type DatabaseIntegrationWhereInput = {
    AND?: DatabaseIntegrationWhereInput | DatabaseIntegrationWhereInput[]
    OR?: DatabaseIntegrationWhereInput[]
    NOT?: DatabaseIntegrationWhereInput | DatabaseIntegrationWhereInput[]
    id?: IntFilter<"DatabaseIntegration"> | number
    uuid?: StringFilter<"DatabaseIntegration"> | string
    integration_uuid?: StringFilter<"DatabaseIntegration"> | string
    db_type?: EnumDatabaseTypeFilter<"DatabaseIntegration"> | $Enums.DatabaseType
    connection_string?: StringFilter<"DatabaseIntegration"> | string
    schema_cache?: JsonNullableFilter<"DatabaseIntegration">
    allowed_ops?: EnumDatabaseOperationNullableListFilter<"DatabaseIntegration">
    last_schema_sync?: DateTimeNullableFilter<"DatabaseIntegration"> | Date | string | null
    created_at?: DateTimeFilter<"DatabaseIntegration"> | Date | string
    updated_at?: DateTimeFilter<"DatabaseIntegration"> | Date | string
    integration?: XOR<IntegrationScalarRelationFilter, IntegrationWhereInput>
  }

  export type DatabaseIntegrationOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    integration_uuid?: SortOrder
    db_type?: SortOrder
    connection_string?: SortOrder
    schema_cache?: SortOrderInput | SortOrder
    allowed_ops?: SortOrder
    last_schema_sync?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    integration?: IntegrationOrderByWithRelationInput
  }

  export type DatabaseIntegrationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    integration_uuid?: string
    AND?: DatabaseIntegrationWhereInput | DatabaseIntegrationWhereInput[]
    OR?: DatabaseIntegrationWhereInput[]
    NOT?: DatabaseIntegrationWhereInput | DatabaseIntegrationWhereInput[]
    db_type?: EnumDatabaseTypeFilter<"DatabaseIntegration"> | $Enums.DatabaseType
    connection_string?: StringFilter<"DatabaseIntegration"> | string
    schema_cache?: JsonNullableFilter<"DatabaseIntegration">
    allowed_ops?: EnumDatabaseOperationNullableListFilter<"DatabaseIntegration">
    last_schema_sync?: DateTimeNullableFilter<"DatabaseIntegration"> | Date | string | null
    created_at?: DateTimeFilter<"DatabaseIntegration"> | Date | string
    updated_at?: DateTimeFilter<"DatabaseIntegration"> | Date | string
    integration?: XOR<IntegrationScalarRelationFilter, IntegrationWhereInput>
  }, "id" | "uuid" | "integration_uuid">

  export type DatabaseIntegrationOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    integration_uuid?: SortOrder
    db_type?: SortOrder
    connection_string?: SortOrder
    schema_cache?: SortOrderInput | SortOrder
    allowed_ops?: SortOrder
    last_schema_sync?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: DatabaseIntegrationCountOrderByAggregateInput
    _avg?: DatabaseIntegrationAvgOrderByAggregateInput
    _max?: DatabaseIntegrationMaxOrderByAggregateInput
    _min?: DatabaseIntegrationMinOrderByAggregateInput
    _sum?: DatabaseIntegrationSumOrderByAggregateInput
  }

  export type DatabaseIntegrationScalarWhereWithAggregatesInput = {
    AND?: DatabaseIntegrationScalarWhereWithAggregatesInput | DatabaseIntegrationScalarWhereWithAggregatesInput[]
    OR?: DatabaseIntegrationScalarWhereWithAggregatesInput[]
    NOT?: DatabaseIntegrationScalarWhereWithAggregatesInput | DatabaseIntegrationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"DatabaseIntegration"> | number
    uuid?: StringWithAggregatesFilter<"DatabaseIntegration"> | string
    integration_uuid?: StringWithAggregatesFilter<"DatabaseIntegration"> | string
    db_type?: EnumDatabaseTypeWithAggregatesFilter<"DatabaseIntegration"> | $Enums.DatabaseType
    connection_string?: StringWithAggregatesFilter<"DatabaseIntegration"> | string
    schema_cache?: JsonNullableWithAggregatesFilter<"DatabaseIntegration">
    allowed_ops?: EnumDatabaseOperationNullableListFilter<"DatabaseIntegration">
    last_schema_sync?: DateTimeNullableWithAggregatesFilter<"DatabaseIntegration"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"DatabaseIntegration"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"DatabaseIntegration"> | Date | string
  }

  export type OpenApiIntegrationWhereInput = {
    AND?: OpenApiIntegrationWhereInput | OpenApiIntegrationWhereInput[]
    OR?: OpenApiIntegrationWhereInput[]
    NOT?: OpenApiIntegrationWhereInput | OpenApiIntegrationWhereInput[]
    id?: IntFilter<"OpenApiIntegration"> | number
    uuid?: StringFilter<"OpenApiIntegration"> | string
    integration_uuid?: StringFilter<"OpenApiIntegration"> | string
    spec_url?: StringNullableFilter<"OpenApiIntegration"> | string | null
    spec_json?: JsonFilter<"OpenApiIntegration">
    base_url?: StringFilter<"OpenApiIntegration"> | string
    auth_type?: EnumOpenApiAuthTypeFilter<"OpenApiIntegration"> | $Enums.OpenApiAuthType
    auth_config?: StringFilter<"OpenApiIntegration"> | string
    generated_tools?: JsonFilter<"OpenApiIntegration">
    created_at?: DateTimeFilter<"OpenApiIntegration"> | Date | string
    updated_at?: DateTimeFilter<"OpenApiIntegration"> | Date | string
    integration?: XOR<IntegrationScalarRelationFilter, IntegrationWhereInput>
  }

  export type OpenApiIntegrationOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    integration_uuid?: SortOrder
    spec_url?: SortOrderInput | SortOrder
    spec_json?: SortOrder
    base_url?: SortOrder
    auth_type?: SortOrder
    auth_config?: SortOrder
    generated_tools?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    integration?: IntegrationOrderByWithRelationInput
  }

  export type OpenApiIntegrationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    integration_uuid?: string
    AND?: OpenApiIntegrationWhereInput | OpenApiIntegrationWhereInput[]
    OR?: OpenApiIntegrationWhereInput[]
    NOT?: OpenApiIntegrationWhereInput | OpenApiIntegrationWhereInput[]
    spec_url?: StringNullableFilter<"OpenApiIntegration"> | string | null
    spec_json?: JsonFilter<"OpenApiIntegration">
    base_url?: StringFilter<"OpenApiIntegration"> | string
    auth_type?: EnumOpenApiAuthTypeFilter<"OpenApiIntegration"> | $Enums.OpenApiAuthType
    auth_config?: StringFilter<"OpenApiIntegration"> | string
    generated_tools?: JsonFilter<"OpenApiIntegration">
    created_at?: DateTimeFilter<"OpenApiIntegration"> | Date | string
    updated_at?: DateTimeFilter<"OpenApiIntegration"> | Date | string
    integration?: XOR<IntegrationScalarRelationFilter, IntegrationWhereInput>
  }, "id" | "uuid" | "integration_uuid">

  export type OpenApiIntegrationOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    integration_uuid?: SortOrder
    spec_url?: SortOrderInput | SortOrder
    spec_json?: SortOrder
    base_url?: SortOrder
    auth_type?: SortOrder
    auth_config?: SortOrder
    generated_tools?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: OpenApiIntegrationCountOrderByAggregateInput
    _avg?: OpenApiIntegrationAvgOrderByAggregateInput
    _max?: OpenApiIntegrationMaxOrderByAggregateInput
    _min?: OpenApiIntegrationMinOrderByAggregateInput
    _sum?: OpenApiIntegrationSumOrderByAggregateInput
  }

  export type OpenApiIntegrationScalarWhereWithAggregatesInput = {
    AND?: OpenApiIntegrationScalarWhereWithAggregatesInput | OpenApiIntegrationScalarWhereWithAggregatesInput[]
    OR?: OpenApiIntegrationScalarWhereWithAggregatesInput[]
    NOT?: OpenApiIntegrationScalarWhereWithAggregatesInput | OpenApiIntegrationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"OpenApiIntegration"> | number
    uuid?: StringWithAggregatesFilter<"OpenApiIntegration"> | string
    integration_uuid?: StringWithAggregatesFilter<"OpenApiIntegration"> | string
    spec_url?: StringNullableWithAggregatesFilter<"OpenApiIntegration"> | string | null
    spec_json?: JsonWithAggregatesFilter<"OpenApiIntegration">
    base_url?: StringWithAggregatesFilter<"OpenApiIntegration"> | string
    auth_type?: EnumOpenApiAuthTypeWithAggregatesFilter<"OpenApiIntegration"> | $Enums.OpenApiAuthType
    auth_config?: StringWithAggregatesFilter<"OpenApiIntegration"> | string
    generated_tools?: JsonWithAggregatesFilter<"OpenApiIntegration">
    created_at?: DateTimeWithAggregatesFilter<"OpenApiIntegration"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"OpenApiIntegration"> | Date | string
  }

  export type McpIntegrationWhereInput = {
    AND?: McpIntegrationWhereInput | McpIntegrationWhereInput[]
    OR?: McpIntegrationWhereInput[]
    NOT?: McpIntegrationWhereInput | McpIntegrationWhereInput[]
    id?: IntFilter<"McpIntegration"> | number
    uuid?: StringFilter<"McpIntegration"> | string
    integration_uuid?: StringFilter<"McpIntegration"> | string
    server_url?: StringFilter<"McpIntegration"> | string
    transport_type?: EnumMcpTransportTypeFilter<"McpIntegration"> | $Enums.McpTransportType
    auth_type?: EnumMcpAuthTypeFilter<"McpIntegration"> | $Enums.McpAuthType
    auth_config?: StringFilter<"McpIntegration"> | string
    server_name?: StringNullableFilter<"McpIntegration"> | string | null
    discovered_tools?: JsonFilter<"McpIntegration">
    last_tool_sync?: DateTimeNullableFilter<"McpIntegration"> | Date | string | null
    created_at?: DateTimeFilter<"McpIntegration"> | Date | string
    updated_at?: DateTimeFilter<"McpIntegration"> | Date | string
    integration?: XOR<IntegrationScalarRelationFilter, IntegrationWhereInput>
  }

  export type McpIntegrationOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    integration_uuid?: SortOrder
    server_url?: SortOrder
    transport_type?: SortOrder
    auth_type?: SortOrder
    auth_config?: SortOrder
    server_name?: SortOrderInput | SortOrder
    discovered_tools?: SortOrder
    last_tool_sync?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    integration?: IntegrationOrderByWithRelationInput
  }

  export type McpIntegrationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    integration_uuid?: string
    AND?: McpIntegrationWhereInput | McpIntegrationWhereInput[]
    OR?: McpIntegrationWhereInput[]
    NOT?: McpIntegrationWhereInput | McpIntegrationWhereInput[]
    server_url?: StringFilter<"McpIntegration"> | string
    transport_type?: EnumMcpTransportTypeFilter<"McpIntegration"> | $Enums.McpTransportType
    auth_type?: EnumMcpAuthTypeFilter<"McpIntegration"> | $Enums.McpAuthType
    auth_config?: StringFilter<"McpIntegration"> | string
    server_name?: StringNullableFilter<"McpIntegration"> | string | null
    discovered_tools?: JsonFilter<"McpIntegration">
    last_tool_sync?: DateTimeNullableFilter<"McpIntegration"> | Date | string | null
    created_at?: DateTimeFilter<"McpIntegration"> | Date | string
    updated_at?: DateTimeFilter<"McpIntegration"> | Date | string
    integration?: XOR<IntegrationScalarRelationFilter, IntegrationWhereInput>
  }, "id" | "uuid" | "integration_uuid">

  export type McpIntegrationOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    integration_uuid?: SortOrder
    server_url?: SortOrder
    transport_type?: SortOrder
    auth_type?: SortOrder
    auth_config?: SortOrder
    server_name?: SortOrderInput | SortOrder
    discovered_tools?: SortOrder
    last_tool_sync?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: McpIntegrationCountOrderByAggregateInput
    _avg?: McpIntegrationAvgOrderByAggregateInput
    _max?: McpIntegrationMaxOrderByAggregateInput
    _min?: McpIntegrationMinOrderByAggregateInput
    _sum?: McpIntegrationSumOrderByAggregateInput
  }

  export type McpIntegrationScalarWhereWithAggregatesInput = {
    AND?: McpIntegrationScalarWhereWithAggregatesInput | McpIntegrationScalarWhereWithAggregatesInput[]
    OR?: McpIntegrationScalarWhereWithAggregatesInput[]
    NOT?: McpIntegrationScalarWhereWithAggregatesInput | McpIntegrationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"McpIntegration"> | number
    uuid?: StringWithAggregatesFilter<"McpIntegration"> | string
    integration_uuid?: StringWithAggregatesFilter<"McpIntegration"> | string
    server_url?: StringWithAggregatesFilter<"McpIntegration"> | string
    transport_type?: EnumMcpTransportTypeWithAggregatesFilter<"McpIntegration"> | $Enums.McpTransportType
    auth_type?: EnumMcpAuthTypeWithAggregatesFilter<"McpIntegration"> | $Enums.McpAuthType
    auth_config?: StringWithAggregatesFilter<"McpIntegration"> | string
    server_name?: StringNullableWithAggregatesFilter<"McpIntegration"> | string | null
    discovered_tools?: JsonWithAggregatesFilter<"McpIntegration">
    last_tool_sync?: DateTimeNullableWithAggregatesFilter<"McpIntegration"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"McpIntegration"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"McpIntegration"> | Date | string
  }

  export type IntegrationActionWhereInput = {
    AND?: IntegrationActionWhereInput | IntegrationActionWhereInput[]
    OR?: IntegrationActionWhereInput[]
    NOT?: IntegrationActionWhereInput | IntegrationActionWhereInput[]
    id?: IntFilter<"IntegrationAction"> | number
    uuid?: StringFilter<"IntegrationAction"> | string
    integration_uuid?: StringFilter<"IntegrationAction"> | string
    key?: StringFilter<"IntegrationAction"> | string
    label?: StringFilter<"IntegrationAction"> | string
    description?: StringFilter<"IntegrationAction"> | string
    enabled?: BoolFilter<"IntegrationAction"> | boolean
    required_permission_key?: StringNullableFilter<"IntegrationAction"> | string | null
    integration?: XOR<IntegrationScalarRelationFilter, IntegrationWhereInput>
  }

  export type IntegrationActionOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    integration_uuid?: SortOrder
    key?: SortOrder
    label?: SortOrder
    description?: SortOrder
    enabled?: SortOrder
    required_permission_key?: SortOrderInput | SortOrder
    integration?: IntegrationOrderByWithRelationInput
  }

  export type IntegrationActionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    integration_uuid_key?: IntegrationActionIntegration_uuidKeyCompoundUniqueInput
    uuid_integration_uuid?: IntegrationActionUuidIntegration_uuidCompoundUniqueInput
    AND?: IntegrationActionWhereInput | IntegrationActionWhereInput[]
    OR?: IntegrationActionWhereInput[]
    NOT?: IntegrationActionWhereInput | IntegrationActionWhereInput[]
    integration_uuid?: StringFilter<"IntegrationAction"> | string
    key?: StringFilter<"IntegrationAction"> | string
    label?: StringFilter<"IntegrationAction"> | string
    description?: StringFilter<"IntegrationAction"> | string
    enabled?: BoolFilter<"IntegrationAction"> | boolean
    required_permission_key?: StringNullableFilter<"IntegrationAction"> | string | null
    integration?: XOR<IntegrationScalarRelationFilter, IntegrationWhereInput>
  }, "id" | "uuid" | "integration_uuid_key" | "uuid_integration_uuid">

  export type IntegrationActionOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    integration_uuid?: SortOrder
    key?: SortOrder
    label?: SortOrder
    description?: SortOrder
    enabled?: SortOrder
    required_permission_key?: SortOrderInput | SortOrder
    _count?: IntegrationActionCountOrderByAggregateInput
    _avg?: IntegrationActionAvgOrderByAggregateInput
    _max?: IntegrationActionMaxOrderByAggregateInput
    _min?: IntegrationActionMinOrderByAggregateInput
    _sum?: IntegrationActionSumOrderByAggregateInput
  }

  export type IntegrationActionScalarWhereWithAggregatesInput = {
    AND?: IntegrationActionScalarWhereWithAggregatesInput | IntegrationActionScalarWhereWithAggregatesInput[]
    OR?: IntegrationActionScalarWhereWithAggregatesInput[]
    NOT?: IntegrationActionScalarWhereWithAggregatesInput | IntegrationActionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"IntegrationAction"> | number
    uuid?: StringWithAggregatesFilter<"IntegrationAction"> | string
    integration_uuid?: StringWithAggregatesFilter<"IntegrationAction"> | string
    key?: StringWithAggregatesFilter<"IntegrationAction"> | string
    label?: StringWithAggregatesFilter<"IntegrationAction"> | string
    description?: StringWithAggregatesFilter<"IntegrationAction"> | string
    enabled?: BoolWithAggregatesFilter<"IntegrationAction"> | boolean
    required_permission_key?: StringNullableWithAggregatesFilter<"IntegrationAction"> | string | null
  }

  export type DocumentWhereInput = {
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    id?: IntFilter<"Document"> | number
    uuid?: StringFilter<"Document"> | string
    user_uuid?: StringFilter<"Document"> | string
    filename?: StringFilter<"Document"> | string
    mimetype?: StringFilter<"Document"> | string
    size?: IntFilter<"Document"> | number
    url?: StringFilter<"Document"> | string
    path?: StringFilter<"Document"> | string
    type?: EnumDocumentTypeFilter<"Document"> | $Enums.DocumentType
    created_at?: DateTimeFilter<"Document"> | Date | string
  }

  export type DocumentOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    user_uuid?: SortOrder
    filename?: SortOrder
    mimetype?: SortOrder
    size?: SortOrder
    url?: SortOrder
    path?: SortOrder
    type?: SortOrder
    created_at?: SortOrder
  }

  export type DocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uuid?: string
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    user_uuid?: StringFilter<"Document"> | string
    filename?: StringFilter<"Document"> | string
    mimetype?: StringFilter<"Document"> | string
    size?: IntFilter<"Document"> | number
    url?: StringFilter<"Document"> | string
    path?: StringFilter<"Document"> | string
    type?: EnumDocumentTypeFilter<"Document"> | $Enums.DocumentType
    created_at?: DateTimeFilter<"Document"> | Date | string
  }, "id" | "uuid">

  export type DocumentOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    user_uuid?: SortOrder
    filename?: SortOrder
    mimetype?: SortOrder
    size?: SortOrder
    url?: SortOrder
    path?: SortOrder
    type?: SortOrder
    created_at?: SortOrder
    _count?: DocumentCountOrderByAggregateInput
    _avg?: DocumentAvgOrderByAggregateInput
    _max?: DocumentMaxOrderByAggregateInput
    _min?: DocumentMinOrderByAggregateInput
    _sum?: DocumentSumOrderByAggregateInput
  }

  export type DocumentScalarWhereWithAggregatesInput = {
    AND?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    OR?: DocumentScalarWhereWithAggregatesInput[]
    NOT?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Document"> | number
    uuid?: StringWithAggregatesFilter<"Document"> | string
    user_uuid?: StringWithAggregatesFilter<"Document"> | string
    filename?: StringWithAggregatesFilter<"Document"> | string
    mimetype?: StringWithAggregatesFilter<"Document"> | string
    size?: IntWithAggregatesFilter<"Document"> | number
    url?: StringWithAggregatesFilter<"Document"> | string
    path?: StringWithAggregatesFilter<"Document"> | string
    type?: EnumDocumentTypeWithAggregatesFilter<"Document"> | $Enums.DocumentType
    created_at?: DateTimeWithAggregatesFilter<"Document"> | Date | string
  }

  export type UserCreateInput = {
    uuid?: string
    email: string
    phone?: string | null
    password: string
    role: $Enums.AuthRole
    created_at?: Date | string
    updated_at?: Date | string
    organization_members?: OrganizationMemberCreateNestedManyWithoutUserInput
    audit_logs?: AuditLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    uuid?: string
    email: string
    phone?: string | null
    password: string
    role: $Enums.AuthRole
    created_at?: Date | string
    updated_at?: Date | string
    organization_members?: OrganizationMemberUncheckedCreateNestedManyWithoutUserInput
    audit_logs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    organization_members?: OrganizationMemberUpdateManyWithoutUserNestedInput
    audit_logs?: AuditLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    organization_members?: OrganizationMemberUncheckedUpdateManyWithoutUserNestedInput
    audit_logs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    uuid?: string
    email: string
    phone?: string | null
    password: string
    role: $Enums.AuthRole
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganizationCreateInput = {
    uuid?: string
    name: string
    slug: string
    logo_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    members?: OrganizationMemberCreateNestedManyWithoutOrganizationInput
    roles?: OrganizationRoleCreateNestedManyWithoutOrganizationInput
    audit_logs?: AuditLogCreateNestedManyWithoutOrganizationInput
    integrations?: IntegrationCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateInput = {
    id?: number
    uuid?: string
    name: string
    slug: string
    logo_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    members?: OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInput
    roles?: OrganizationRoleUncheckedCreateNestedManyWithoutOrganizationInput
    audit_logs?: AuditLogUncheckedCreateNestedManyWithoutOrganizationInput
    integrations?: IntegrationUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: OrganizationMemberUpdateManyWithoutOrganizationNestedInput
    roles?: OrganizationRoleUpdateManyWithoutOrganizationNestedInput
    audit_logs?: AuditLogUpdateManyWithoutOrganizationNestedInput
    integrations?: IntegrationUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInput
    roles?: OrganizationRoleUncheckedUpdateManyWithoutOrganizationNestedInput
    audit_logs?: AuditLogUncheckedUpdateManyWithoutOrganizationNestedInput
    integrations?: IntegrationUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationCreateManyInput = {
    id?: number
    uuid?: string
    name: string
    slug: string
    logo_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type OrganizationUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganizationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganizationMemberCreateInput = {
    uuid?: string
    status?: $Enums.OrganizationMemberStatus
    invited_at?: Date | string
    joined_at?: Date | string | null
    organization: OrganizationCreateNestedOneWithoutMembersInput
    user: UserCreateNestedOneWithoutOrganization_membersInput
    role: OrganizationRoleCreateNestedOneWithoutMembersInput
  }

  export type OrganizationMemberUncheckedCreateInput = {
    id?: number
    uuid?: string
    org_uuid: string
    user_uuid: string
    role_uuid: string
    status?: $Enums.OrganizationMemberStatus
    invited_at?: Date | string
    joined_at?: Date | string | null
  }

  export type OrganizationMemberUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    status?: EnumOrganizationMemberStatusFieldUpdateOperationsInput | $Enums.OrganizationMemberStatus
    invited_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organization?: OrganizationUpdateOneRequiredWithoutMembersNestedInput
    user?: UserUpdateOneRequiredWithoutOrganization_membersNestedInput
    role?: OrganizationRoleUpdateOneRequiredWithoutMembersNestedInput
  }

  export type OrganizationMemberUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    org_uuid?: StringFieldUpdateOperationsInput | string
    user_uuid?: StringFieldUpdateOperationsInput | string
    role_uuid?: StringFieldUpdateOperationsInput | string
    status?: EnumOrganizationMemberStatusFieldUpdateOperationsInput | $Enums.OrganizationMemberStatus
    invited_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OrganizationMemberCreateManyInput = {
    id?: number
    uuid?: string
    org_uuid: string
    user_uuid: string
    role_uuid: string
    status?: $Enums.OrganizationMemberStatus
    invited_at?: Date | string
    joined_at?: Date | string | null
  }

  export type OrganizationMemberUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    status?: EnumOrganizationMemberStatusFieldUpdateOperationsInput | $Enums.OrganizationMemberStatus
    invited_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OrganizationMemberUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    org_uuid?: StringFieldUpdateOperationsInput | string
    user_uuid?: StringFieldUpdateOperationsInput | string
    role_uuid?: StringFieldUpdateOperationsInput | string
    status?: EnumOrganizationMemberStatusFieldUpdateOperationsInput | $Enums.OrganizationMemberStatus
    invited_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OrganizationRoleCreateInput = {
    uuid?: string
    name: string
    is_system?: boolean
    organization: OrganizationCreateNestedOneWithoutRolesInput
    members?: OrganizationMemberCreateNestedManyWithoutRoleInput
    permissions?: RolePermissionCreateNestedManyWithoutRoleInput
  }

  export type OrganizationRoleUncheckedCreateInput = {
    id?: number
    uuid?: string
    org_uuid: string
    name: string
    is_system?: boolean
    members?: OrganizationMemberUncheckedCreateNestedManyWithoutRoleInput
    permissions?: RolePermissionUncheckedCreateNestedManyWithoutRoleInput
  }

  export type OrganizationRoleUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    is_system?: BoolFieldUpdateOperationsInput | boolean
    organization?: OrganizationUpdateOneRequiredWithoutRolesNestedInput
    members?: OrganizationMemberUpdateManyWithoutRoleNestedInput
    permissions?: RolePermissionUpdateManyWithoutRoleNestedInput
  }

  export type OrganizationRoleUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    org_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    is_system?: BoolFieldUpdateOperationsInput | boolean
    members?: OrganizationMemberUncheckedUpdateManyWithoutRoleNestedInput
    permissions?: RolePermissionUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type OrganizationRoleCreateManyInput = {
    id?: number
    uuid?: string
    org_uuid: string
    name: string
    is_system?: boolean
  }

  export type OrganizationRoleUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    is_system?: BoolFieldUpdateOperationsInput | boolean
  }

  export type OrganizationRoleUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    org_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    is_system?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PermissionCreateInput = {
    uuid?: string
    key: string
    label: string
    group: string
    roles?: RolePermissionCreateNestedManyWithoutPermissionInput
  }

  export type PermissionUncheckedCreateInput = {
    id?: number
    uuid?: string
    key: string
    label: string
    group: string
    roles?: RolePermissionUncheckedCreateNestedManyWithoutPermissionInput
  }

  export type PermissionUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    group?: StringFieldUpdateOperationsInput | string
    roles?: RolePermissionUpdateManyWithoutPermissionNestedInput
  }

  export type PermissionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    group?: StringFieldUpdateOperationsInput | string
    roles?: RolePermissionUncheckedUpdateManyWithoutPermissionNestedInput
  }

  export type PermissionCreateManyInput = {
    id?: number
    uuid?: string
    key: string
    label: string
    group: string
  }

  export type PermissionUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    group?: StringFieldUpdateOperationsInput | string
  }

  export type PermissionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    group?: StringFieldUpdateOperationsInput | string
  }

  export type RolePermissionCreateInput = {
    uuid?: string
    role: OrganizationRoleCreateNestedOneWithoutPermissionsInput
    permission: PermissionCreateNestedOneWithoutRolesInput
  }

  export type RolePermissionUncheckedCreateInput = {
    id?: number
    uuid?: string
    role_uuid: string
    permission_uuid: string
  }

  export type RolePermissionUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    role?: OrganizationRoleUpdateOneRequiredWithoutPermissionsNestedInput
    permission?: PermissionUpdateOneRequiredWithoutRolesNestedInput
  }

  export type RolePermissionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    role_uuid?: StringFieldUpdateOperationsInput | string
    permission_uuid?: StringFieldUpdateOperationsInput | string
  }

  export type RolePermissionCreateManyInput = {
    id?: number
    uuid?: string
    role_uuid: string
    permission_uuid: string
  }

  export type RolePermissionUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
  }

  export type RolePermissionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    role_uuid?: StringFieldUpdateOperationsInput | string
    permission_uuid?: StringFieldUpdateOperationsInput | string
  }

  export type AuditLogCreateInput = {
    uuid?: string
    action: string
    resource_type: string
    resource_id?: string | null
    metadata: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    organization: OrganizationCreateNestedOneWithoutAudit_logsInput
    user: UserCreateNestedOneWithoutAudit_logsInput
  }

  export type AuditLogUncheckedCreateInput = {
    id?: number
    uuid?: string
    org_uuid: string
    user_uuid: string
    action: string
    resource_type: string
    resource_id?: string | null
    metadata: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
  }

  export type AuditLogUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resource_type?: StringFieldUpdateOperationsInput | string
    resource_id?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneRequiredWithoutAudit_logsNestedInput
    user?: UserUpdateOneRequiredWithoutAudit_logsNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    org_uuid?: StringFieldUpdateOperationsInput | string
    user_uuid?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resource_type?: StringFieldUpdateOperationsInput | string
    resource_id?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: number
    uuid?: string
    org_uuid: string
    user_uuid: string
    action: string
    resource_type: string
    resource_id?: string | null
    metadata: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resource_type?: StringFieldUpdateOperationsInput | string
    resource_id?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    org_uuid?: StringFieldUpdateOperationsInput | string
    user_uuid?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resource_type?: StringFieldUpdateOperationsInput | string
    resource_id?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntegrationCreateInput = {
    uuid?: string
    name: string
    description?: string | null
    provider: $Enums.IntegrationProvider
    status?: $Enums.IntegrationStatus
    config: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    organization: OrganizationCreateNestedOneWithoutIntegrationsInput
    actions?: IntegrationActionCreateNestedManyWithoutIntegrationInput
    database?: DatabaseIntegrationCreateNestedOneWithoutIntegrationInput
    openapi?: OpenApiIntegrationCreateNestedOneWithoutIntegrationInput
    mcp?: McpIntegrationCreateNestedOneWithoutIntegrationInput
  }

  export type IntegrationUncheckedCreateInput = {
    id?: number
    uuid?: string
    org_uuid: string
    name: string
    description?: string | null
    provider: $Enums.IntegrationProvider
    status?: $Enums.IntegrationStatus
    config: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    actions?: IntegrationActionUncheckedCreateNestedManyWithoutIntegrationInput
    database?: DatabaseIntegrationUncheckedCreateNestedOneWithoutIntegrationInput
    openapi?: OpenApiIntegrationUncheckedCreateNestedOneWithoutIntegrationInput
    mcp?: McpIntegrationUncheckedCreateNestedOneWithoutIntegrationInput
  }

  export type IntegrationUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: EnumIntegrationProviderFieldUpdateOperationsInput | $Enums.IntegrationProvider
    status?: EnumIntegrationStatusFieldUpdateOperationsInput | $Enums.IntegrationStatus
    config?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneRequiredWithoutIntegrationsNestedInput
    actions?: IntegrationActionUpdateManyWithoutIntegrationNestedInput
    database?: DatabaseIntegrationUpdateOneWithoutIntegrationNestedInput
    openapi?: OpenApiIntegrationUpdateOneWithoutIntegrationNestedInput
    mcp?: McpIntegrationUpdateOneWithoutIntegrationNestedInput
  }

  export type IntegrationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    org_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: EnumIntegrationProviderFieldUpdateOperationsInput | $Enums.IntegrationProvider
    status?: EnumIntegrationStatusFieldUpdateOperationsInput | $Enums.IntegrationStatus
    config?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    actions?: IntegrationActionUncheckedUpdateManyWithoutIntegrationNestedInput
    database?: DatabaseIntegrationUncheckedUpdateOneWithoutIntegrationNestedInput
    openapi?: OpenApiIntegrationUncheckedUpdateOneWithoutIntegrationNestedInput
    mcp?: McpIntegrationUncheckedUpdateOneWithoutIntegrationNestedInput
  }

  export type IntegrationCreateManyInput = {
    id?: number
    uuid?: string
    org_uuid: string
    name: string
    description?: string | null
    provider: $Enums.IntegrationProvider
    status?: $Enums.IntegrationStatus
    config: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type IntegrationUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: EnumIntegrationProviderFieldUpdateOperationsInput | $Enums.IntegrationProvider
    status?: EnumIntegrationStatusFieldUpdateOperationsInput | $Enums.IntegrationStatus
    config?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntegrationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    org_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: EnumIntegrationProviderFieldUpdateOperationsInput | $Enums.IntegrationProvider
    status?: EnumIntegrationStatusFieldUpdateOperationsInput | $Enums.IntegrationStatus
    config?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DatabaseIntegrationCreateInput = {
    uuid?: string
    db_type: $Enums.DatabaseType
    connection_string: string
    schema_cache?: NullableJsonNullValueInput | InputJsonValue
    allowed_ops?: DatabaseIntegrationCreateallowed_opsInput | $Enums.DatabaseOperation[]
    last_schema_sync?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    integration: IntegrationCreateNestedOneWithoutDatabaseInput
  }

  export type DatabaseIntegrationUncheckedCreateInput = {
    id?: number
    uuid?: string
    integration_uuid: string
    db_type: $Enums.DatabaseType
    connection_string: string
    schema_cache?: NullableJsonNullValueInput | InputJsonValue
    allowed_ops?: DatabaseIntegrationCreateallowed_opsInput | $Enums.DatabaseOperation[]
    last_schema_sync?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type DatabaseIntegrationUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    db_type?: EnumDatabaseTypeFieldUpdateOperationsInput | $Enums.DatabaseType
    connection_string?: StringFieldUpdateOperationsInput | string
    schema_cache?: NullableJsonNullValueInput | InputJsonValue
    allowed_ops?: DatabaseIntegrationUpdateallowed_opsInput | $Enums.DatabaseOperation[]
    last_schema_sync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    integration?: IntegrationUpdateOneRequiredWithoutDatabaseNestedInput
  }

  export type DatabaseIntegrationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    integration_uuid?: StringFieldUpdateOperationsInput | string
    db_type?: EnumDatabaseTypeFieldUpdateOperationsInput | $Enums.DatabaseType
    connection_string?: StringFieldUpdateOperationsInput | string
    schema_cache?: NullableJsonNullValueInput | InputJsonValue
    allowed_ops?: DatabaseIntegrationUpdateallowed_opsInput | $Enums.DatabaseOperation[]
    last_schema_sync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DatabaseIntegrationCreateManyInput = {
    id?: number
    uuid?: string
    integration_uuid: string
    db_type: $Enums.DatabaseType
    connection_string: string
    schema_cache?: NullableJsonNullValueInput | InputJsonValue
    allowed_ops?: DatabaseIntegrationCreateallowed_opsInput | $Enums.DatabaseOperation[]
    last_schema_sync?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type DatabaseIntegrationUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    db_type?: EnumDatabaseTypeFieldUpdateOperationsInput | $Enums.DatabaseType
    connection_string?: StringFieldUpdateOperationsInput | string
    schema_cache?: NullableJsonNullValueInput | InputJsonValue
    allowed_ops?: DatabaseIntegrationUpdateallowed_opsInput | $Enums.DatabaseOperation[]
    last_schema_sync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DatabaseIntegrationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    integration_uuid?: StringFieldUpdateOperationsInput | string
    db_type?: EnumDatabaseTypeFieldUpdateOperationsInput | $Enums.DatabaseType
    connection_string?: StringFieldUpdateOperationsInput | string
    schema_cache?: NullableJsonNullValueInput | InputJsonValue
    allowed_ops?: DatabaseIntegrationUpdateallowed_opsInput | $Enums.DatabaseOperation[]
    last_schema_sync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OpenApiIntegrationCreateInput = {
    uuid?: string
    spec_url?: string | null
    spec_json: JsonNullValueInput | InputJsonValue
    base_url: string
    auth_type?: $Enums.OpenApiAuthType
    auth_config: string
    generated_tools: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    integration: IntegrationCreateNestedOneWithoutOpenapiInput
  }

  export type OpenApiIntegrationUncheckedCreateInput = {
    id?: number
    uuid?: string
    integration_uuid: string
    spec_url?: string | null
    spec_json: JsonNullValueInput | InputJsonValue
    base_url: string
    auth_type?: $Enums.OpenApiAuthType
    auth_config: string
    generated_tools: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type OpenApiIntegrationUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    spec_url?: NullableStringFieldUpdateOperationsInput | string | null
    spec_json?: JsonNullValueInput | InputJsonValue
    base_url?: StringFieldUpdateOperationsInput | string
    auth_type?: EnumOpenApiAuthTypeFieldUpdateOperationsInput | $Enums.OpenApiAuthType
    auth_config?: StringFieldUpdateOperationsInput | string
    generated_tools?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    integration?: IntegrationUpdateOneRequiredWithoutOpenapiNestedInput
  }

  export type OpenApiIntegrationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    integration_uuid?: StringFieldUpdateOperationsInput | string
    spec_url?: NullableStringFieldUpdateOperationsInput | string | null
    spec_json?: JsonNullValueInput | InputJsonValue
    base_url?: StringFieldUpdateOperationsInput | string
    auth_type?: EnumOpenApiAuthTypeFieldUpdateOperationsInput | $Enums.OpenApiAuthType
    auth_config?: StringFieldUpdateOperationsInput | string
    generated_tools?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OpenApiIntegrationCreateManyInput = {
    id?: number
    uuid?: string
    integration_uuid: string
    spec_url?: string | null
    spec_json: JsonNullValueInput | InputJsonValue
    base_url: string
    auth_type?: $Enums.OpenApiAuthType
    auth_config: string
    generated_tools: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type OpenApiIntegrationUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    spec_url?: NullableStringFieldUpdateOperationsInput | string | null
    spec_json?: JsonNullValueInput | InputJsonValue
    base_url?: StringFieldUpdateOperationsInput | string
    auth_type?: EnumOpenApiAuthTypeFieldUpdateOperationsInput | $Enums.OpenApiAuthType
    auth_config?: StringFieldUpdateOperationsInput | string
    generated_tools?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OpenApiIntegrationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    integration_uuid?: StringFieldUpdateOperationsInput | string
    spec_url?: NullableStringFieldUpdateOperationsInput | string | null
    spec_json?: JsonNullValueInput | InputJsonValue
    base_url?: StringFieldUpdateOperationsInput | string
    auth_type?: EnumOpenApiAuthTypeFieldUpdateOperationsInput | $Enums.OpenApiAuthType
    auth_config?: StringFieldUpdateOperationsInput | string
    generated_tools?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type McpIntegrationCreateInput = {
    uuid?: string
    server_url: string
    transport_type?: $Enums.McpTransportType
    auth_type?: $Enums.McpAuthType
    auth_config: string
    server_name?: string | null
    discovered_tools?: JsonNullValueInput | InputJsonValue
    last_tool_sync?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    integration: IntegrationCreateNestedOneWithoutMcpInput
  }

  export type McpIntegrationUncheckedCreateInput = {
    id?: number
    uuid?: string
    integration_uuid: string
    server_url: string
    transport_type?: $Enums.McpTransportType
    auth_type?: $Enums.McpAuthType
    auth_config: string
    server_name?: string | null
    discovered_tools?: JsonNullValueInput | InputJsonValue
    last_tool_sync?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type McpIntegrationUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    server_url?: StringFieldUpdateOperationsInput | string
    transport_type?: EnumMcpTransportTypeFieldUpdateOperationsInput | $Enums.McpTransportType
    auth_type?: EnumMcpAuthTypeFieldUpdateOperationsInput | $Enums.McpAuthType
    auth_config?: StringFieldUpdateOperationsInput | string
    server_name?: NullableStringFieldUpdateOperationsInput | string | null
    discovered_tools?: JsonNullValueInput | InputJsonValue
    last_tool_sync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    integration?: IntegrationUpdateOneRequiredWithoutMcpNestedInput
  }

  export type McpIntegrationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    integration_uuid?: StringFieldUpdateOperationsInput | string
    server_url?: StringFieldUpdateOperationsInput | string
    transport_type?: EnumMcpTransportTypeFieldUpdateOperationsInput | $Enums.McpTransportType
    auth_type?: EnumMcpAuthTypeFieldUpdateOperationsInput | $Enums.McpAuthType
    auth_config?: StringFieldUpdateOperationsInput | string
    server_name?: NullableStringFieldUpdateOperationsInput | string | null
    discovered_tools?: JsonNullValueInput | InputJsonValue
    last_tool_sync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type McpIntegrationCreateManyInput = {
    id?: number
    uuid?: string
    integration_uuid: string
    server_url: string
    transport_type?: $Enums.McpTransportType
    auth_type?: $Enums.McpAuthType
    auth_config: string
    server_name?: string | null
    discovered_tools?: JsonNullValueInput | InputJsonValue
    last_tool_sync?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type McpIntegrationUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    server_url?: StringFieldUpdateOperationsInput | string
    transport_type?: EnumMcpTransportTypeFieldUpdateOperationsInput | $Enums.McpTransportType
    auth_type?: EnumMcpAuthTypeFieldUpdateOperationsInput | $Enums.McpAuthType
    auth_config?: StringFieldUpdateOperationsInput | string
    server_name?: NullableStringFieldUpdateOperationsInput | string | null
    discovered_tools?: JsonNullValueInput | InputJsonValue
    last_tool_sync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type McpIntegrationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    integration_uuid?: StringFieldUpdateOperationsInput | string
    server_url?: StringFieldUpdateOperationsInput | string
    transport_type?: EnumMcpTransportTypeFieldUpdateOperationsInput | $Enums.McpTransportType
    auth_type?: EnumMcpAuthTypeFieldUpdateOperationsInput | $Enums.McpAuthType
    auth_config?: StringFieldUpdateOperationsInput | string
    server_name?: NullableStringFieldUpdateOperationsInput | string | null
    discovered_tools?: JsonNullValueInput | InputJsonValue
    last_tool_sync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntegrationActionCreateInput = {
    uuid?: string
    key: string
    label: string
    description: string
    enabled?: boolean
    required_permission_key?: string | null
    integration: IntegrationCreateNestedOneWithoutActionsInput
  }

  export type IntegrationActionUncheckedCreateInput = {
    id?: number
    uuid?: string
    integration_uuid: string
    key: string
    label: string
    description: string
    enabled?: boolean
    required_permission_key?: string | null
  }

  export type IntegrationActionUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    required_permission_key?: NullableStringFieldUpdateOperationsInput | string | null
    integration?: IntegrationUpdateOneRequiredWithoutActionsNestedInput
  }

  export type IntegrationActionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    integration_uuid?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    required_permission_key?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntegrationActionCreateManyInput = {
    id?: number
    uuid?: string
    integration_uuid: string
    key: string
    label: string
    description: string
    enabled?: boolean
    required_permission_key?: string | null
  }

  export type IntegrationActionUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    required_permission_key?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntegrationActionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    integration_uuid?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    required_permission_key?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DocumentCreateInput = {
    uuid?: string
    user_uuid: string
    filename: string
    mimetype: string
    size: number
    url: string
    path: string
    type?: $Enums.DocumentType
    created_at?: Date | string
  }

  export type DocumentUncheckedCreateInput = {
    id?: number
    uuid?: string
    user_uuid: string
    filename: string
    mimetype: string
    size: number
    url: string
    path: string
    type?: $Enums.DocumentType
    created_at?: Date | string
  }

  export type DocumentUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    user_uuid?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    mimetype?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    user_uuid?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    mimetype?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentCreateManyInput = {
    id?: number
    uuid?: string
    user_uuid: string
    filename: string
    mimetype: string
    size: number
    url: string
    path: string
    type?: $Enums.DocumentType
    created_at?: Date | string
  }

  export type DocumentUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    user_uuid?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    mimetype?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    user_uuid?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    mimetype?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumAuthRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthRole | EnumAuthRoleFieldRefInput<$PrismaModel>
    in?: $Enums.AuthRole[] | ListEnumAuthRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthRole[] | ListEnumAuthRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthRoleFilter<$PrismaModel> | $Enums.AuthRole
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type OrganizationMemberListRelationFilter = {
    every?: OrganizationMemberWhereInput
    some?: OrganizationMemberWhereInput
    none?: OrganizationMemberWhereInput
  }

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput
    some?: AuditLogWhereInput
    none?: AuditLogWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type OrganizationMemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
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
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumAuthRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthRole | EnumAuthRoleFieldRefInput<$PrismaModel>
    in?: $Enums.AuthRole[] | ListEnumAuthRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthRole[] | ListEnumAuthRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthRoleWithAggregatesFilter<$PrismaModel> | $Enums.AuthRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuthRoleFilter<$PrismaModel>
    _max?: NestedEnumAuthRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type OrganizationRoleListRelationFilter = {
    every?: OrganizationRoleWhereInput
    some?: OrganizationRoleWhereInput
    none?: OrganizationRoleWhereInput
  }

  export type IntegrationListRelationFilter = {
    every?: IntegrationWhereInput
    some?: IntegrationWhereInput
    none?: IntegrationWhereInput
  }

  export type OrganizationRoleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type IntegrationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrganizationCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    logo_url?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type OrganizationAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type OrganizationMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    logo_url?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type OrganizationMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    logo_url?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type OrganizationSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnumOrganizationMemberStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OrganizationMemberStatus | EnumOrganizationMemberStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrganizationMemberStatus[] | ListEnumOrganizationMemberStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrganizationMemberStatus[] | ListEnumOrganizationMemberStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrganizationMemberStatusFilter<$PrismaModel> | $Enums.OrganizationMemberStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type OrganizationScalarRelationFilter = {
    is?: OrganizationWhereInput
    isNot?: OrganizationWhereInput
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type OrganizationRoleScalarRelationFilter = {
    is?: OrganizationRoleWhereInput
    isNot?: OrganizationRoleWhereInput
  }

  export type OrganizationMemberOrg_uuidUser_uuidCompoundUniqueInput = {
    org_uuid: string
    user_uuid: string
  }

  export type OrganizationMemberCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    org_uuid?: SortOrder
    user_uuid?: SortOrder
    role_uuid?: SortOrder
    status?: SortOrder
    invited_at?: SortOrder
    joined_at?: SortOrder
  }

  export type OrganizationMemberAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type OrganizationMemberMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    org_uuid?: SortOrder
    user_uuid?: SortOrder
    role_uuid?: SortOrder
    status?: SortOrder
    invited_at?: SortOrder
    joined_at?: SortOrder
  }

  export type OrganizationMemberMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    org_uuid?: SortOrder
    user_uuid?: SortOrder
    role_uuid?: SortOrder
    status?: SortOrder
    invited_at?: SortOrder
    joined_at?: SortOrder
  }

  export type OrganizationMemberSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnumOrganizationMemberStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrganizationMemberStatus | EnumOrganizationMemberStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrganizationMemberStatus[] | ListEnumOrganizationMemberStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrganizationMemberStatus[] | ListEnumOrganizationMemberStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrganizationMemberStatusWithAggregatesFilter<$PrismaModel> | $Enums.OrganizationMemberStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrganizationMemberStatusFilter<$PrismaModel>
    _max?: NestedEnumOrganizationMemberStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type RolePermissionListRelationFilter = {
    every?: RolePermissionWhereInput
    some?: RolePermissionWhereInput
    none?: RolePermissionWhereInput
  }

  export type RolePermissionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrganizationRoleOrg_uuidNameCompoundUniqueInput = {
    org_uuid: string
    name: string
  }

  export type OrganizationRoleCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    org_uuid?: SortOrder
    name?: SortOrder
    is_system?: SortOrder
  }

  export type OrganizationRoleAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type OrganizationRoleMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    org_uuid?: SortOrder
    name?: SortOrder
    is_system?: SortOrder
  }

  export type OrganizationRoleMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    org_uuid?: SortOrder
    name?: SortOrder
    is_system?: SortOrder
  }

  export type OrganizationRoleSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type PermissionCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    key?: SortOrder
    label?: SortOrder
    group?: SortOrder
  }

  export type PermissionAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PermissionMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    key?: SortOrder
    label?: SortOrder
    group?: SortOrder
  }

  export type PermissionMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    key?: SortOrder
    label?: SortOrder
    group?: SortOrder
  }

  export type PermissionSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PermissionScalarRelationFilter = {
    is?: PermissionWhereInput
    isNot?: PermissionWhereInput
  }

  export type RolePermissionRole_uuidPermission_uuidCompoundUniqueInput = {
    role_uuid: string
    permission_uuid: string
  }

  export type RolePermissionCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    role_uuid?: SortOrder
    permission_uuid?: SortOrder
  }

  export type RolePermissionAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type RolePermissionMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    role_uuid?: SortOrder
    permission_uuid?: SortOrder
  }

  export type RolePermissionMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    role_uuid?: SortOrder
    permission_uuid?: SortOrder
  }

  export type RolePermissionSumOrderByAggregateInput = {
    id?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    org_uuid?: SortOrder
    user_uuid?: SortOrder
    action?: SortOrder
    resource_type?: SortOrder
    resource_id?: SortOrder
    metadata?: SortOrder
    created_at?: SortOrder
  }

  export type AuditLogAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    org_uuid?: SortOrder
    user_uuid?: SortOrder
    action?: SortOrder
    resource_type?: SortOrder
    resource_id?: SortOrder
    created_at?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    org_uuid?: SortOrder
    user_uuid?: SortOrder
    action?: SortOrder
    resource_type?: SortOrder
    resource_id?: SortOrder
    created_at?: SortOrder
  }

  export type AuditLogSumOrderByAggregateInput = {
    id?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumIntegrationProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.IntegrationProvider | EnumIntegrationProviderFieldRefInput<$PrismaModel>
    in?: $Enums.IntegrationProvider[] | ListEnumIntegrationProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntegrationProvider[] | ListEnumIntegrationProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumIntegrationProviderFilter<$PrismaModel> | $Enums.IntegrationProvider
  }

  export type EnumIntegrationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.IntegrationStatus | EnumIntegrationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.IntegrationStatus[] | ListEnumIntegrationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntegrationStatus[] | ListEnumIntegrationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumIntegrationStatusFilter<$PrismaModel> | $Enums.IntegrationStatus
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type IntegrationActionListRelationFilter = {
    every?: IntegrationActionWhereInput
    some?: IntegrationActionWhereInput
    none?: IntegrationActionWhereInput
  }

  export type DatabaseIntegrationNullableScalarRelationFilter = {
    is?: DatabaseIntegrationWhereInput | null
    isNot?: DatabaseIntegrationWhereInput | null
  }

  export type OpenApiIntegrationNullableScalarRelationFilter = {
    is?: OpenApiIntegrationWhereInput | null
    isNot?: OpenApiIntegrationWhereInput | null
  }

  export type McpIntegrationNullableScalarRelationFilter = {
    is?: McpIntegrationWhereInput | null
    isNot?: McpIntegrationWhereInput | null
  }

  export type IntegrationActionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type IntegrationCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    org_uuid?: SortOrder
    name?: SortOrder
    description?: SortOrder
    provider?: SortOrder
    status?: SortOrder
    config?: SortOrder
    metadata?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type IntegrationAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntegrationMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    org_uuid?: SortOrder
    name?: SortOrder
    description?: SortOrder
    provider?: SortOrder
    status?: SortOrder
    config?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type IntegrationMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    org_uuid?: SortOrder
    name?: SortOrder
    description?: SortOrder
    provider?: SortOrder
    status?: SortOrder
    config?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type IntegrationSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnumIntegrationProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IntegrationProvider | EnumIntegrationProviderFieldRefInput<$PrismaModel>
    in?: $Enums.IntegrationProvider[] | ListEnumIntegrationProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntegrationProvider[] | ListEnumIntegrationProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumIntegrationProviderWithAggregatesFilter<$PrismaModel> | $Enums.IntegrationProvider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumIntegrationProviderFilter<$PrismaModel>
    _max?: NestedEnumIntegrationProviderFilter<$PrismaModel>
  }

  export type EnumIntegrationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IntegrationStatus | EnumIntegrationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.IntegrationStatus[] | ListEnumIntegrationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntegrationStatus[] | ListEnumIntegrationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumIntegrationStatusWithAggregatesFilter<$PrismaModel> | $Enums.IntegrationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumIntegrationStatusFilter<$PrismaModel>
    _max?: NestedEnumIntegrationStatusFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumDatabaseTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DatabaseType | EnumDatabaseTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DatabaseType[] | ListEnumDatabaseTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DatabaseType[] | ListEnumDatabaseTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDatabaseTypeFilter<$PrismaModel> | $Enums.DatabaseType
  }

  export type EnumDatabaseOperationNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.DatabaseOperation[] | ListEnumDatabaseOperationFieldRefInput<$PrismaModel> | null
    has?: $Enums.DatabaseOperation | EnumDatabaseOperationFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.DatabaseOperation[] | ListEnumDatabaseOperationFieldRefInput<$PrismaModel>
    hasSome?: $Enums.DatabaseOperation[] | ListEnumDatabaseOperationFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type IntegrationScalarRelationFilter = {
    is?: IntegrationWhereInput
    isNot?: IntegrationWhereInput
  }

  export type DatabaseIntegrationCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    integration_uuid?: SortOrder
    db_type?: SortOrder
    connection_string?: SortOrder
    schema_cache?: SortOrder
    allowed_ops?: SortOrder
    last_schema_sync?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type DatabaseIntegrationAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DatabaseIntegrationMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    integration_uuid?: SortOrder
    db_type?: SortOrder
    connection_string?: SortOrder
    last_schema_sync?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type DatabaseIntegrationMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    integration_uuid?: SortOrder
    db_type?: SortOrder
    connection_string?: SortOrder
    last_schema_sync?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type DatabaseIntegrationSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnumDatabaseTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DatabaseType | EnumDatabaseTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DatabaseType[] | ListEnumDatabaseTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DatabaseType[] | ListEnumDatabaseTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDatabaseTypeWithAggregatesFilter<$PrismaModel> | $Enums.DatabaseType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDatabaseTypeFilter<$PrismaModel>
    _max?: NestedEnumDatabaseTypeFilter<$PrismaModel>
  }

  export type EnumOpenApiAuthTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.OpenApiAuthType | EnumOpenApiAuthTypeFieldRefInput<$PrismaModel>
    in?: $Enums.OpenApiAuthType[] | ListEnumOpenApiAuthTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.OpenApiAuthType[] | ListEnumOpenApiAuthTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumOpenApiAuthTypeFilter<$PrismaModel> | $Enums.OpenApiAuthType
  }

  export type OpenApiIntegrationCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    integration_uuid?: SortOrder
    spec_url?: SortOrder
    spec_json?: SortOrder
    base_url?: SortOrder
    auth_type?: SortOrder
    auth_config?: SortOrder
    generated_tools?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type OpenApiIntegrationAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type OpenApiIntegrationMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    integration_uuid?: SortOrder
    spec_url?: SortOrder
    base_url?: SortOrder
    auth_type?: SortOrder
    auth_config?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type OpenApiIntegrationMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    integration_uuid?: SortOrder
    spec_url?: SortOrder
    base_url?: SortOrder
    auth_type?: SortOrder
    auth_config?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type OpenApiIntegrationSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnumOpenApiAuthTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OpenApiAuthType | EnumOpenApiAuthTypeFieldRefInput<$PrismaModel>
    in?: $Enums.OpenApiAuthType[] | ListEnumOpenApiAuthTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.OpenApiAuthType[] | ListEnumOpenApiAuthTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumOpenApiAuthTypeWithAggregatesFilter<$PrismaModel> | $Enums.OpenApiAuthType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOpenApiAuthTypeFilter<$PrismaModel>
    _max?: NestedEnumOpenApiAuthTypeFilter<$PrismaModel>
  }

  export type EnumMcpTransportTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.McpTransportType | EnumMcpTransportTypeFieldRefInput<$PrismaModel>
    in?: $Enums.McpTransportType[] | ListEnumMcpTransportTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.McpTransportType[] | ListEnumMcpTransportTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMcpTransportTypeFilter<$PrismaModel> | $Enums.McpTransportType
  }

  export type EnumMcpAuthTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.McpAuthType | EnumMcpAuthTypeFieldRefInput<$PrismaModel>
    in?: $Enums.McpAuthType[] | ListEnumMcpAuthTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.McpAuthType[] | ListEnumMcpAuthTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMcpAuthTypeFilter<$PrismaModel> | $Enums.McpAuthType
  }

  export type McpIntegrationCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    integration_uuid?: SortOrder
    server_url?: SortOrder
    transport_type?: SortOrder
    auth_type?: SortOrder
    auth_config?: SortOrder
    server_name?: SortOrder
    discovered_tools?: SortOrder
    last_tool_sync?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type McpIntegrationAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type McpIntegrationMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    integration_uuid?: SortOrder
    server_url?: SortOrder
    transport_type?: SortOrder
    auth_type?: SortOrder
    auth_config?: SortOrder
    server_name?: SortOrder
    last_tool_sync?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type McpIntegrationMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    integration_uuid?: SortOrder
    server_url?: SortOrder
    transport_type?: SortOrder
    auth_type?: SortOrder
    auth_config?: SortOrder
    server_name?: SortOrder
    last_tool_sync?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type McpIntegrationSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnumMcpTransportTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.McpTransportType | EnumMcpTransportTypeFieldRefInput<$PrismaModel>
    in?: $Enums.McpTransportType[] | ListEnumMcpTransportTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.McpTransportType[] | ListEnumMcpTransportTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMcpTransportTypeWithAggregatesFilter<$PrismaModel> | $Enums.McpTransportType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMcpTransportTypeFilter<$PrismaModel>
    _max?: NestedEnumMcpTransportTypeFilter<$PrismaModel>
  }

  export type EnumMcpAuthTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.McpAuthType | EnumMcpAuthTypeFieldRefInput<$PrismaModel>
    in?: $Enums.McpAuthType[] | ListEnumMcpAuthTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.McpAuthType[] | ListEnumMcpAuthTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMcpAuthTypeWithAggregatesFilter<$PrismaModel> | $Enums.McpAuthType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMcpAuthTypeFilter<$PrismaModel>
    _max?: NestedEnumMcpAuthTypeFilter<$PrismaModel>
  }

  export type IntegrationActionIntegration_uuidKeyCompoundUniqueInput = {
    integration_uuid: string
    key: string
  }

  export type IntegrationActionUuidIntegration_uuidCompoundUniqueInput = {
    uuid: string
    integration_uuid: string
  }

  export type IntegrationActionCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    integration_uuid?: SortOrder
    key?: SortOrder
    label?: SortOrder
    description?: SortOrder
    enabled?: SortOrder
    required_permission_key?: SortOrder
  }

  export type IntegrationActionAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntegrationActionMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    integration_uuid?: SortOrder
    key?: SortOrder
    label?: SortOrder
    description?: SortOrder
    enabled?: SortOrder
    required_permission_key?: SortOrder
  }

  export type IntegrationActionMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    integration_uuid?: SortOrder
    key?: SortOrder
    label?: SortOrder
    description?: SortOrder
    enabled?: SortOrder
    required_permission_key?: SortOrder
  }

  export type IntegrationActionSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnumDocumentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeFilter<$PrismaModel> | $Enums.DocumentType
  }

  export type DocumentCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    user_uuid?: SortOrder
    filename?: SortOrder
    mimetype?: SortOrder
    size?: SortOrder
    url?: SortOrder
    path?: SortOrder
    type?: SortOrder
    created_at?: SortOrder
  }

  export type DocumentAvgOrderByAggregateInput = {
    id?: SortOrder
    size?: SortOrder
  }

  export type DocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    user_uuid?: SortOrder
    filename?: SortOrder
    mimetype?: SortOrder
    size?: SortOrder
    url?: SortOrder
    path?: SortOrder
    type?: SortOrder
    created_at?: SortOrder
  }

  export type DocumentMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    user_uuid?: SortOrder
    filename?: SortOrder
    mimetype?: SortOrder
    size?: SortOrder
    url?: SortOrder
    path?: SortOrder
    type?: SortOrder
    created_at?: SortOrder
  }

  export type DocumentSumOrderByAggregateInput = {
    id?: SortOrder
    size?: SortOrder
  }

  export type EnumDocumentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeWithAggregatesFilter<$PrismaModel> | $Enums.DocumentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentTypeFilter<$PrismaModel>
    _max?: NestedEnumDocumentTypeFilter<$PrismaModel>
  }

  export type OrganizationMemberCreateNestedManyWithoutUserInput = {
    create?: XOR<OrganizationMemberCreateWithoutUserInput, OrganizationMemberUncheckedCreateWithoutUserInput> | OrganizationMemberCreateWithoutUserInput[] | OrganizationMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrganizationMemberCreateOrConnectWithoutUserInput | OrganizationMemberCreateOrConnectWithoutUserInput[]
    createMany?: OrganizationMemberCreateManyUserInputEnvelope
    connect?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type OrganizationMemberUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<OrganizationMemberCreateWithoutUserInput, OrganizationMemberUncheckedCreateWithoutUserInput> | OrganizationMemberCreateWithoutUserInput[] | OrganizationMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrganizationMemberCreateOrConnectWithoutUserInput | OrganizationMemberCreateOrConnectWithoutUserInput[]
    createMany?: OrganizationMemberCreateManyUserInputEnvelope
    connect?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumAuthRoleFieldUpdateOperationsInput = {
    set?: $Enums.AuthRole
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type OrganizationMemberUpdateManyWithoutUserNestedInput = {
    create?: XOR<OrganizationMemberCreateWithoutUserInput, OrganizationMemberUncheckedCreateWithoutUserInput> | OrganizationMemberCreateWithoutUserInput[] | OrganizationMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrganizationMemberCreateOrConnectWithoutUserInput | OrganizationMemberCreateOrConnectWithoutUserInput[]
    upsert?: OrganizationMemberUpsertWithWhereUniqueWithoutUserInput | OrganizationMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OrganizationMemberCreateManyUserInputEnvelope
    set?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    disconnect?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    delete?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    connect?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    update?: OrganizationMemberUpdateWithWhereUniqueWithoutUserInput | OrganizationMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OrganizationMemberUpdateManyWithWhereWithoutUserInput | OrganizationMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OrganizationMemberScalarWhereInput | OrganizationMemberScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type OrganizationMemberUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<OrganizationMemberCreateWithoutUserInput, OrganizationMemberUncheckedCreateWithoutUserInput> | OrganizationMemberCreateWithoutUserInput[] | OrganizationMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrganizationMemberCreateOrConnectWithoutUserInput | OrganizationMemberCreateOrConnectWithoutUserInput[]
    upsert?: OrganizationMemberUpsertWithWhereUniqueWithoutUserInput | OrganizationMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OrganizationMemberCreateManyUserInputEnvelope
    set?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    disconnect?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    delete?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    connect?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    update?: OrganizationMemberUpdateWithWhereUniqueWithoutUserInput | OrganizationMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OrganizationMemberUpdateManyWithWhereWithoutUserInput | OrganizationMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OrganizationMemberScalarWhereInput | OrganizationMemberScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type OrganizationMemberCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<OrganizationMemberCreateWithoutOrganizationInput, OrganizationMemberUncheckedCreateWithoutOrganizationInput> | OrganizationMemberCreateWithoutOrganizationInput[] | OrganizationMemberUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: OrganizationMemberCreateOrConnectWithoutOrganizationInput | OrganizationMemberCreateOrConnectWithoutOrganizationInput[]
    createMany?: OrganizationMemberCreateManyOrganizationInputEnvelope
    connect?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
  }

  export type OrganizationRoleCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<OrganizationRoleCreateWithoutOrganizationInput, OrganizationRoleUncheckedCreateWithoutOrganizationInput> | OrganizationRoleCreateWithoutOrganizationInput[] | OrganizationRoleUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: OrganizationRoleCreateOrConnectWithoutOrganizationInput | OrganizationRoleCreateOrConnectWithoutOrganizationInput[]
    createMany?: OrganizationRoleCreateManyOrganizationInputEnvelope
    connect?: OrganizationRoleWhereUniqueInput | OrganizationRoleWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<AuditLogCreateWithoutOrganizationInput, AuditLogUncheckedCreateWithoutOrganizationInput> | AuditLogCreateWithoutOrganizationInput[] | AuditLogUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutOrganizationInput | AuditLogCreateOrConnectWithoutOrganizationInput[]
    createMany?: AuditLogCreateManyOrganizationInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type IntegrationCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<IntegrationCreateWithoutOrganizationInput, IntegrationUncheckedCreateWithoutOrganizationInput> | IntegrationCreateWithoutOrganizationInput[] | IntegrationUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: IntegrationCreateOrConnectWithoutOrganizationInput | IntegrationCreateOrConnectWithoutOrganizationInput[]
    createMany?: IntegrationCreateManyOrganizationInputEnvelope
    connect?: IntegrationWhereUniqueInput | IntegrationWhereUniqueInput[]
  }

  export type OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<OrganizationMemberCreateWithoutOrganizationInput, OrganizationMemberUncheckedCreateWithoutOrganizationInput> | OrganizationMemberCreateWithoutOrganizationInput[] | OrganizationMemberUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: OrganizationMemberCreateOrConnectWithoutOrganizationInput | OrganizationMemberCreateOrConnectWithoutOrganizationInput[]
    createMany?: OrganizationMemberCreateManyOrganizationInputEnvelope
    connect?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
  }

  export type OrganizationRoleUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<OrganizationRoleCreateWithoutOrganizationInput, OrganizationRoleUncheckedCreateWithoutOrganizationInput> | OrganizationRoleCreateWithoutOrganizationInput[] | OrganizationRoleUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: OrganizationRoleCreateOrConnectWithoutOrganizationInput | OrganizationRoleCreateOrConnectWithoutOrganizationInput[]
    createMany?: OrganizationRoleCreateManyOrganizationInputEnvelope
    connect?: OrganizationRoleWhereUniqueInput | OrganizationRoleWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<AuditLogCreateWithoutOrganizationInput, AuditLogUncheckedCreateWithoutOrganizationInput> | AuditLogCreateWithoutOrganizationInput[] | AuditLogUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutOrganizationInput | AuditLogCreateOrConnectWithoutOrganizationInput[]
    createMany?: AuditLogCreateManyOrganizationInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type IntegrationUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<IntegrationCreateWithoutOrganizationInput, IntegrationUncheckedCreateWithoutOrganizationInput> | IntegrationCreateWithoutOrganizationInput[] | IntegrationUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: IntegrationCreateOrConnectWithoutOrganizationInput | IntegrationCreateOrConnectWithoutOrganizationInput[]
    createMany?: IntegrationCreateManyOrganizationInputEnvelope
    connect?: IntegrationWhereUniqueInput | IntegrationWhereUniqueInput[]
  }

  export type OrganizationMemberUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<OrganizationMemberCreateWithoutOrganizationInput, OrganizationMemberUncheckedCreateWithoutOrganizationInput> | OrganizationMemberCreateWithoutOrganizationInput[] | OrganizationMemberUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: OrganizationMemberCreateOrConnectWithoutOrganizationInput | OrganizationMemberCreateOrConnectWithoutOrganizationInput[]
    upsert?: OrganizationMemberUpsertWithWhereUniqueWithoutOrganizationInput | OrganizationMemberUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: OrganizationMemberCreateManyOrganizationInputEnvelope
    set?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    disconnect?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    delete?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    connect?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    update?: OrganizationMemberUpdateWithWhereUniqueWithoutOrganizationInput | OrganizationMemberUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: OrganizationMemberUpdateManyWithWhereWithoutOrganizationInput | OrganizationMemberUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: OrganizationMemberScalarWhereInput | OrganizationMemberScalarWhereInput[]
  }

  export type OrganizationRoleUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<OrganizationRoleCreateWithoutOrganizationInput, OrganizationRoleUncheckedCreateWithoutOrganizationInput> | OrganizationRoleCreateWithoutOrganizationInput[] | OrganizationRoleUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: OrganizationRoleCreateOrConnectWithoutOrganizationInput | OrganizationRoleCreateOrConnectWithoutOrganizationInput[]
    upsert?: OrganizationRoleUpsertWithWhereUniqueWithoutOrganizationInput | OrganizationRoleUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: OrganizationRoleCreateManyOrganizationInputEnvelope
    set?: OrganizationRoleWhereUniqueInput | OrganizationRoleWhereUniqueInput[]
    disconnect?: OrganizationRoleWhereUniqueInput | OrganizationRoleWhereUniqueInput[]
    delete?: OrganizationRoleWhereUniqueInput | OrganizationRoleWhereUniqueInput[]
    connect?: OrganizationRoleWhereUniqueInput | OrganizationRoleWhereUniqueInput[]
    update?: OrganizationRoleUpdateWithWhereUniqueWithoutOrganizationInput | OrganizationRoleUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: OrganizationRoleUpdateManyWithWhereWithoutOrganizationInput | OrganizationRoleUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: OrganizationRoleScalarWhereInput | OrganizationRoleScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<AuditLogCreateWithoutOrganizationInput, AuditLogUncheckedCreateWithoutOrganizationInput> | AuditLogCreateWithoutOrganizationInput[] | AuditLogUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutOrganizationInput | AuditLogCreateOrConnectWithoutOrganizationInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutOrganizationInput | AuditLogUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: AuditLogCreateManyOrganizationInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutOrganizationInput | AuditLogUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutOrganizationInput | AuditLogUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type IntegrationUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<IntegrationCreateWithoutOrganizationInput, IntegrationUncheckedCreateWithoutOrganizationInput> | IntegrationCreateWithoutOrganizationInput[] | IntegrationUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: IntegrationCreateOrConnectWithoutOrganizationInput | IntegrationCreateOrConnectWithoutOrganizationInput[]
    upsert?: IntegrationUpsertWithWhereUniqueWithoutOrganizationInput | IntegrationUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: IntegrationCreateManyOrganizationInputEnvelope
    set?: IntegrationWhereUniqueInput | IntegrationWhereUniqueInput[]
    disconnect?: IntegrationWhereUniqueInput | IntegrationWhereUniqueInput[]
    delete?: IntegrationWhereUniqueInput | IntegrationWhereUniqueInput[]
    connect?: IntegrationWhereUniqueInput | IntegrationWhereUniqueInput[]
    update?: IntegrationUpdateWithWhereUniqueWithoutOrganizationInput | IntegrationUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: IntegrationUpdateManyWithWhereWithoutOrganizationInput | IntegrationUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: IntegrationScalarWhereInput | IntegrationScalarWhereInput[]
  }

  export type OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<OrganizationMemberCreateWithoutOrganizationInput, OrganizationMemberUncheckedCreateWithoutOrganizationInput> | OrganizationMemberCreateWithoutOrganizationInput[] | OrganizationMemberUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: OrganizationMemberCreateOrConnectWithoutOrganizationInput | OrganizationMemberCreateOrConnectWithoutOrganizationInput[]
    upsert?: OrganizationMemberUpsertWithWhereUniqueWithoutOrganizationInput | OrganizationMemberUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: OrganizationMemberCreateManyOrganizationInputEnvelope
    set?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    disconnect?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    delete?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    connect?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    update?: OrganizationMemberUpdateWithWhereUniqueWithoutOrganizationInput | OrganizationMemberUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: OrganizationMemberUpdateManyWithWhereWithoutOrganizationInput | OrganizationMemberUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: OrganizationMemberScalarWhereInput | OrganizationMemberScalarWhereInput[]
  }

  export type OrganizationRoleUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<OrganizationRoleCreateWithoutOrganizationInput, OrganizationRoleUncheckedCreateWithoutOrganizationInput> | OrganizationRoleCreateWithoutOrganizationInput[] | OrganizationRoleUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: OrganizationRoleCreateOrConnectWithoutOrganizationInput | OrganizationRoleCreateOrConnectWithoutOrganizationInput[]
    upsert?: OrganizationRoleUpsertWithWhereUniqueWithoutOrganizationInput | OrganizationRoleUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: OrganizationRoleCreateManyOrganizationInputEnvelope
    set?: OrganizationRoleWhereUniqueInput | OrganizationRoleWhereUniqueInput[]
    disconnect?: OrganizationRoleWhereUniqueInput | OrganizationRoleWhereUniqueInput[]
    delete?: OrganizationRoleWhereUniqueInput | OrganizationRoleWhereUniqueInput[]
    connect?: OrganizationRoleWhereUniqueInput | OrganizationRoleWhereUniqueInput[]
    update?: OrganizationRoleUpdateWithWhereUniqueWithoutOrganizationInput | OrganizationRoleUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: OrganizationRoleUpdateManyWithWhereWithoutOrganizationInput | OrganizationRoleUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: OrganizationRoleScalarWhereInput | OrganizationRoleScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<AuditLogCreateWithoutOrganizationInput, AuditLogUncheckedCreateWithoutOrganizationInput> | AuditLogCreateWithoutOrganizationInput[] | AuditLogUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutOrganizationInput | AuditLogCreateOrConnectWithoutOrganizationInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutOrganizationInput | AuditLogUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: AuditLogCreateManyOrganizationInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutOrganizationInput | AuditLogUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutOrganizationInput | AuditLogUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type IntegrationUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<IntegrationCreateWithoutOrganizationInput, IntegrationUncheckedCreateWithoutOrganizationInput> | IntegrationCreateWithoutOrganizationInput[] | IntegrationUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: IntegrationCreateOrConnectWithoutOrganizationInput | IntegrationCreateOrConnectWithoutOrganizationInput[]
    upsert?: IntegrationUpsertWithWhereUniqueWithoutOrganizationInput | IntegrationUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: IntegrationCreateManyOrganizationInputEnvelope
    set?: IntegrationWhereUniqueInput | IntegrationWhereUniqueInput[]
    disconnect?: IntegrationWhereUniqueInput | IntegrationWhereUniqueInput[]
    delete?: IntegrationWhereUniqueInput | IntegrationWhereUniqueInput[]
    connect?: IntegrationWhereUniqueInput | IntegrationWhereUniqueInput[]
    update?: IntegrationUpdateWithWhereUniqueWithoutOrganizationInput | IntegrationUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: IntegrationUpdateManyWithWhereWithoutOrganizationInput | IntegrationUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: IntegrationScalarWhereInput | IntegrationScalarWhereInput[]
  }

  export type OrganizationCreateNestedOneWithoutMembersInput = {
    create?: XOR<OrganizationCreateWithoutMembersInput, OrganizationUncheckedCreateWithoutMembersInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutMembersInput
    connect?: OrganizationWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutOrganization_membersInput = {
    create?: XOR<UserCreateWithoutOrganization_membersInput, UserUncheckedCreateWithoutOrganization_membersInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrganization_membersInput
    connect?: UserWhereUniqueInput
  }

  export type OrganizationRoleCreateNestedOneWithoutMembersInput = {
    create?: XOR<OrganizationRoleCreateWithoutMembersInput, OrganizationRoleUncheckedCreateWithoutMembersInput>
    connectOrCreate?: OrganizationRoleCreateOrConnectWithoutMembersInput
    connect?: OrganizationRoleWhereUniqueInput
  }

  export type EnumOrganizationMemberStatusFieldUpdateOperationsInput = {
    set?: $Enums.OrganizationMemberStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type OrganizationUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<OrganizationCreateWithoutMembersInput, OrganizationUncheckedCreateWithoutMembersInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutMembersInput
    upsert?: OrganizationUpsertWithoutMembersInput
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutMembersInput, OrganizationUpdateWithoutMembersInput>, OrganizationUncheckedUpdateWithoutMembersInput>
  }

  export type UserUpdateOneRequiredWithoutOrganization_membersNestedInput = {
    create?: XOR<UserCreateWithoutOrganization_membersInput, UserUncheckedCreateWithoutOrganization_membersInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrganization_membersInput
    upsert?: UserUpsertWithoutOrganization_membersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOrganization_membersInput, UserUpdateWithoutOrganization_membersInput>, UserUncheckedUpdateWithoutOrganization_membersInput>
  }

  export type OrganizationRoleUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<OrganizationRoleCreateWithoutMembersInput, OrganizationRoleUncheckedCreateWithoutMembersInput>
    connectOrCreate?: OrganizationRoleCreateOrConnectWithoutMembersInput
    upsert?: OrganizationRoleUpsertWithoutMembersInput
    connect?: OrganizationRoleWhereUniqueInput
    update?: XOR<XOR<OrganizationRoleUpdateToOneWithWhereWithoutMembersInput, OrganizationRoleUpdateWithoutMembersInput>, OrganizationRoleUncheckedUpdateWithoutMembersInput>
  }

  export type OrganizationCreateNestedOneWithoutRolesInput = {
    create?: XOR<OrganizationCreateWithoutRolesInput, OrganizationUncheckedCreateWithoutRolesInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutRolesInput
    connect?: OrganizationWhereUniqueInput
  }

  export type OrganizationMemberCreateNestedManyWithoutRoleInput = {
    create?: XOR<OrganizationMemberCreateWithoutRoleInput, OrganizationMemberUncheckedCreateWithoutRoleInput> | OrganizationMemberCreateWithoutRoleInput[] | OrganizationMemberUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: OrganizationMemberCreateOrConnectWithoutRoleInput | OrganizationMemberCreateOrConnectWithoutRoleInput[]
    createMany?: OrganizationMemberCreateManyRoleInputEnvelope
    connect?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
  }

  export type RolePermissionCreateNestedManyWithoutRoleInput = {
    create?: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput> | RolePermissionCreateWithoutRoleInput[] | RolePermissionUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutRoleInput | RolePermissionCreateOrConnectWithoutRoleInput[]
    createMany?: RolePermissionCreateManyRoleInputEnvelope
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
  }

  export type OrganizationMemberUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<OrganizationMemberCreateWithoutRoleInput, OrganizationMemberUncheckedCreateWithoutRoleInput> | OrganizationMemberCreateWithoutRoleInput[] | OrganizationMemberUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: OrganizationMemberCreateOrConnectWithoutRoleInput | OrganizationMemberCreateOrConnectWithoutRoleInput[]
    createMany?: OrganizationMemberCreateManyRoleInputEnvelope
    connect?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
  }

  export type RolePermissionUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput> | RolePermissionCreateWithoutRoleInput[] | RolePermissionUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutRoleInput | RolePermissionCreateOrConnectWithoutRoleInput[]
    createMany?: RolePermissionCreateManyRoleInputEnvelope
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type OrganizationUpdateOneRequiredWithoutRolesNestedInput = {
    create?: XOR<OrganizationCreateWithoutRolesInput, OrganizationUncheckedCreateWithoutRolesInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutRolesInput
    upsert?: OrganizationUpsertWithoutRolesInput
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutRolesInput, OrganizationUpdateWithoutRolesInput>, OrganizationUncheckedUpdateWithoutRolesInput>
  }

  export type OrganizationMemberUpdateManyWithoutRoleNestedInput = {
    create?: XOR<OrganizationMemberCreateWithoutRoleInput, OrganizationMemberUncheckedCreateWithoutRoleInput> | OrganizationMemberCreateWithoutRoleInput[] | OrganizationMemberUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: OrganizationMemberCreateOrConnectWithoutRoleInput | OrganizationMemberCreateOrConnectWithoutRoleInput[]
    upsert?: OrganizationMemberUpsertWithWhereUniqueWithoutRoleInput | OrganizationMemberUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: OrganizationMemberCreateManyRoleInputEnvelope
    set?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    disconnect?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    delete?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    connect?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    update?: OrganizationMemberUpdateWithWhereUniqueWithoutRoleInput | OrganizationMemberUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: OrganizationMemberUpdateManyWithWhereWithoutRoleInput | OrganizationMemberUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: OrganizationMemberScalarWhereInput | OrganizationMemberScalarWhereInput[]
  }

  export type RolePermissionUpdateManyWithoutRoleNestedInput = {
    create?: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput> | RolePermissionCreateWithoutRoleInput[] | RolePermissionUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutRoleInput | RolePermissionCreateOrConnectWithoutRoleInput[]
    upsert?: RolePermissionUpsertWithWhereUniqueWithoutRoleInput | RolePermissionUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: RolePermissionCreateManyRoleInputEnvelope
    set?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    disconnect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    delete?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    update?: RolePermissionUpdateWithWhereUniqueWithoutRoleInput | RolePermissionUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: RolePermissionUpdateManyWithWhereWithoutRoleInput | RolePermissionUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
  }

  export type OrganizationMemberUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<OrganizationMemberCreateWithoutRoleInput, OrganizationMemberUncheckedCreateWithoutRoleInput> | OrganizationMemberCreateWithoutRoleInput[] | OrganizationMemberUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: OrganizationMemberCreateOrConnectWithoutRoleInput | OrganizationMemberCreateOrConnectWithoutRoleInput[]
    upsert?: OrganizationMemberUpsertWithWhereUniqueWithoutRoleInput | OrganizationMemberUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: OrganizationMemberCreateManyRoleInputEnvelope
    set?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    disconnect?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    delete?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    connect?: OrganizationMemberWhereUniqueInput | OrganizationMemberWhereUniqueInput[]
    update?: OrganizationMemberUpdateWithWhereUniqueWithoutRoleInput | OrganizationMemberUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: OrganizationMemberUpdateManyWithWhereWithoutRoleInput | OrganizationMemberUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: OrganizationMemberScalarWhereInput | OrganizationMemberScalarWhereInput[]
  }

  export type RolePermissionUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput> | RolePermissionCreateWithoutRoleInput[] | RolePermissionUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutRoleInput | RolePermissionCreateOrConnectWithoutRoleInput[]
    upsert?: RolePermissionUpsertWithWhereUniqueWithoutRoleInput | RolePermissionUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: RolePermissionCreateManyRoleInputEnvelope
    set?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    disconnect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    delete?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    update?: RolePermissionUpdateWithWhereUniqueWithoutRoleInput | RolePermissionUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: RolePermissionUpdateManyWithWhereWithoutRoleInput | RolePermissionUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
  }

  export type RolePermissionCreateNestedManyWithoutPermissionInput = {
    create?: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput> | RolePermissionCreateWithoutPermissionInput[] | RolePermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutPermissionInput | RolePermissionCreateOrConnectWithoutPermissionInput[]
    createMany?: RolePermissionCreateManyPermissionInputEnvelope
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
  }

  export type RolePermissionUncheckedCreateNestedManyWithoutPermissionInput = {
    create?: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput> | RolePermissionCreateWithoutPermissionInput[] | RolePermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutPermissionInput | RolePermissionCreateOrConnectWithoutPermissionInput[]
    createMany?: RolePermissionCreateManyPermissionInputEnvelope
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
  }

  export type RolePermissionUpdateManyWithoutPermissionNestedInput = {
    create?: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput> | RolePermissionCreateWithoutPermissionInput[] | RolePermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutPermissionInput | RolePermissionCreateOrConnectWithoutPermissionInput[]
    upsert?: RolePermissionUpsertWithWhereUniqueWithoutPermissionInput | RolePermissionUpsertWithWhereUniqueWithoutPermissionInput[]
    createMany?: RolePermissionCreateManyPermissionInputEnvelope
    set?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    disconnect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    delete?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    update?: RolePermissionUpdateWithWhereUniqueWithoutPermissionInput | RolePermissionUpdateWithWhereUniqueWithoutPermissionInput[]
    updateMany?: RolePermissionUpdateManyWithWhereWithoutPermissionInput | RolePermissionUpdateManyWithWhereWithoutPermissionInput[]
    deleteMany?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
  }

  export type RolePermissionUncheckedUpdateManyWithoutPermissionNestedInput = {
    create?: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput> | RolePermissionCreateWithoutPermissionInput[] | RolePermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutPermissionInput | RolePermissionCreateOrConnectWithoutPermissionInput[]
    upsert?: RolePermissionUpsertWithWhereUniqueWithoutPermissionInput | RolePermissionUpsertWithWhereUniqueWithoutPermissionInput[]
    createMany?: RolePermissionCreateManyPermissionInputEnvelope
    set?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    disconnect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    delete?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    update?: RolePermissionUpdateWithWhereUniqueWithoutPermissionInput | RolePermissionUpdateWithWhereUniqueWithoutPermissionInput[]
    updateMany?: RolePermissionUpdateManyWithWhereWithoutPermissionInput | RolePermissionUpdateManyWithWhereWithoutPermissionInput[]
    deleteMany?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
  }

  export type OrganizationRoleCreateNestedOneWithoutPermissionsInput = {
    create?: XOR<OrganizationRoleCreateWithoutPermissionsInput, OrganizationRoleUncheckedCreateWithoutPermissionsInput>
    connectOrCreate?: OrganizationRoleCreateOrConnectWithoutPermissionsInput
    connect?: OrganizationRoleWhereUniqueInput
  }

  export type PermissionCreateNestedOneWithoutRolesInput = {
    create?: XOR<PermissionCreateWithoutRolesInput, PermissionUncheckedCreateWithoutRolesInput>
    connectOrCreate?: PermissionCreateOrConnectWithoutRolesInput
    connect?: PermissionWhereUniqueInput
  }

  export type OrganizationRoleUpdateOneRequiredWithoutPermissionsNestedInput = {
    create?: XOR<OrganizationRoleCreateWithoutPermissionsInput, OrganizationRoleUncheckedCreateWithoutPermissionsInput>
    connectOrCreate?: OrganizationRoleCreateOrConnectWithoutPermissionsInput
    upsert?: OrganizationRoleUpsertWithoutPermissionsInput
    connect?: OrganizationRoleWhereUniqueInput
    update?: XOR<XOR<OrganizationRoleUpdateToOneWithWhereWithoutPermissionsInput, OrganizationRoleUpdateWithoutPermissionsInput>, OrganizationRoleUncheckedUpdateWithoutPermissionsInput>
  }

  export type PermissionUpdateOneRequiredWithoutRolesNestedInput = {
    create?: XOR<PermissionCreateWithoutRolesInput, PermissionUncheckedCreateWithoutRolesInput>
    connectOrCreate?: PermissionCreateOrConnectWithoutRolesInput
    upsert?: PermissionUpsertWithoutRolesInput
    connect?: PermissionWhereUniqueInput
    update?: XOR<XOR<PermissionUpdateToOneWithWhereWithoutRolesInput, PermissionUpdateWithoutRolesInput>, PermissionUncheckedUpdateWithoutRolesInput>
  }

  export type OrganizationCreateNestedOneWithoutAudit_logsInput = {
    create?: XOR<OrganizationCreateWithoutAudit_logsInput, OrganizationUncheckedCreateWithoutAudit_logsInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutAudit_logsInput
    connect?: OrganizationWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAudit_logsInput = {
    create?: XOR<UserCreateWithoutAudit_logsInput, UserUncheckedCreateWithoutAudit_logsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAudit_logsInput
    connect?: UserWhereUniqueInput
  }

  export type OrganizationUpdateOneRequiredWithoutAudit_logsNestedInput = {
    create?: XOR<OrganizationCreateWithoutAudit_logsInput, OrganizationUncheckedCreateWithoutAudit_logsInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutAudit_logsInput
    upsert?: OrganizationUpsertWithoutAudit_logsInput
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutAudit_logsInput, OrganizationUpdateWithoutAudit_logsInput>, OrganizationUncheckedUpdateWithoutAudit_logsInput>
  }

  export type UserUpdateOneRequiredWithoutAudit_logsNestedInput = {
    create?: XOR<UserCreateWithoutAudit_logsInput, UserUncheckedCreateWithoutAudit_logsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAudit_logsInput
    upsert?: UserUpsertWithoutAudit_logsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAudit_logsInput, UserUpdateWithoutAudit_logsInput>, UserUncheckedUpdateWithoutAudit_logsInput>
  }

  export type OrganizationCreateNestedOneWithoutIntegrationsInput = {
    create?: XOR<OrganizationCreateWithoutIntegrationsInput, OrganizationUncheckedCreateWithoutIntegrationsInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutIntegrationsInput
    connect?: OrganizationWhereUniqueInput
  }

  export type IntegrationActionCreateNestedManyWithoutIntegrationInput = {
    create?: XOR<IntegrationActionCreateWithoutIntegrationInput, IntegrationActionUncheckedCreateWithoutIntegrationInput> | IntegrationActionCreateWithoutIntegrationInput[] | IntegrationActionUncheckedCreateWithoutIntegrationInput[]
    connectOrCreate?: IntegrationActionCreateOrConnectWithoutIntegrationInput | IntegrationActionCreateOrConnectWithoutIntegrationInput[]
    createMany?: IntegrationActionCreateManyIntegrationInputEnvelope
    connect?: IntegrationActionWhereUniqueInput | IntegrationActionWhereUniqueInput[]
  }

  export type DatabaseIntegrationCreateNestedOneWithoutIntegrationInput = {
    create?: XOR<DatabaseIntegrationCreateWithoutIntegrationInput, DatabaseIntegrationUncheckedCreateWithoutIntegrationInput>
    connectOrCreate?: DatabaseIntegrationCreateOrConnectWithoutIntegrationInput
    connect?: DatabaseIntegrationWhereUniqueInput
  }

  export type OpenApiIntegrationCreateNestedOneWithoutIntegrationInput = {
    create?: XOR<OpenApiIntegrationCreateWithoutIntegrationInput, OpenApiIntegrationUncheckedCreateWithoutIntegrationInput>
    connectOrCreate?: OpenApiIntegrationCreateOrConnectWithoutIntegrationInput
    connect?: OpenApiIntegrationWhereUniqueInput
  }

  export type McpIntegrationCreateNestedOneWithoutIntegrationInput = {
    create?: XOR<McpIntegrationCreateWithoutIntegrationInput, McpIntegrationUncheckedCreateWithoutIntegrationInput>
    connectOrCreate?: McpIntegrationCreateOrConnectWithoutIntegrationInput
    connect?: McpIntegrationWhereUniqueInput
  }

  export type IntegrationActionUncheckedCreateNestedManyWithoutIntegrationInput = {
    create?: XOR<IntegrationActionCreateWithoutIntegrationInput, IntegrationActionUncheckedCreateWithoutIntegrationInput> | IntegrationActionCreateWithoutIntegrationInput[] | IntegrationActionUncheckedCreateWithoutIntegrationInput[]
    connectOrCreate?: IntegrationActionCreateOrConnectWithoutIntegrationInput | IntegrationActionCreateOrConnectWithoutIntegrationInput[]
    createMany?: IntegrationActionCreateManyIntegrationInputEnvelope
    connect?: IntegrationActionWhereUniqueInput | IntegrationActionWhereUniqueInput[]
  }

  export type DatabaseIntegrationUncheckedCreateNestedOneWithoutIntegrationInput = {
    create?: XOR<DatabaseIntegrationCreateWithoutIntegrationInput, DatabaseIntegrationUncheckedCreateWithoutIntegrationInput>
    connectOrCreate?: DatabaseIntegrationCreateOrConnectWithoutIntegrationInput
    connect?: DatabaseIntegrationWhereUniqueInput
  }

  export type OpenApiIntegrationUncheckedCreateNestedOneWithoutIntegrationInput = {
    create?: XOR<OpenApiIntegrationCreateWithoutIntegrationInput, OpenApiIntegrationUncheckedCreateWithoutIntegrationInput>
    connectOrCreate?: OpenApiIntegrationCreateOrConnectWithoutIntegrationInput
    connect?: OpenApiIntegrationWhereUniqueInput
  }

  export type McpIntegrationUncheckedCreateNestedOneWithoutIntegrationInput = {
    create?: XOR<McpIntegrationCreateWithoutIntegrationInput, McpIntegrationUncheckedCreateWithoutIntegrationInput>
    connectOrCreate?: McpIntegrationCreateOrConnectWithoutIntegrationInput
    connect?: McpIntegrationWhereUniqueInput
  }

  export type EnumIntegrationProviderFieldUpdateOperationsInput = {
    set?: $Enums.IntegrationProvider
  }

  export type EnumIntegrationStatusFieldUpdateOperationsInput = {
    set?: $Enums.IntegrationStatus
  }

  export type OrganizationUpdateOneRequiredWithoutIntegrationsNestedInput = {
    create?: XOR<OrganizationCreateWithoutIntegrationsInput, OrganizationUncheckedCreateWithoutIntegrationsInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutIntegrationsInput
    upsert?: OrganizationUpsertWithoutIntegrationsInput
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutIntegrationsInput, OrganizationUpdateWithoutIntegrationsInput>, OrganizationUncheckedUpdateWithoutIntegrationsInput>
  }

  export type IntegrationActionUpdateManyWithoutIntegrationNestedInput = {
    create?: XOR<IntegrationActionCreateWithoutIntegrationInput, IntegrationActionUncheckedCreateWithoutIntegrationInput> | IntegrationActionCreateWithoutIntegrationInput[] | IntegrationActionUncheckedCreateWithoutIntegrationInput[]
    connectOrCreate?: IntegrationActionCreateOrConnectWithoutIntegrationInput | IntegrationActionCreateOrConnectWithoutIntegrationInput[]
    upsert?: IntegrationActionUpsertWithWhereUniqueWithoutIntegrationInput | IntegrationActionUpsertWithWhereUniqueWithoutIntegrationInput[]
    createMany?: IntegrationActionCreateManyIntegrationInputEnvelope
    set?: IntegrationActionWhereUniqueInput | IntegrationActionWhereUniqueInput[]
    disconnect?: IntegrationActionWhereUniqueInput | IntegrationActionWhereUniqueInput[]
    delete?: IntegrationActionWhereUniqueInput | IntegrationActionWhereUniqueInput[]
    connect?: IntegrationActionWhereUniqueInput | IntegrationActionWhereUniqueInput[]
    update?: IntegrationActionUpdateWithWhereUniqueWithoutIntegrationInput | IntegrationActionUpdateWithWhereUniqueWithoutIntegrationInput[]
    updateMany?: IntegrationActionUpdateManyWithWhereWithoutIntegrationInput | IntegrationActionUpdateManyWithWhereWithoutIntegrationInput[]
    deleteMany?: IntegrationActionScalarWhereInput | IntegrationActionScalarWhereInput[]
  }

  export type DatabaseIntegrationUpdateOneWithoutIntegrationNestedInput = {
    create?: XOR<DatabaseIntegrationCreateWithoutIntegrationInput, DatabaseIntegrationUncheckedCreateWithoutIntegrationInput>
    connectOrCreate?: DatabaseIntegrationCreateOrConnectWithoutIntegrationInput
    upsert?: DatabaseIntegrationUpsertWithoutIntegrationInput
    disconnect?: DatabaseIntegrationWhereInput | boolean
    delete?: DatabaseIntegrationWhereInput | boolean
    connect?: DatabaseIntegrationWhereUniqueInput
    update?: XOR<XOR<DatabaseIntegrationUpdateToOneWithWhereWithoutIntegrationInput, DatabaseIntegrationUpdateWithoutIntegrationInput>, DatabaseIntegrationUncheckedUpdateWithoutIntegrationInput>
  }

  export type OpenApiIntegrationUpdateOneWithoutIntegrationNestedInput = {
    create?: XOR<OpenApiIntegrationCreateWithoutIntegrationInput, OpenApiIntegrationUncheckedCreateWithoutIntegrationInput>
    connectOrCreate?: OpenApiIntegrationCreateOrConnectWithoutIntegrationInput
    upsert?: OpenApiIntegrationUpsertWithoutIntegrationInput
    disconnect?: OpenApiIntegrationWhereInput | boolean
    delete?: OpenApiIntegrationWhereInput | boolean
    connect?: OpenApiIntegrationWhereUniqueInput
    update?: XOR<XOR<OpenApiIntegrationUpdateToOneWithWhereWithoutIntegrationInput, OpenApiIntegrationUpdateWithoutIntegrationInput>, OpenApiIntegrationUncheckedUpdateWithoutIntegrationInput>
  }

  export type McpIntegrationUpdateOneWithoutIntegrationNestedInput = {
    create?: XOR<McpIntegrationCreateWithoutIntegrationInput, McpIntegrationUncheckedCreateWithoutIntegrationInput>
    connectOrCreate?: McpIntegrationCreateOrConnectWithoutIntegrationInput
    upsert?: McpIntegrationUpsertWithoutIntegrationInput
    disconnect?: McpIntegrationWhereInput | boolean
    delete?: McpIntegrationWhereInput | boolean
    connect?: McpIntegrationWhereUniqueInput
    update?: XOR<XOR<McpIntegrationUpdateToOneWithWhereWithoutIntegrationInput, McpIntegrationUpdateWithoutIntegrationInput>, McpIntegrationUncheckedUpdateWithoutIntegrationInput>
  }

  export type IntegrationActionUncheckedUpdateManyWithoutIntegrationNestedInput = {
    create?: XOR<IntegrationActionCreateWithoutIntegrationInput, IntegrationActionUncheckedCreateWithoutIntegrationInput> | IntegrationActionCreateWithoutIntegrationInput[] | IntegrationActionUncheckedCreateWithoutIntegrationInput[]
    connectOrCreate?: IntegrationActionCreateOrConnectWithoutIntegrationInput | IntegrationActionCreateOrConnectWithoutIntegrationInput[]
    upsert?: IntegrationActionUpsertWithWhereUniqueWithoutIntegrationInput | IntegrationActionUpsertWithWhereUniqueWithoutIntegrationInput[]
    createMany?: IntegrationActionCreateManyIntegrationInputEnvelope
    set?: IntegrationActionWhereUniqueInput | IntegrationActionWhereUniqueInput[]
    disconnect?: IntegrationActionWhereUniqueInput | IntegrationActionWhereUniqueInput[]
    delete?: IntegrationActionWhereUniqueInput | IntegrationActionWhereUniqueInput[]
    connect?: IntegrationActionWhereUniqueInput | IntegrationActionWhereUniqueInput[]
    update?: IntegrationActionUpdateWithWhereUniqueWithoutIntegrationInput | IntegrationActionUpdateWithWhereUniqueWithoutIntegrationInput[]
    updateMany?: IntegrationActionUpdateManyWithWhereWithoutIntegrationInput | IntegrationActionUpdateManyWithWhereWithoutIntegrationInput[]
    deleteMany?: IntegrationActionScalarWhereInput | IntegrationActionScalarWhereInput[]
  }

  export type DatabaseIntegrationUncheckedUpdateOneWithoutIntegrationNestedInput = {
    create?: XOR<DatabaseIntegrationCreateWithoutIntegrationInput, DatabaseIntegrationUncheckedCreateWithoutIntegrationInput>
    connectOrCreate?: DatabaseIntegrationCreateOrConnectWithoutIntegrationInput
    upsert?: DatabaseIntegrationUpsertWithoutIntegrationInput
    disconnect?: DatabaseIntegrationWhereInput | boolean
    delete?: DatabaseIntegrationWhereInput | boolean
    connect?: DatabaseIntegrationWhereUniqueInput
    update?: XOR<XOR<DatabaseIntegrationUpdateToOneWithWhereWithoutIntegrationInput, DatabaseIntegrationUpdateWithoutIntegrationInput>, DatabaseIntegrationUncheckedUpdateWithoutIntegrationInput>
  }

  export type OpenApiIntegrationUncheckedUpdateOneWithoutIntegrationNestedInput = {
    create?: XOR<OpenApiIntegrationCreateWithoutIntegrationInput, OpenApiIntegrationUncheckedCreateWithoutIntegrationInput>
    connectOrCreate?: OpenApiIntegrationCreateOrConnectWithoutIntegrationInput
    upsert?: OpenApiIntegrationUpsertWithoutIntegrationInput
    disconnect?: OpenApiIntegrationWhereInput | boolean
    delete?: OpenApiIntegrationWhereInput | boolean
    connect?: OpenApiIntegrationWhereUniqueInput
    update?: XOR<XOR<OpenApiIntegrationUpdateToOneWithWhereWithoutIntegrationInput, OpenApiIntegrationUpdateWithoutIntegrationInput>, OpenApiIntegrationUncheckedUpdateWithoutIntegrationInput>
  }

  export type McpIntegrationUncheckedUpdateOneWithoutIntegrationNestedInput = {
    create?: XOR<McpIntegrationCreateWithoutIntegrationInput, McpIntegrationUncheckedCreateWithoutIntegrationInput>
    connectOrCreate?: McpIntegrationCreateOrConnectWithoutIntegrationInput
    upsert?: McpIntegrationUpsertWithoutIntegrationInput
    disconnect?: McpIntegrationWhereInput | boolean
    delete?: McpIntegrationWhereInput | boolean
    connect?: McpIntegrationWhereUniqueInput
    update?: XOR<XOR<McpIntegrationUpdateToOneWithWhereWithoutIntegrationInput, McpIntegrationUpdateWithoutIntegrationInput>, McpIntegrationUncheckedUpdateWithoutIntegrationInput>
  }

  export type DatabaseIntegrationCreateallowed_opsInput = {
    set: $Enums.DatabaseOperation[]
  }

  export type IntegrationCreateNestedOneWithoutDatabaseInput = {
    create?: XOR<IntegrationCreateWithoutDatabaseInput, IntegrationUncheckedCreateWithoutDatabaseInput>
    connectOrCreate?: IntegrationCreateOrConnectWithoutDatabaseInput
    connect?: IntegrationWhereUniqueInput
  }

  export type EnumDatabaseTypeFieldUpdateOperationsInput = {
    set?: $Enums.DatabaseType
  }

  export type DatabaseIntegrationUpdateallowed_opsInput = {
    set?: $Enums.DatabaseOperation[]
    push?: $Enums.DatabaseOperation | $Enums.DatabaseOperation[]
  }

  export type IntegrationUpdateOneRequiredWithoutDatabaseNestedInput = {
    create?: XOR<IntegrationCreateWithoutDatabaseInput, IntegrationUncheckedCreateWithoutDatabaseInput>
    connectOrCreate?: IntegrationCreateOrConnectWithoutDatabaseInput
    upsert?: IntegrationUpsertWithoutDatabaseInput
    connect?: IntegrationWhereUniqueInput
    update?: XOR<XOR<IntegrationUpdateToOneWithWhereWithoutDatabaseInput, IntegrationUpdateWithoutDatabaseInput>, IntegrationUncheckedUpdateWithoutDatabaseInput>
  }

  export type IntegrationCreateNestedOneWithoutOpenapiInput = {
    create?: XOR<IntegrationCreateWithoutOpenapiInput, IntegrationUncheckedCreateWithoutOpenapiInput>
    connectOrCreate?: IntegrationCreateOrConnectWithoutOpenapiInput
    connect?: IntegrationWhereUniqueInput
  }

  export type EnumOpenApiAuthTypeFieldUpdateOperationsInput = {
    set?: $Enums.OpenApiAuthType
  }

  export type IntegrationUpdateOneRequiredWithoutOpenapiNestedInput = {
    create?: XOR<IntegrationCreateWithoutOpenapiInput, IntegrationUncheckedCreateWithoutOpenapiInput>
    connectOrCreate?: IntegrationCreateOrConnectWithoutOpenapiInput
    upsert?: IntegrationUpsertWithoutOpenapiInput
    connect?: IntegrationWhereUniqueInput
    update?: XOR<XOR<IntegrationUpdateToOneWithWhereWithoutOpenapiInput, IntegrationUpdateWithoutOpenapiInput>, IntegrationUncheckedUpdateWithoutOpenapiInput>
  }

  export type IntegrationCreateNestedOneWithoutMcpInput = {
    create?: XOR<IntegrationCreateWithoutMcpInput, IntegrationUncheckedCreateWithoutMcpInput>
    connectOrCreate?: IntegrationCreateOrConnectWithoutMcpInput
    connect?: IntegrationWhereUniqueInput
  }

  export type EnumMcpTransportTypeFieldUpdateOperationsInput = {
    set?: $Enums.McpTransportType
  }

  export type EnumMcpAuthTypeFieldUpdateOperationsInput = {
    set?: $Enums.McpAuthType
  }

  export type IntegrationUpdateOneRequiredWithoutMcpNestedInput = {
    create?: XOR<IntegrationCreateWithoutMcpInput, IntegrationUncheckedCreateWithoutMcpInput>
    connectOrCreate?: IntegrationCreateOrConnectWithoutMcpInput
    upsert?: IntegrationUpsertWithoutMcpInput
    connect?: IntegrationWhereUniqueInput
    update?: XOR<XOR<IntegrationUpdateToOneWithWhereWithoutMcpInput, IntegrationUpdateWithoutMcpInput>, IntegrationUncheckedUpdateWithoutMcpInput>
  }

  export type IntegrationCreateNestedOneWithoutActionsInput = {
    create?: XOR<IntegrationCreateWithoutActionsInput, IntegrationUncheckedCreateWithoutActionsInput>
    connectOrCreate?: IntegrationCreateOrConnectWithoutActionsInput
    connect?: IntegrationWhereUniqueInput
  }

  export type IntegrationUpdateOneRequiredWithoutActionsNestedInput = {
    create?: XOR<IntegrationCreateWithoutActionsInput, IntegrationUncheckedCreateWithoutActionsInput>
    connectOrCreate?: IntegrationCreateOrConnectWithoutActionsInput
    upsert?: IntegrationUpsertWithoutActionsInput
    connect?: IntegrationWhereUniqueInput
    update?: XOR<XOR<IntegrationUpdateToOneWithWhereWithoutActionsInput, IntegrationUpdateWithoutActionsInput>, IntegrationUncheckedUpdateWithoutActionsInput>
  }

  export type EnumDocumentTypeFieldUpdateOperationsInput = {
    set?: $Enums.DocumentType
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumAuthRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthRole | EnumAuthRoleFieldRefInput<$PrismaModel>
    in?: $Enums.AuthRole[] | ListEnumAuthRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthRole[] | ListEnumAuthRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthRoleFilter<$PrismaModel> | $Enums.AuthRole
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
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
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumAuthRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthRole | EnumAuthRoleFieldRefInput<$PrismaModel>
    in?: $Enums.AuthRole[] | ListEnumAuthRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthRole[] | ListEnumAuthRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthRoleWithAggregatesFilter<$PrismaModel> | $Enums.AuthRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuthRoleFilter<$PrismaModel>
    _max?: NestedEnumAuthRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumOrganizationMemberStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OrganizationMemberStatus | EnumOrganizationMemberStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrganizationMemberStatus[] | ListEnumOrganizationMemberStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrganizationMemberStatus[] | ListEnumOrganizationMemberStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrganizationMemberStatusFilter<$PrismaModel> | $Enums.OrganizationMemberStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumOrganizationMemberStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrganizationMemberStatus | EnumOrganizationMemberStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrganizationMemberStatus[] | ListEnumOrganizationMemberStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrganizationMemberStatus[] | ListEnumOrganizationMemberStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrganizationMemberStatusWithAggregatesFilter<$PrismaModel> | $Enums.OrganizationMemberStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrganizationMemberStatusFilter<$PrismaModel>
    _max?: NestedEnumOrganizationMemberStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumIntegrationProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.IntegrationProvider | EnumIntegrationProviderFieldRefInput<$PrismaModel>
    in?: $Enums.IntegrationProvider[] | ListEnumIntegrationProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntegrationProvider[] | ListEnumIntegrationProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumIntegrationProviderFilter<$PrismaModel> | $Enums.IntegrationProvider
  }

  export type NestedEnumIntegrationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.IntegrationStatus | EnumIntegrationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.IntegrationStatus[] | ListEnumIntegrationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntegrationStatus[] | ListEnumIntegrationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumIntegrationStatusFilter<$PrismaModel> | $Enums.IntegrationStatus
  }

  export type NestedEnumIntegrationProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IntegrationProvider | EnumIntegrationProviderFieldRefInput<$PrismaModel>
    in?: $Enums.IntegrationProvider[] | ListEnumIntegrationProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntegrationProvider[] | ListEnumIntegrationProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumIntegrationProviderWithAggregatesFilter<$PrismaModel> | $Enums.IntegrationProvider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumIntegrationProviderFilter<$PrismaModel>
    _max?: NestedEnumIntegrationProviderFilter<$PrismaModel>
  }

  export type NestedEnumIntegrationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IntegrationStatus | EnumIntegrationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.IntegrationStatus[] | ListEnumIntegrationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.IntegrationStatus[] | ListEnumIntegrationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumIntegrationStatusWithAggregatesFilter<$PrismaModel> | $Enums.IntegrationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumIntegrationStatusFilter<$PrismaModel>
    _max?: NestedEnumIntegrationStatusFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumDatabaseTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DatabaseType | EnumDatabaseTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DatabaseType[] | ListEnumDatabaseTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DatabaseType[] | ListEnumDatabaseTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDatabaseTypeFilter<$PrismaModel> | $Enums.DatabaseType
  }

  export type NestedEnumDatabaseTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DatabaseType | EnumDatabaseTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DatabaseType[] | ListEnumDatabaseTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DatabaseType[] | ListEnumDatabaseTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDatabaseTypeWithAggregatesFilter<$PrismaModel> | $Enums.DatabaseType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDatabaseTypeFilter<$PrismaModel>
    _max?: NestedEnumDatabaseTypeFilter<$PrismaModel>
  }

  export type NestedEnumOpenApiAuthTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.OpenApiAuthType | EnumOpenApiAuthTypeFieldRefInput<$PrismaModel>
    in?: $Enums.OpenApiAuthType[] | ListEnumOpenApiAuthTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.OpenApiAuthType[] | ListEnumOpenApiAuthTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumOpenApiAuthTypeFilter<$PrismaModel> | $Enums.OpenApiAuthType
  }

  export type NestedEnumOpenApiAuthTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OpenApiAuthType | EnumOpenApiAuthTypeFieldRefInput<$PrismaModel>
    in?: $Enums.OpenApiAuthType[] | ListEnumOpenApiAuthTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.OpenApiAuthType[] | ListEnumOpenApiAuthTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumOpenApiAuthTypeWithAggregatesFilter<$PrismaModel> | $Enums.OpenApiAuthType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOpenApiAuthTypeFilter<$PrismaModel>
    _max?: NestedEnumOpenApiAuthTypeFilter<$PrismaModel>
  }

  export type NestedEnumMcpTransportTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.McpTransportType | EnumMcpTransportTypeFieldRefInput<$PrismaModel>
    in?: $Enums.McpTransportType[] | ListEnumMcpTransportTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.McpTransportType[] | ListEnumMcpTransportTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMcpTransportTypeFilter<$PrismaModel> | $Enums.McpTransportType
  }

  export type NestedEnumMcpAuthTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.McpAuthType | EnumMcpAuthTypeFieldRefInput<$PrismaModel>
    in?: $Enums.McpAuthType[] | ListEnumMcpAuthTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.McpAuthType[] | ListEnumMcpAuthTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMcpAuthTypeFilter<$PrismaModel> | $Enums.McpAuthType
  }

  export type NestedEnumMcpTransportTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.McpTransportType | EnumMcpTransportTypeFieldRefInput<$PrismaModel>
    in?: $Enums.McpTransportType[] | ListEnumMcpTransportTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.McpTransportType[] | ListEnumMcpTransportTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMcpTransportTypeWithAggregatesFilter<$PrismaModel> | $Enums.McpTransportType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMcpTransportTypeFilter<$PrismaModel>
    _max?: NestedEnumMcpTransportTypeFilter<$PrismaModel>
  }

  export type NestedEnumMcpAuthTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.McpAuthType | EnumMcpAuthTypeFieldRefInput<$PrismaModel>
    in?: $Enums.McpAuthType[] | ListEnumMcpAuthTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.McpAuthType[] | ListEnumMcpAuthTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMcpAuthTypeWithAggregatesFilter<$PrismaModel> | $Enums.McpAuthType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMcpAuthTypeFilter<$PrismaModel>
    _max?: NestedEnumMcpAuthTypeFilter<$PrismaModel>
  }

  export type NestedEnumDocumentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeFilter<$PrismaModel> | $Enums.DocumentType
  }

  export type NestedEnumDocumentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeWithAggregatesFilter<$PrismaModel> | $Enums.DocumentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentTypeFilter<$PrismaModel>
    _max?: NestedEnumDocumentTypeFilter<$PrismaModel>
  }

  export type OrganizationMemberCreateWithoutUserInput = {
    uuid?: string
    status?: $Enums.OrganizationMemberStatus
    invited_at?: Date | string
    joined_at?: Date | string | null
    organization: OrganizationCreateNestedOneWithoutMembersInput
    role: OrganizationRoleCreateNestedOneWithoutMembersInput
  }

  export type OrganizationMemberUncheckedCreateWithoutUserInput = {
    id?: number
    uuid?: string
    org_uuid: string
    role_uuid: string
    status?: $Enums.OrganizationMemberStatus
    invited_at?: Date | string
    joined_at?: Date | string | null
  }

  export type OrganizationMemberCreateOrConnectWithoutUserInput = {
    where: OrganizationMemberWhereUniqueInput
    create: XOR<OrganizationMemberCreateWithoutUserInput, OrganizationMemberUncheckedCreateWithoutUserInput>
  }

  export type OrganizationMemberCreateManyUserInputEnvelope = {
    data: OrganizationMemberCreateManyUserInput | OrganizationMemberCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AuditLogCreateWithoutUserInput = {
    uuid?: string
    action: string
    resource_type: string
    resource_id?: string | null
    metadata: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    organization: OrganizationCreateNestedOneWithoutAudit_logsInput
  }

  export type AuditLogUncheckedCreateWithoutUserInput = {
    id?: number
    uuid?: string
    org_uuid: string
    action: string
    resource_type: string
    resource_id?: string | null
    metadata: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogCreateManyUserInputEnvelope = {
    data: AuditLogCreateManyUserInput | AuditLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type OrganizationMemberUpsertWithWhereUniqueWithoutUserInput = {
    where: OrganizationMemberWhereUniqueInput
    update: XOR<OrganizationMemberUpdateWithoutUserInput, OrganizationMemberUncheckedUpdateWithoutUserInput>
    create: XOR<OrganizationMemberCreateWithoutUserInput, OrganizationMemberUncheckedCreateWithoutUserInput>
  }

  export type OrganizationMemberUpdateWithWhereUniqueWithoutUserInput = {
    where: OrganizationMemberWhereUniqueInput
    data: XOR<OrganizationMemberUpdateWithoutUserInput, OrganizationMemberUncheckedUpdateWithoutUserInput>
  }

  export type OrganizationMemberUpdateManyWithWhereWithoutUserInput = {
    where: OrganizationMemberScalarWhereInput
    data: XOR<OrganizationMemberUpdateManyMutationInput, OrganizationMemberUncheckedUpdateManyWithoutUserInput>
  }

  export type OrganizationMemberScalarWhereInput = {
    AND?: OrganizationMemberScalarWhereInput | OrganizationMemberScalarWhereInput[]
    OR?: OrganizationMemberScalarWhereInput[]
    NOT?: OrganizationMemberScalarWhereInput | OrganizationMemberScalarWhereInput[]
    id?: IntFilter<"OrganizationMember"> | number
    uuid?: StringFilter<"OrganizationMember"> | string
    org_uuid?: StringFilter<"OrganizationMember"> | string
    user_uuid?: StringFilter<"OrganizationMember"> | string
    role_uuid?: StringFilter<"OrganizationMember"> | string
    status?: EnumOrganizationMemberStatusFilter<"OrganizationMember"> | $Enums.OrganizationMemberStatus
    invited_at?: DateTimeFilter<"OrganizationMember"> | Date | string
    joined_at?: DateTimeNullableFilter<"OrganizationMember"> | Date | string | null
  }

  export type AuditLogUpsertWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutUserInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutUserInput>
  }

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    OR?: AuditLogScalarWhereInput[]
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    id?: IntFilter<"AuditLog"> | number
    uuid?: StringFilter<"AuditLog"> | string
    org_uuid?: StringFilter<"AuditLog"> | string
    user_uuid?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    resource_type?: StringFilter<"AuditLog"> | string
    resource_id?: StringNullableFilter<"AuditLog"> | string | null
    metadata?: JsonFilter<"AuditLog">
    created_at?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type OrganizationMemberCreateWithoutOrganizationInput = {
    uuid?: string
    status?: $Enums.OrganizationMemberStatus
    invited_at?: Date | string
    joined_at?: Date | string | null
    user: UserCreateNestedOneWithoutOrganization_membersInput
    role: OrganizationRoleCreateNestedOneWithoutMembersInput
  }

  export type OrganizationMemberUncheckedCreateWithoutOrganizationInput = {
    id?: number
    uuid?: string
    user_uuid: string
    role_uuid: string
    status?: $Enums.OrganizationMemberStatus
    invited_at?: Date | string
    joined_at?: Date | string | null
  }

  export type OrganizationMemberCreateOrConnectWithoutOrganizationInput = {
    where: OrganizationMemberWhereUniqueInput
    create: XOR<OrganizationMemberCreateWithoutOrganizationInput, OrganizationMemberUncheckedCreateWithoutOrganizationInput>
  }

  export type OrganizationMemberCreateManyOrganizationInputEnvelope = {
    data: OrganizationMemberCreateManyOrganizationInput | OrganizationMemberCreateManyOrganizationInput[]
    skipDuplicates?: boolean
  }

  export type OrganizationRoleCreateWithoutOrganizationInput = {
    uuid?: string
    name: string
    is_system?: boolean
    members?: OrganizationMemberCreateNestedManyWithoutRoleInput
    permissions?: RolePermissionCreateNestedManyWithoutRoleInput
  }

  export type OrganizationRoleUncheckedCreateWithoutOrganizationInput = {
    id?: number
    uuid?: string
    name: string
    is_system?: boolean
    members?: OrganizationMemberUncheckedCreateNestedManyWithoutRoleInput
    permissions?: RolePermissionUncheckedCreateNestedManyWithoutRoleInput
  }

  export type OrganizationRoleCreateOrConnectWithoutOrganizationInput = {
    where: OrganizationRoleWhereUniqueInput
    create: XOR<OrganizationRoleCreateWithoutOrganizationInput, OrganizationRoleUncheckedCreateWithoutOrganizationInput>
  }

  export type OrganizationRoleCreateManyOrganizationInputEnvelope = {
    data: OrganizationRoleCreateManyOrganizationInput | OrganizationRoleCreateManyOrganizationInput[]
    skipDuplicates?: boolean
  }

  export type AuditLogCreateWithoutOrganizationInput = {
    uuid?: string
    action: string
    resource_type: string
    resource_id?: string | null
    metadata: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    user: UserCreateNestedOneWithoutAudit_logsInput
  }

  export type AuditLogUncheckedCreateWithoutOrganizationInput = {
    id?: number
    uuid?: string
    user_uuid: string
    action: string
    resource_type: string
    resource_id?: string | null
    metadata: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutOrganizationInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutOrganizationInput, AuditLogUncheckedCreateWithoutOrganizationInput>
  }

  export type AuditLogCreateManyOrganizationInputEnvelope = {
    data: AuditLogCreateManyOrganizationInput | AuditLogCreateManyOrganizationInput[]
    skipDuplicates?: boolean
  }

  export type IntegrationCreateWithoutOrganizationInput = {
    uuid?: string
    name: string
    description?: string | null
    provider: $Enums.IntegrationProvider
    status?: $Enums.IntegrationStatus
    config: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    actions?: IntegrationActionCreateNestedManyWithoutIntegrationInput
    database?: DatabaseIntegrationCreateNestedOneWithoutIntegrationInput
    openapi?: OpenApiIntegrationCreateNestedOneWithoutIntegrationInput
    mcp?: McpIntegrationCreateNestedOneWithoutIntegrationInput
  }

  export type IntegrationUncheckedCreateWithoutOrganizationInput = {
    id?: number
    uuid?: string
    name: string
    description?: string | null
    provider: $Enums.IntegrationProvider
    status?: $Enums.IntegrationStatus
    config: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    actions?: IntegrationActionUncheckedCreateNestedManyWithoutIntegrationInput
    database?: DatabaseIntegrationUncheckedCreateNestedOneWithoutIntegrationInput
    openapi?: OpenApiIntegrationUncheckedCreateNestedOneWithoutIntegrationInput
    mcp?: McpIntegrationUncheckedCreateNestedOneWithoutIntegrationInput
  }

  export type IntegrationCreateOrConnectWithoutOrganizationInput = {
    where: IntegrationWhereUniqueInput
    create: XOR<IntegrationCreateWithoutOrganizationInput, IntegrationUncheckedCreateWithoutOrganizationInput>
  }

  export type IntegrationCreateManyOrganizationInputEnvelope = {
    data: IntegrationCreateManyOrganizationInput | IntegrationCreateManyOrganizationInput[]
    skipDuplicates?: boolean
  }

  export type OrganizationMemberUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: OrganizationMemberWhereUniqueInput
    update: XOR<OrganizationMemberUpdateWithoutOrganizationInput, OrganizationMemberUncheckedUpdateWithoutOrganizationInput>
    create: XOR<OrganizationMemberCreateWithoutOrganizationInput, OrganizationMemberUncheckedCreateWithoutOrganizationInput>
  }

  export type OrganizationMemberUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: OrganizationMemberWhereUniqueInput
    data: XOR<OrganizationMemberUpdateWithoutOrganizationInput, OrganizationMemberUncheckedUpdateWithoutOrganizationInput>
  }

  export type OrganizationMemberUpdateManyWithWhereWithoutOrganizationInput = {
    where: OrganizationMemberScalarWhereInput
    data: XOR<OrganizationMemberUpdateManyMutationInput, OrganizationMemberUncheckedUpdateManyWithoutOrganizationInput>
  }

  export type OrganizationRoleUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: OrganizationRoleWhereUniqueInput
    update: XOR<OrganizationRoleUpdateWithoutOrganizationInput, OrganizationRoleUncheckedUpdateWithoutOrganizationInput>
    create: XOR<OrganizationRoleCreateWithoutOrganizationInput, OrganizationRoleUncheckedCreateWithoutOrganizationInput>
  }

  export type OrganizationRoleUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: OrganizationRoleWhereUniqueInput
    data: XOR<OrganizationRoleUpdateWithoutOrganizationInput, OrganizationRoleUncheckedUpdateWithoutOrganizationInput>
  }

  export type OrganizationRoleUpdateManyWithWhereWithoutOrganizationInput = {
    where: OrganizationRoleScalarWhereInput
    data: XOR<OrganizationRoleUpdateManyMutationInput, OrganizationRoleUncheckedUpdateManyWithoutOrganizationInput>
  }

  export type OrganizationRoleScalarWhereInput = {
    AND?: OrganizationRoleScalarWhereInput | OrganizationRoleScalarWhereInput[]
    OR?: OrganizationRoleScalarWhereInput[]
    NOT?: OrganizationRoleScalarWhereInput | OrganizationRoleScalarWhereInput[]
    id?: IntFilter<"OrganizationRole"> | number
    uuid?: StringFilter<"OrganizationRole"> | string
    org_uuid?: StringFilter<"OrganizationRole"> | string
    name?: StringFilter<"OrganizationRole"> | string
    is_system?: BoolFilter<"OrganizationRole"> | boolean
  }

  export type AuditLogUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutOrganizationInput, AuditLogUncheckedUpdateWithoutOrganizationInput>
    create: XOR<AuditLogCreateWithoutOrganizationInput, AuditLogUncheckedCreateWithoutOrganizationInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutOrganizationInput, AuditLogUncheckedUpdateWithoutOrganizationInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutOrganizationInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutOrganizationInput>
  }

  export type IntegrationUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: IntegrationWhereUniqueInput
    update: XOR<IntegrationUpdateWithoutOrganizationInput, IntegrationUncheckedUpdateWithoutOrganizationInput>
    create: XOR<IntegrationCreateWithoutOrganizationInput, IntegrationUncheckedCreateWithoutOrganizationInput>
  }

  export type IntegrationUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: IntegrationWhereUniqueInput
    data: XOR<IntegrationUpdateWithoutOrganizationInput, IntegrationUncheckedUpdateWithoutOrganizationInput>
  }

  export type IntegrationUpdateManyWithWhereWithoutOrganizationInput = {
    where: IntegrationScalarWhereInput
    data: XOR<IntegrationUpdateManyMutationInput, IntegrationUncheckedUpdateManyWithoutOrganizationInput>
  }

  export type IntegrationScalarWhereInput = {
    AND?: IntegrationScalarWhereInput | IntegrationScalarWhereInput[]
    OR?: IntegrationScalarWhereInput[]
    NOT?: IntegrationScalarWhereInput | IntegrationScalarWhereInput[]
    id?: IntFilter<"Integration"> | number
    uuid?: StringFilter<"Integration"> | string
    org_uuid?: StringFilter<"Integration"> | string
    name?: StringFilter<"Integration"> | string
    description?: StringNullableFilter<"Integration"> | string | null
    provider?: EnumIntegrationProviderFilter<"Integration"> | $Enums.IntegrationProvider
    status?: EnumIntegrationStatusFilter<"Integration"> | $Enums.IntegrationStatus
    config?: StringFilter<"Integration"> | string
    metadata?: JsonNullableFilter<"Integration">
    created_at?: DateTimeFilter<"Integration"> | Date | string
    updated_at?: DateTimeFilter<"Integration"> | Date | string
  }

  export type OrganizationCreateWithoutMembersInput = {
    uuid?: string
    name: string
    slug: string
    logo_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    roles?: OrganizationRoleCreateNestedManyWithoutOrganizationInput
    audit_logs?: AuditLogCreateNestedManyWithoutOrganizationInput
    integrations?: IntegrationCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateWithoutMembersInput = {
    id?: number
    uuid?: string
    name: string
    slug: string
    logo_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    roles?: OrganizationRoleUncheckedCreateNestedManyWithoutOrganizationInput
    audit_logs?: AuditLogUncheckedCreateNestedManyWithoutOrganizationInput
    integrations?: IntegrationUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationCreateOrConnectWithoutMembersInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutMembersInput, OrganizationUncheckedCreateWithoutMembersInput>
  }

  export type UserCreateWithoutOrganization_membersInput = {
    uuid?: string
    email: string
    phone?: string | null
    password: string
    role: $Enums.AuthRole
    created_at?: Date | string
    updated_at?: Date | string
    audit_logs?: AuditLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOrganization_membersInput = {
    id?: number
    uuid?: string
    email: string
    phone?: string | null
    password: string
    role: $Enums.AuthRole
    created_at?: Date | string
    updated_at?: Date | string
    audit_logs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOrganization_membersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOrganization_membersInput, UserUncheckedCreateWithoutOrganization_membersInput>
  }

  export type OrganizationRoleCreateWithoutMembersInput = {
    uuid?: string
    name: string
    is_system?: boolean
    organization: OrganizationCreateNestedOneWithoutRolesInput
    permissions?: RolePermissionCreateNestedManyWithoutRoleInput
  }

  export type OrganizationRoleUncheckedCreateWithoutMembersInput = {
    id?: number
    uuid?: string
    org_uuid: string
    name: string
    is_system?: boolean
    permissions?: RolePermissionUncheckedCreateNestedManyWithoutRoleInput
  }

  export type OrganizationRoleCreateOrConnectWithoutMembersInput = {
    where: OrganizationRoleWhereUniqueInput
    create: XOR<OrganizationRoleCreateWithoutMembersInput, OrganizationRoleUncheckedCreateWithoutMembersInput>
  }

  export type OrganizationUpsertWithoutMembersInput = {
    update: XOR<OrganizationUpdateWithoutMembersInput, OrganizationUncheckedUpdateWithoutMembersInput>
    create: XOR<OrganizationCreateWithoutMembersInput, OrganizationUncheckedCreateWithoutMembersInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutMembersInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutMembersInput, OrganizationUncheckedUpdateWithoutMembersInput>
  }

  export type OrganizationUpdateWithoutMembersInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    roles?: OrganizationRoleUpdateManyWithoutOrganizationNestedInput
    audit_logs?: AuditLogUpdateManyWithoutOrganizationNestedInput
    integrations?: IntegrationUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutMembersInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    roles?: OrganizationRoleUncheckedUpdateManyWithoutOrganizationNestedInput
    audit_logs?: AuditLogUncheckedUpdateManyWithoutOrganizationNestedInput
    integrations?: IntegrationUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type UserUpsertWithoutOrganization_membersInput = {
    update: XOR<UserUpdateWithoutOrganization_membersInput, UserUncheckedUpdateWithoutOrganization_membersInput>
    create: XOR<UserCreateWithoutOrganization_membersInput, UserUncheckedCreateWithoutOrganization_membersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOrganization_membersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOrganization_membersInput, UserUncheckedUpdateWithoutOrganization_membersInput>
  }

  export type UserUpdateWithoutOrganization_membersInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    audit_logs?: AuditLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOrganization_membersInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    audit_logs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type OrganizationRoleUpsertWithoutMembersInput = {
    update: XOR<OrganizationRoleUpdateWithoutMembersInput, OrganizationRoleUncheckedUpdateWithoutMembersInput>
    create: XOR<OrganizationRoleCreateWithoutMembersInput, OrganizationRoleUncheckedCreateWithoutMembersInput>
    where?: OrganizationRoleWhereInput
  }

  export type OrganizationRoleUpdateToOneWithWhereWithoutMembersInput = {
    where?: OrganizationRoleWhereInput
    data: XOR<OrganizationRoleUpdateWithoutMembersInput, OrganizationRoleUncheckedUpdateWithoutMembersInput>
  }

  export type OrganizationRoleUpdateWithoutMembersInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    is_system?: BoolFieldUpdateOperationsInput | boolean
    organization?: OrganizationUpdateOneRequiredWithoutRolesNestedInput
    permissions?: RolePermissionUpdateManyWithoutRoleNestedInput
  }

  export type OrganizationRoleUncheckedUpdateWithoutMembersInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    org_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    is_system?: BoolFieldUpdateOperationsInput | boolean
    permissions?: RolePermissionUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type OrganizationCreateWithoutRolesInput = {
    uuid?: string
    name: string
    slug: string
    logo_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    members?: OrganizationMemberCreateNestedManyWithoutOrganizationInput
    audit_logs?: AuditLogCreateNestedManyWithoutOrganizationInput
    integrations?: IntegrationCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateWithoutRolesInput = {
    id?: number
    uuid?: string
    name: string
    slug: string
    logo_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    members?: OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInput
    audit_logs?: AuditLogUncheckedCreateNestedManyWithoutOrganizationInput
    integrations?: IntegrationUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationCreateOrConnectWithoutRolesInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutRolesInput, OrganizationUncheckedCreateWithoutRolesInput>
  }

  export type OrganizationMemberCreateWithoutRoleInput = {
    uuid?: string
    status?: $Enums.OrganizationMemberStatus
    invited_at?: Date | string
    joined_at?: Date | string | null
    organization: OrganizationCreateNestedOneWithoutMembersInput
    user: UserCreateNestedOneWithoutOrganization_membersInput
  }

  export type OrganizationMemberUncheckedCreateWithoutRoleInput = {
    id?: number
    uuid?: string
    org_uuid: string
    user_uuid: string
    status?: $Enums.OrganizationMemberStatus
    invited_at?: Date | string
    joined_at?: Date | string | null
  }

  export type OrganizationMemberCreateOrConnectWithoutRoleInput = {
    where: OrganizationMemberWhereUniqueInput
    create: XOR<OrganizationMemberCreateWithoutRoleInput, OrganizationMemberUncheckedCreateWithoutRoleInput>
  }

  export type OrganizationMemberCreateManyRoleInputEnvelope = {
    data: OrganizationMemberCreateManyRoleInput | OrganizationMemberCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type RolePermissionCreateWithoutRoleInput = {
    uuid?: string
    permission: PermissionCreateNestedOneWithoutRolesInput
  }

  export type RolePermissionUncheckedCreateWithoutRoleInput = {
    id?: number
    uuid?: string
    permission_uuid: string
  }

  export type RolePermissionCreateOrConnectWithoutRoleInput = {
    where: RolePermissionWhereUniqueInput
    create: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput>
  }

  export type RolePermissionCreateManyRoleInputEnvelope = {
    data: RolePermissionCreateManyRoleInput | RolePermissionCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type OrganizationUpsertWithoutRolesInput = {
    update: XOR<OrganizationUpdateWithoutRolesInput, OrganizationUncheckedUpdateWithoutRolesInput>
    create: XOR<OrganizationCreateWithoutRolesInput, OrganizationUncheckedCreateWithoutRolesInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutRolesInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutRolesInput, OrganizationUncheckedUpdateWithoutRolesInput>
  }

  export type OrganizationUpdateWithoutRolesInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: OrganizationMemberUpdateManyWithoutOrganizationNestedInput
    audit_logs?: AuditLogUpdateManyWithoutOrganizationNestedInput
    integrations?: IntegrationUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutRolesInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInput
    audit_logs?: AuditLogUncheckedUpdateManyWithoutOrganizationNestedInput
    integrations?: IntegrationUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationMemberUpsertWithWhereUniqueWithoutRoleInput = {
    where: OrganizationMemberWhereUniqueInput
    update: XOR<OrganizationMemberUpdateWithoutRoleInput, OrganizationMemberUncheckedUpdateWithoutRoleInput>
    create: XOR<OrganizationMemberCreateWithoutRoleInput, OrganizationMemberUncheckedCreateWithoutRoleInput>
  }

  export type OrganizationMemberUpdateWithWhereUniqueWithoutRoleInput = {
    where: OrganizationMemberWhereUniqueInput
    data: XOR<OrganizationMemberUpdateWithoutRoleInput, OrganizationMemberUncheckedUpdateWithoutRoleInput>
  }

  export type OrganizationMemberUpdateManyWithWhereWithoutRoleInput = {
    where: OrganizationMemberScalarWhereInput
    data: XOR<OrganizationMemberUpdateManyMutationInput, OrganizationMemberUncheckedUpdateManyWithoutRoleInput>
  }

  export type RolePermissionUpsertWithWhereUniqueWithoutRoleInput = {
    where: RolePermissionWhereUniqueInput
    update: XOR<RolePermissionUpdateWithoutRoleInput, RolePermissionUncheckedUpdateWithoutRoleInput>
    create: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput>
  }

  export type RolePermissionUpdateWithWhereUniqueWithoutRoleInput = {
    where: RolePermissionWhereUniqueInput
    data: XOR<RolePermissionUpdateWithoutRoleInput, RolePermissionUncheckedUpdateWithoutRoleInput>
  }

  export type RolePermissionUpdateManyWithWhereWithoutRoleInput = {
    where: RolePermissionScalarWhereInput
    data: XOR<RolePermissionUpdateManyMutationInput, RolePermissionUncheckedUpdateManyWithoutRoleInput>
  }

  export type RolePermissionScalarWhereInput = {
    AND?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
    OR?: RolePermissionScalarWhereInput[]
    NOT?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
    id?: IntFilter<"RolePermission"> | number
    uuid?: StringFilter<"RolePermission"> | string
    role_uuid?: StringFilter<"RolePermission"> | string
    permission_uuid?: StringFilter<"RolePermission"> | string
  }

  export type RolePermissionCreateWithoutPermissionInput = {
    uuid?: string
    role: OrganizationRoleCreateNestedOneWithoutPermissionsInput
  }

  export type RolePermissionUncheckedCreateWithoutPermissionInput = {
    id?: number
    uuid?: string
    role_uuid: string
  }

  export type RolePermissionCreateOrConnectWithoutPermissionInput = {
    where: RolePermissionWhereUniqueInput
    create: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput>
  }

  export type RolePermissionCreateManyPermissionInputEnvelope = {
    data: RolePermissionCreateManyPermissionInput | RolePermissionCreateManyPermissionInput[]
    skipDuplicates?: boolean
  }

  export type RolePermissionUpsertWithWhereUniqueWithoutPermissionInput = {
    where: RolePermissionWhereUniqueInput
    update: XOR<RolePermissionUpdateWithoutPermissionInput, RolePermissionUncheckedUpdateWithoutPermissionInput>
    create: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput>
  }

  export type RolePermissionUpdateWithWhereUniqueWithoutPermissionInput = {
    where: RolePermissionWhereUniqueInput
    data: XOR<RolePermissionUpdateWithoutPermissionInput, RolePermissionUncheckedUpdateWithoutPermissionInput>
  }

  export type RolePermissionUpdateManyWithWhereWithoutPermissionInput = {
    where: RolePermissionScalarWhereInput
    data: XOR<RolePermissionUpdateManyMutationInput, RolePermissionUncheckedUpdateManyWithoutPermissionInput>
  }

  export type OrganizationRoleCreateWithoutPermissionsInput = {
    uuid?: string
    name: string
    is_system?: boolean
    organization: OrganizationCreateNestedOneWithoutRolesInput
    members?: OrganizationMemberCreateNestedManyWithoutRoleInput
  }

  export type OrganizationRoleUncheckedCreateWithoutPermissionsInput = {
    id?: number
    uuid?: string
    org_uuid: string
    name: string
    is_system?: boolean
    members?: OrganizationMemberUncheckedCreateNestedManyWithoutRoleInput
  }

  export type OrganizationRoleCreateOrConnectWithoutPermissionsInput = {
    where: OrganizationRoleWhereUniqueInput
    create: XOR<OrganizationRoleCreateWithoutPermissionsInput, OrganizationRoleUncheckedCreateWithoutPermissionsInput>
  }

  export type PermissionCreateWithoutRolesInput = {
    uuid?: string
    key: string
    label: string
    group: string
  }

  export type PermissionUncheckedCreateWithoutRolesInput = {
    id?: number
    uuid?: string
    key: string
    label: string
    group: string
  }

  export type PermissionCreateOrConnectWithoutRolesInput = {
    where: PermissionWhereUniqueInput
    create: XOR<PermissionCreateWithoutRolesInput, PermissionUncheckedCreateWithoutRolesInput>
  }

  export type OrganizationRoleUpsertWithoutPermissionsInput = {
    update: XOR<OrganizationRoleUpdateWithoutPermissionsInput, OrganizationRoleUncheckedUpdateWithoutPermissionsInput>
    create: XOR<OrganizationRoleCreateWithoutPermissionsInput, OrganizationRoleUncheckedCreateWithoutPermissionsInput>
    where?: OrganizationRoleWhereInput
  }

  export type OrganizationRoleUpdateToOneWithWhereWithoutPermissionsInput = {
    where?: OrganizationRoleWhereInput
    data: XOR<OrganizationRoleUpdateWithoutPermissionsInput, OrganizationRoleUncheckedUpdateWithoutPermissionsInput>
  }

  export type OrganizationRoleUpdateWithoutPermissionsInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    is_system?: BoolFieldUpdateOperationsInput | boolean
    organization?: OrganizationUpdateOneRequiredWithoutRolesNestedInput
    members?: OrganizationMemberUpdateManyWithoutRoleNestedInput
  }

  export type OrganizationRoleUncheckedUpdateWithoutPermissionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    org_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    is_system?: BoolFieldUpdateOperationsInput | boolean
    members?: OrganizationMemberUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type PermissionUpsertWithoutRolesInput = {
    update: XOR<PermissionUpdateWithoutRolesInput, PermissionUncheckedUpdateWithoutRolesInput>
    create: XOR<PermissionCreateWithoutRolesInput, PermissionUncheckedCreateWithoutRolesInput>
    where?: PermissionWhereInput
  }

  export type PermissionUpdateToOneWithWhereWithoutRolesInput = {
    where?: PermissionWhereInput
    data: XOR<PermissionUpdateWithoutRolesInput, PermissionUncheckedUpdateWithoutRolesInput>
  }

  export type PermissionUpdateWithoutRolesInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    group?: StringFieldUpdateOperationsInput | string
  }

  export type PermissionUncheckedUpdateWithoutRolesInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    group?: StringFieldUpdateOperationsInput | string
  }

  export type OrganizationCreateWithoutAudit_logsInput = {
    uuid?: string
    name: string
    slug: string
    logo_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    members?: OrganizationMemberCreateNestedManyWithoutOrganizationInput
    roles?: OrganizationRoleCreateNestedManyWithoutOrganizationInput
    integrations?: IntegrationCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateWithoutAudit_logsInput = {
    id?: number
    uuid?: string
    name: string
    slug: string
    logo_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    members?: OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInput
    roles?: OrganizationRoleUncheckedCreateNestedManyWithoutOrganizationInput
    integrations?: IntegrationUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationCreateOrConnectWithoutAudit_logsInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutAudit_logsInput, OrganizationUncheckedCreateWithoutAudit_logsInput>
  }

  export type UserCreateWithoutAudit_logsInput = {
    uuid?: string
    email: string
    phone?: string | null
    password: string
    role: $Enums.AuthRole
    created_at?: Date | string
    updated_at?: Date | string
    organization_members?: OrganizationMemberCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAudit_logsInput = {
    id?: number
    uuid?: string
    email: string
    phone?: string | null
    password: string
    role: $Enums.AuthRole
    created_at?: Date | string
    updated_at?: Date | string
    organization_members?: OrganizationMemberUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAudit_logsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAudit_logsInput, UserUncheckedCreateWithoutAudit_logsInput>
  }

  export type OrganizationUpsertWithoutAudit_logsInput = {
    update: XOR<OrganizationUpdateWithoutAudit_logsInput, OrganizationUncheckedUpdateWithoutAudit_logsInput>
    create: XOR<OrganizationCreateWithoutAudit_logsInput, OrganizationUncheckedCreateWithoutAudit_logsInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutAudit_logsInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutAudit_logsInput, OrganizationUncheckedUpdateWithoutAudit_logsInput>
  }

  export type OrganizationUpdateWithoutAudit_logsInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: OrganizationMemberUpdateManyWithoutOrganizationNestedInput
    roles?: OrganizationRoleUpdateManyWithoutOrganizationNestedInput
    integrations?: IntegrationUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutAudit_logsInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInput
    roles?: OrganizationRoleUncheckedUpdateManyWithoutOrganizationNestedInput
    integrations?: IntegrationUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type UserUpsertWithoutAudit_logsInput = {
    update: XOR<UserUpdateWithoutAudit_logsInput, UserUncheckedUpdateWithoutAudit_logsInput>
    create: XOR<UserCreateWithoutAudit_logsInput, UserUncheckedCreateWithoutAudit_logsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAudit_logsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAudit_logsInput, UserUncheckedUpdateWithoutAudit_logsInput>
  }

  export type UserUpdateWithoutAudit_logsInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    organization_members?: OrganizationMemberUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAudit_logsInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    organization_members?: OrganizationMemberUncheckedUpdateManyWithoutUserNestedInput
  }

  export type OrganizationCreateWithoutIntegrationsInput = {
    uuid?: string
    name: string
    slug: string
    logo_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    members?: OrganizationMemberCreateNestedManyWithoutOrganizationInput
    roles?: OrganizationRoleCreateNestedManyWithoutOrganizationInput
    audit_logs?: AuditLogCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateWithoutIntegrationsInput = {
    id?: number
    uuid?: string
    name: string
    slug: string
    logo_url?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    members?: OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInput
    roles?: OrganizationRoleUncheckedCreateNestedManyWithoutOrganizationInput
    audit_logs?: AuditLogUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationCreateOrConnectWithoutIntegrationsInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutIntegrationsInput, OrganizationUncheckedCreateWithoutIntegrationsInput>
  }

  export type IntegrationActionCreateWithoutIntegrationInput = {
    uuid?: string
    key: string
    label: string
    description: string
    enabled?: boolean
    required_permission_key?: string | null
  }

  export type IntegrationActionUncheckedCreateWithoutIntegrationInput = {
    id?: number
    uuid?: string
    key: string
    label: string
    description: string
    enabled?: boolean
    required_permission_key?: string | null
  }

  export type IntegrationActionCreateOrConnectWithoutIntegrationInput = {
    where: IntegrationActionWhereUniqueInput
    create: XOR<IntegrationActionCreateWithoutIntegrationInput, IntegrationActionUncheckedCreateWithoutIntegrationInput>
  }

  export type IntegrationActionCreateManyIntegrationInputEnvelope = {
    data: IntegrationActionCreateManyIntegrationInput | IntegrationActionCreateManyIntegrationInput[]
    skipDuplicates?: boolean
  }

  export type DatabaseIntegrationCreateWithoutIntegrationInput = {
    uuid?: string
    db_type: $Enums.DatabaseType
    connection_string: string
    schema_cache?: NullableJsonNullValueInput | InputJsonValue
    allowed_ops?: DatabaseIntegrationCreateallowed_opsInput | $Enums.DatabaseOperation[]
    last_schema_sync?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type DatabaseIntegrationUncheckedCreateWithoutIntegrationInput = {
    id?: number
    uuid?: string
    db_type: $Enums.DatabaseType
    connection_string: string
    schema_cache?: NullableJsonNullValueInput | InputJsonValue
    allowed_ops?: DatabaseIntegrationCreateallowed_opsInput | $Enums.DatabaseOperation[]
    last_schema_sync?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type DatabaseIntegrationCreateOrConnectWithoutIntegrationInput = {
    where: DatabaseIntegrationWhereUniqueInput
    create: XOR<DatabaseIntegrationCreateWithoutIntegrationInput, DatabaseIntegrationUncheckedCreateWithoutIntegrationInput>
  }

  export type OpenApiIntegrationCreateWithoutIntegrationInput = {
    uuid?: string
    spec_url?: string | null
    spec_json: JsonNullValueInput | InputJsonValue
    base_url: string
    auth_type?: $Enums.OpenApiAuthType
    auth_config: string
    generated_tools: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type OpenApiIntegrationUncheckedCreateWithoutIntegrationInput = {
    id?: number
    uuid?: string
    spec_url?: string | null
    spec_json: JsonNullValueInput | InputJsonValue
    base_url: string
    auth_type?: $Enums.OpenApiAuthType
    auth_config: string
    generated_tools: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type OpenApiIntegrationCreateOrConnectWithoutIntegrationInput = {
    where: OpenApiIntegrationWhereUniqueInput
    create: XOR<OpenApiIntegrationCreateWithoutIntegrationInput, OpenApiIntegrationUncheckedCreateWithoutIntegrationInput>
  }

  export type McpIntegrationCreateWithoutIntegrationInput = {
    uuid?: string
    server_url: string
    transport_type?: $Enums.McpTransportType
    auth_type?: $Enums.McpAuthType
    auth_config: string
    server_name?: string | null
    discovered_tools?: JsonNullValueInput | InputJsonValue
    last_tool_sync?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type McpIntegrationUncheckedCreateWithoutIntegrationInput = {
    id?: number
    uuid?: string
    server_url: string
    transport_type?: $Enums.McpTransportType
    auth_type?: $Enums.McpAuthType
    auth_config: string
    server_name?: string | null
    discovered_tools?: JsonNullValueInput | InputJsonValue
    last_tool_sync?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type McpIntegrationCreateOrConnectWithoutIntegrationInput = {
    where: McpIntegrationWhereUniqueInput
    create: XOR<McpIntegrationCreateWithoutIntegrationInput, McpIntegrationUncheckedCreateWithoutIntegrationInput>
  }

  export type OrganizationUpsertWithoutIntegrationsInput = {
    update: XOR<OrganizationUpdateWithoutIntegrationsInput, OrganizationUncheckedUpdateWithoutIntegrationsInput>
    create: XOR<OrganizationCreateWithoutIntegrationsInput, OrganizationUncheckedCreateWithoutIntegrationsInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutIntegrationsInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutIntegrationsInput, OrganizationUncheckedUpdateWithoutIntegrationsInput>
  }

  export type OrganizationUpdateWithoutIntegrationsInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: OrganizationMemberUpdateManyWithoutOrganizationNestedInput
    roles?: OrganizationRoleUpdateManyWithoutOrganizationNestedInput
    audit_logs?: AuditLogUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutIntegrationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logo_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInput
    roles?: OrganizationRoleUncheckedUpdateManyWithoutOrganizationNestedInput
    audit_logs?: AuditLogUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type IntegrationActionUpsertWithWhereUniqueWithoutIntegrationInput = {
    where: IntegrationActionWhereUniqueInput
    update: XOR<IntegrationActionUpdateWithoutIntegrationInput, IntegrationActionUncheckedUpdateWithoutIntegrationInput>
    create: XOR<IntegrationActionCreateWithoutIntegrationInput, IntegrationActionUncheckedCreateWithoutIntegrationInput>
  }

  export type IntegrationActionUpdateWithWhereUniqueWithoutIntegrationInput = {
    where: IntegrationActionWhereUniqueInput
    data: XOR<IntegrationActionUpdateWithoutIntegrationInput, IntegrationActionUncheckedUpdateWithoutIntegrationInput>
  }

  export type IntegrationActionUpdateManyWithWhereWithoutIntegrationInput = {
    where: IntegrationActionScalarWhereInput
    data: XOR<IntegrationActionUpdateManyMutationInput, IntegrationActionUncheckedUpdateManyWithoutIntegrationInput>
  }

  export type IntegrationActionScalarWhereInput = {
    AND?: IntegrationActionScalarWhereInput | IntegrationActionScalarWhereInput[]
    OR?: IntegrationActionScalarWhereInput[]
    NOT?: IntegrationActionScalarWhereInput | IntegrationActionScalarWhereInput[]
    id?: IntFilter<"IntegrationAction"> | number
    uuid?: StringFilter<"IntegrationAction"> | string
    integration_uuid?: StringFilter<"IntegrationAction"> | string
    key?: StringFilter<"IntegrationAction"> | string
    label?: StringFilter<"IntegrationAction"> | string
    description?: StringFilter<"IntegrationAction"> | string
    enabled?: BoolFilter<"IntegrationAction"> | boolean
    required_permission_key?: StringNullableFilter<"IntegrationAction"> | string | null
  }

  export type DatabaseIntegrationUpsertWithoutIntegrationInput = {
    update: XOR<DatabaseIntegrationUpdateWithoutIntegrationInput, DatabaseIntegrationUncheckedUpdateWithoutIntegrationInput>
    create: XOR<DatabaseIntegrationCreateWithoutIntegrationInput, DatabaseIntegrationUncheckedCreateWithoutIntegrationInput>
    where?: DatabaseIntegrationWhereInput
  }

  export type DatabaseIntegrationUpdateToOneWithWhereWithoutIntegrationInput = {
    where?: DatabaseIntegrationWhereInput
    data: XOR<DatabaseIntegrationUpdateWithoutIntegrationInput, DatabaseIntegrationUncheckedUpdateWithoutIntegrationInput>
  }

  export type DatabaseIntegrationUpdateWithoutIntegrationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    db_type?: EnumDatabaseTypeFieldUpdateOperationsInput | $Enums.DatabaseType
    connection_string?: StringFieldUpdateOperationsInput | string
    schema_cache?: NullableJsonNullValueInput | InputJsonValue
    allowed_ops?: DatabaseIntegrationUpdateallowed_opsInput | $Enums.DatabaseOperation[]
    last_schema_sync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DatabaseIntegrationUncheckedUpdateWithoutIntegrationInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    db_type?: EnumDatabaseTypeFieldUpdateOperationsInput | $Enums.DatabaseType
    connection_string?: StringFieldUpdateOperationsInput | string
    schema_cache?: NullableJsonNullValueInput | InputJsonValue
    allowed_ops?: DatabaseIntegrationUpdateallowed_opsInput | $Enums.DatabaseOperation[]
    last_schema_sync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OpenApiIntegrationUpsertWithoutIntegrationInput = {
    update: XOR<OpenApiIntegrationUpdateWithoutIntegrationInput, OpenApiIntegrationUncheckedUpdateWithoutIntegrationInput>
    create: XOR<OpenApiIntegrationCreateWithoutIntegrationInput, OpenApiIntegrationUncheckedCreateWithoutIntegrationInput>
    where?: OpenApiIntegrationWhereInput
  }

  export type OpenApiIntegrationUpdateToOneWithWhereWithoutIntegrationInput = {
    where?: OpenApiIntegrationWhereInput
    data: XOR<OpenApiIntegrationUpdateWithoutIntegrationInput, OpenApiIntegrationUncheckedUpdateWithoutIntegrationInput>
  }

  export type OpenApiIntegrationUpdateWithoutIntegrationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    spec_url?: NullableStringFieldUpdateOperationsInput | string | null
    spec_json?: JsonNullValueInput | InputJsonValue
    base_url?: StringFieldUpdateOperationsInput | string
    auth_type?: EnumOpenApiAuthTypeFieldUpdateOperationsInput | $Enums.OpenApiAuthType
    auth_config?: StringFieldUpdateOperationsInput | string
    generated_tools?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OpenApiIntegrationUncheckedUpdateWithoutIntegrationInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    spec_url?: NullableStringFieldUpdateOperationsInput | string | null
    spec_json?: JsonNullValueInput | InputJsonValue
    base_url?: StringFieldUpdateOperationsInput | string
    auth_type?: EnumOpenApiAuthTypeFieldUpdateOperationsInput | $Enums.OpenApiAuthType
    auth_config?: StringFieldUpdateOperationsInput | string
    generated_tools?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type McpIntegrationUpsertWithoutIntegrationInput = {
    update: XOR<McpIntegrationUpdateWithoutIntegrationInput, McpIntegrationUncheckedUpdateWithoutIntegrationInput>
    create: XOR<McpIntegrationCreateWithoutIntegrationInput, McpIntegrationUncheckedCreateWithoutIntegrationInput>
    where?: McpIntegrationWhereInput
  }

  export type McpIntegrationUpdateToOneWithWhereWithoutIntegrationInput = {
    where?: McpIntegrationWhereInput
    data: XOR<McpIntegrationUpdateWithoutIntegrationInput, McpIntegrationUncheckedUpdateWithoutIntegrationInput>
  }

  export type McpIntegrationUpdateWithoutIntegrationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    server_url?: StringFieldUpdateOperationsInput | string
    transport_type?: EnumMcpTransportTypeFieldUpdateOperationsInput | $Enums.McpTransportType
    auth_type?: EnumMcpAuthTypeFieldUpdateOperationsInput | $Enums.McpAuthType
    auth_config?: StringFieldUpdateOperationsInput | string
    server_name?: NullableStringFieldUpdateOperationsInput | string | null
    discovered_tools?: JsonNullValueInput | InputJsonValue
    last_tool_sync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type McpIntegrationUncheckedUpdateWithoutIntegrationInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    server_url?: StringFieldUpdateOperationsInput | string
    transport_type?: EnumMcpTransportTypeFieldUpdateOperationsInput | $Enums.McpTransportType
    auth_type?: EnumMcpAuthTypeFieldUpdateOperationsInput | $Enums.McpAuthType
    auth_config?: StringFieldUpdateOperationsInput | string
    server_name?: NullableStringFieldUpdateOperationsInput | string | null
    discovered_tools?: JsonNullValueInput | InputJsonValue
    last_tool_sync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntegrationCreateWithoutDatabaseInput = {
    uuid?: string
    name: string
    description?: string | null
    provider: $Enums.IntegrationProvider
    status?: $Enums.IntegrationStatus
    config: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    organization: OrganizationCreateNestedOneWithoutIntegrationsInput
    actions?: IntegrationActionCreateNestedManyWithoutIntegrationInput
    openapi?: OpenApiIntegrationCreateNestedOneWithoutIntegrationInput
    mcp?: McpIntegrationCreateNestedOneWithoutIntegrationInput
  }

  export type IntegrationUncheckedCreateWithoutDatabaseInput = {
    id?: number
    uuid?: string
    org_uuid: string
    name: string
    description?: string | null
    provider: $Enums.IntegrationProvider
    status?: $Enums.IntegrationStatus
    config: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    actions?: IntegrationActionUncheckedCreateNestedManyWithoutIntegrationInput
    openapi?: OpenApiIntegrationUncheckedCreateNestedOneWithoutIntegrationInput
    mcp?: McpIntegrationUncheckedCreateNestedOneWithoutIntegrationInput
  }

  export type IntegrationCreateOrConnectWithoutDatabaseInput = {
    where: IntegrationWhereUniqueInput
    create: XOR<IntegrationCreateWithoutDatabaseInput, IntegrationUncheckedCreateWithoutDatabaseInput>
  }

  export type IntegrationUpsertWithoutDatabaseInput = {
    update: XOR<IntegrationUpdateWithoutDatabaseInput, IntegrationUncheckedUpdateWithoutDatabaseInput>
    create: XOR<IntegrationCreateWithoutDatabaseInput, IntegrationUncheckedCreateWithoutDatabaseInput>
    where?: IntegrationWhereInput
  }

  export type IntegrationUpdateToOneWithWhereWithoutDatabaseInput = {
    where?: IntegrationWhereInput
    data: XOR<IntegrationUpdateWithoutDatabaseInput, IntegrationUncheckedUpdateWithoutDatabaseInput>
  }

  export type IntegrationUpdateWithoutDatabaseInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: EnumIntegrationProviderFieldUpdateOperationsInput | $Enums.IntegrationProvider
    status?: EnumIntegrationStatusFieldUpdateOperationsInput | $Enums.IntegrationStatus
    config?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneRequiredWithoutIntegrationsNestedInput
    actions?: IntegrationActionUpdateManyWithoutIntegrationNestedInput
    openapi?: OpenApiIntegrationUpdateOneWithoutIntegrationNestedInput
    mcp?: McpIntegrationUpdateOneWithoutIntegrationNestedInput
  }

  export type IntegrationUncheckedUpdateWithoutDatabaseInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    org_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: EnumIntegrationProviderFieldUpdateOperationsInput | $Enums.IntegrationProvider
    status?: EnumIntegrationStatusFieldUpdateOperationsInput | $Enums.IntegrationStatus
    config?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    actions?: IntegrationActionUncheckedUpdateManyWithoutIntegrationNestedInput
    openapi?: OpenApiIntegrationUncheckedUpdateOneWithoutIntegrationNestedInput
    mcp?: McpIntegrationUncheckedUpdateOneWithoutIntegrationNestedInput
  }

  export type IntegrationCreateWithoutOpenapiInput = {
    uuid?: string
    name: string
    description?: string | null
    provider: $Enums.IntegrationProvider
    status?: $Enums.IntegrationStatus
    config: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    organization: OrganizationCreateNestedOneWithoutIntegrationsInput
    actions?: IntegrationActionCreateNestedManyWithoutIntegrationInput
    database?: DatabaseIntegrationCreateNestedOneWithoutIntegrationInput
    mcp?: McpIntegrationCreateNestedOneWithoutIntegrationInput
  }

  export type IntegrationUncheckedCreateWithoutOpenapiInput = {
    id?: number
    uuid?: string
    org_uuid: string
    name: string
    description?: string | null
    provider: $Enums.IntegrationProvider
    status?: $Enums.IntegrationStatus
    config: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    actions?: IntegrationActionUncheckedCreateNestedManyWithoutIntegrationInput
    database?: DatabaseIntegrationUncheckedCreateNestedOneWithoutIntegrationInput
    mcp?: McpIntegrationUncheckedCreateNestedOneWithoutIntegrationInput
  }

  export type IntegrationCreateOrConnectWithoutOpenapiInput = {
    where: IntegrationWhereUniqueInput
    create: XOR<IntegrationCreateWithoutOpenapiInput, IntegrationUncheckedCreateWithoutOpenapiInput>
  }

  export type IntegrationUpsertWithoutOpenapiInput = {
    update: XOR<IntegrationUpdateWithoutOpenapiInput, IntegrationUncheckedUpdateWithoutOpenapiInput>
    create: XOR<IntegrationCreateWithoutOpenapiInput, IntegrationUncheckedCreateWithoutOpenapiInput>
    where?: IntegrationWhereInput
  }

  export type IntegrationUpdateToOneWithWhereWithoutOpenapiInput = {
    where?: IntegrationWhereInput
    data: XOR<IntegrationUpdateWithoutOpenapiInput, IntegrationUncheckedUpdateWithoutOpenapiInput>
  }

  export type IntegrationUpdateWithoutOpenapiInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: EnumIntegrationProviderFieldUpdateOperationsInput | $Enums.IntegrationProvider
    status?: EnumIntegrationStatusFieldUpdateOperationsInput | $Enums.IntegrationStatus
    config?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneRequiredWithoutIntegrationsNestedInput
    actions?: IntegrationActionUpdateManyWithoutIntegrationNestedInput
    database?: DatabaseIntegrationUpdateOneWithoutIntegrationNestedInput
    mcp?: McpIntegrationUpdateOneWithoutIntegrationNestedInput
  }

  export type IntegrationUncheckedUpdateWithoutOpenapiInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    org_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: EnumIntegrationProviderFieldUpdateOperationsInput | $Enums.IntegrationProvider
    status?: EnumIntegrationStatusFieldUpdateOperationsInput | $Enums.IntegrationStatus
    config?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    actions?: IntegrationActionUncheckedUpdateManyWithoutIntegrationNestedInput
    database?: DatabaseIntegrationUncheckedUpdateOneWithoutIntegrationNestedInput
    mcp?: McpIntegrationUncheckedUpdateOneWithoutIntegrationNestedInput
  }

  export type IntegrationCreateWithoutMcpInput = {
    uuid?: string
    name: string
    description?: string | null
    provider: $Enums.IntegrationProvider
    status?: $Enums.IntegrationStatus
    config: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    organization: OrganizationCreateNestedOneWithoutIntegrationsInput
    actions?: IntegrationActionCreateNestedManyWithoutIntegrationInput
    database?: DatabaseIntegrationCreateNestedOneWithoutIntegrationInput
    openapi?: OpenApiIntegrationCreateNestedOneWithoutIntegrationInput
  }

  export type IntegrationUncheckedCreateWithoutMcpInput = {
    id?: number
    uuid?: string
    org_uuid: string
    name: string
    description?: string | null
    provider: $Enums.IntegrationProvider
    status?: $Enums.IntegrationStatus
    config: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    actions?: IntegrationActionUncheckedCreateNestedManyWithoutIntegrationInput
    database?: DatabaseIntegrationUncheckedCreateNestedOneWithoutIntegrationInput
    openapi?: OpenApiIntegrationUncheckedCreateNestedOneWithoutIntegrationInput
  }

  export type IntegrationCreateOrConnectWithoutMcpInput = {
    where: IntegrationWhereUniqueInput
    create: XOR<IntegrationCreateWithoutMcpInput, IntegrationUncheckedCreateWithoutMcpInput>
  }

  export type IntegrationUpsertWithoutMcpInput = {
    update: XOR<IntegrationUpdateWithoutMcpInput, IntegrationUncheckedUpdateWithoutMcpInput>
    create: XOR<IntegrationCreateWithoutMcpInput, IntegrationUncheckedCreateWithoutMcpInput>
    where?: IntegrationWhereInput
  }

  export type IntegrationUpdateToOneWithWhereWithoutMcpInput = {
    where?: IntegrationWhereInput
    data: XOR<IntegrationUpdateWithoutMcpInput, IntegrationUncheckedUpdateWithoutMcpInput>
  }

  export type IntegrationUpdateWithoutMcpInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: EnumIntegrationProviderFieldUpdateOperationsInput | $Enums.IntegrationProvider
    status?: EnumIntegrationStatusFieldUpdateOperationsInput | $Enums.IntegrationStatus
    config?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneRequiredWithoutIntegrationsNestedInput
    actions?: IntegrationActionUpdateManyWithoutIntegrationNestedInput
    database?: DatabaseIntegrationUpdateOneWithoutIntegrationNestedInput
    openapi?: OpenApiIntegrationUpdateOneWithoutIntegrationNestedInput
  }

  export type IntegrationUncheckedUpdateWithoutMcpInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    org_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: EnumIntegrationProviderFieldUpdateOperationsInput | $Enums.IntegrationProvider
    status?: EnumIntegrationStatusFieldUpdateOperationsInput | $Enums.IntegrationStatus
    config?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    actions?: IntegrationActionUncheckedUpdateManyWithoutIntegrationNestedInput
    database?: DatabaseIntegrationUncheckedUpdateOneWithoutIntegrationNestedInput
    openapi?: OpenApiIntegrationUncheckedUpdateOneWithoutIntegrationNestedInput
  }

  export type IntegrationCreateWithoutActionsInput = {
    uuid?: string
    name: string
    description?: string | null
    provider: $Enums.IntegrationProvider
    status?: $Enums.IntegrationStatus
    config: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    organization: OrganizationCreateNestedOneWithoutIntegrationsInput
    database?: DatabaseIntegrationCreateNestedOneWithoutIntegrationInput
    openapi?: OpenApiIntegrationCreateNestedOneWithoutIntegrationInput
    mcp?: McpIntegrationCreateNestedOneWithoutIntegrationInput
  }

  export type IntegrationUncheckedCreateWithoutActionsInput = {
    id?: number
    uuid?: string
    org_uuid: string
    name: string
    description?: string | null
    provider: $Enums.IntegrationProvider
    status?: $Enums.IntegrationStatus
    config: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    database?: DatabaseIntegrationUncheckedCreateNestedOneWithoutIntegrationInput
    openapi?: OpenApiIntegrationUncheckedCreateNestedOneWithoutIntegrationInput
    mcp?: McpIntegrationUncheckedCreateNestedOneWithoutIntegrationInput
  }

  export type IntegrationCreateOrConnectWithoutActionsInput = {
    where: IntegrationWhereUniqueInput
    create: XOR<IntegrationCreateWithoutActionsInput, IntegrationUncheckedCreateWithoutActionsInput>
  }

  export type IntegrationUpsertWithoutActionsInput = {
    update: XOR<IntegrationUpdateWithoutActionsInput, IntegrationUncheckedUpdateWithoutActionsInput>
    create: XOR<IntegrationCreateWithoutActionsInput, IntegrationUncheckedCreateWithoutActionsInput>
    where?: IntegrationWhereInput
  }

  export type IntegrationUpdateToOneWithWhereWithoutActionsInput = {
    where?: IntegrationWhereInput
    data: XOR<IntegrationUpdateWithoutActionsInput, IntegrationUncheckedUpdateWithoutActionsInput>
  }

  export type IntegrationUpdateWithoutActionsInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: EnumIntegrationProviderFieldUpdateOperationsInput | $Enums.IntegrationProvider
    status?: EnumIntegrationStatusFieldUpdateOperationsInput | $Enums.IntegrationStatus
    config?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneRequiredWithoutIntegrationsNestedInput
    database?: DatabaseIntegrationUpdateOneWithoutIntegrationNestedInput
    openapi?: OpenApiIntegrationUpdateOneWithoutIntegrationNestedInput
    mcp?: McpIntegrationUpdateOneWithoutIntegrationNestedInput
  }

  export type IntegrationUncheckedUpdateWithoutActionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    org_uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: EnumIntegrationProviderFieldUpdateOperationsInput | $Enums.IntegrationProvider
    status?: EnumIntegrationStatusFieldUpdateOperationsInput | $Enums.IntegrationStatus
    config?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    database?: DatabaseIntegrationUncheckedUpdateOneWithoutIntegrationNestedInput
    openapi?: OpenApiIntegrationUncheckedUpdateOneWithoutIntegrationNestedInput
    mcp?: McpIntegrationUncheckedUpdateOneWithoutIntegrationNestedInput
  }

  export type OrganizationMemberCreateManyUserInput = {
    id?: number
    uuid?: string
    org_uuid: string
    role_uuid: string
    status?: $Enums.OrganizationMemberStatus
    invited_at?: Date | string
    joined_at?: Date | string | null
  }

  export type AuditLogCreateManyUserInput = {
    id?: number
    uuid?: string
    org_uuid: string
    action: string
    resource_type: string
    resource_id?: string | null
    metadata: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
  }

  export type OrganizationMemberUpdateWithoutUserInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    status?: EnumOrganizationMemberStatusFieldUpdateOperationsInput | $Enums.OrganizationMemberStatus
    invited_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organization?: OrganizationUpdateOneRequiredWithoutMembersNestedInput
    role?: OrganizationRoleUpdateOneRequiredWithoutMembersNestedInput
  }

  export type OrganizationMemberUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    org_uuid?: StringFieldUpdateOperationsInput | string
    role_uuid?: StringFieldUpdateOperationsInput | string
    status?: EnumOrganizationMemberStatusFieldUpdateOperationsInput | $Enums.OrganizationMemberStatus
    invited_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OrganizationMemberUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    org_uuid?: StringFieldUpdateOperationsInput | string
    role_uuid?: StringFieldUpdateOperationsInput | string
    status?: EnumOrganizationMemberStatusFieldUpdateOperationsInput | $Enums.OrganizationMemberStatus
    invited_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AuditLogUpdateWithoutUserInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resource_type?: StringFieldUpdateOperationsInput | string
    resource_id?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneRequiredWithoutAudit_logsNestedInput
  }

  export type AuditLogUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    org_uuid?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resource_type?: StringFieldUpdateOperationsInput | string
    resource_id?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    org_uuid?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resource_type?: StringFieldUpdateOperationsInput | string
    resource_id?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganizationMemberCreateManyOrganizationInput = {
    id?: number
    uuid?: string
    user_uuid: string
    role_uuid: string
    status?: $Enums.OrganizationMemberStatus
    invited_at?: Date | string
    joined_at?: Date | string | null
  }

  export type OrganizationRoleCreateManyOrganizationInput = {
    id?: number
    uuid?: string
    name: string
    is_system?: boolean
  }

  export type AuditLogCreateManyOrganizationInput = {
    id?: number
    uuid?: string
    user_uuid: string
    action: string
    resource_type: string
    resource_id?: string | null
    metadata: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
  }

  export type IntegrationCreateManyOrganizationInput = {
    id?: number
    uuid?: string
    name: string
    description?: string | null
    provider: $Enums.IntegrationProvider
    status?: $Enums.IntegrationStatus
    config: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type OrganizationMemberUpdateWithoutOrganizationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    status?: EnumOrganizationMemberStatusFieldUpdateOperationsInput | $Enums.OrganizationMemberStatus
    invited_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutOrganization_membersNestedInput
    role?: OrganizationRoleUpdateOneRequiredWithoutMembersNestedInput
  }

  export type OrganizationMemberUncheckedUpdateWithoutOrganizationInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    user_uuid?: StringFieldUpdateOperationsInput | string
    role_uuid?: StringFieldUpdateOperationsInput | string
    status?: EnumOrganizationMemberStatusFieldUpdateOperationsInput | $Enums.OrganizationMemberStatus
    invited_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OrganizationMemberUncheckedUpdateManyWithoutOrganizationInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    user_uuid?: StringFieldUpdateOperationsInput | string
    role_uuid?: StringFieldUpdateOperationsInput | string
    status?: EnumOrganizationMemberStatusFieldUpdateOperationsInput | $Enums.OrganizationMemberStatus
    invited_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OrganizationRoleUpdateWithoutOrganizationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    is_system?: BoolFieldUpdateOperationsInput | boolean
    members?: OrganizationMemberUpdateManyWithoutRoleNestedInput
    permissions?: RolePermissionUpdateManyWithoutRoleNestedInput
  }

  export type OrganizationRoleUncheckedUpdateWithoutOrganizationInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    is_system?: BoolFieldUpdateOperationsInput | boolean
    members?: OrganizationMemberUncheckedUpdateManyWithoutRoleNestedInput
    permissions?: RolePermissionUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type OrganizationRoleUncheckedUpdateManyWithoutOrganizationInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    is_system?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AuditLogUpdateWithoutOrganizationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resource_type?: StringFieldUpdateOperationsInput | string
    resource_id?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAudit_logsNestedInput
  }

  export type AuditLogUncheckedUpdateWithoutOrganizationInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    user_uuid?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resource_type?: StringFieldUpdateOperationsInput | string
    resource_id?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutOrganizationInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    user_uuid?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resource_type?: StringFieldUpdateOperationsInput | string
    resource_id?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntegrationUpdateWithoutOrganizationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: EnumIntegrationProviderFieldUpdateOperationsInput | $Enums.IntegrationProvider
    status?: EnumIntegrationStatusFieldUpdateOperationsInput | $Enums.IntegrationStatus
    config?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    actions?: IntegrationActionUpdateManyWithoutIntegrationNestedInput
    database?: DatabaseIntegrationUpdateOneWithoutIntegrationNestedInput
    openapi?: OpenApiIntegrationUpdateOneWithoutIntegrationNestedInput
    mcp?: McpIntegrationUpdateOneWithoutIntegrationNestedInput
  }

  export type IntegrationUncheckedUpdateWithoutOrganizationInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: EnumIntegrationProviderFieldUpdateOperationsInput | $Enums.IntegrationProvider
    status?: EnumIntegrationStatusFieldUpdateOperationsInput | $Enums.IntegrationStatus
    config?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    actions?: IntegrationActionUncheckedUpdateManyWithoutIntegrationNestedInput
    database?: DatabaseIntegrationUncheckedUpdateOneWithoutIntegrationNestedInput
    openapi?: OpenApiIntegrationUncheckedUpdateOneWithoutIntegrationNestedInput
    mcp?: McpIntegrationUncheckedUpdateOneWithoutIntegrationNestedInput
  }

  export type IntegrationUncheckedUpdateManyWithoutOrganizationInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: EnumIntegrationProviderFieldUpdateOperationsInput | $Enums.IntegrationProvider
    status?: EnumIntegrationStatusFieldUpdateOperationsInput | $Enums.IntegrationStatus
    config?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganizationMemberCreateManyRoleInput = {
    id?: number
    uuid?: string
    org_uuid: string
    user_uuid: string
    status?: $Enums.OrganizationMemberStatus
    invited_at?: Date | string
    joined_at?: Date | string | null
  }

  export type RolePermissionCreateManyRoleInput = {
    id?: number
    uuid?: string
    permission_uuid: string
  }

  export type OrganizationMemberUpdateWithoutRoleInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    status?: EnumOrganizationMemberStatusFieldUpdateOperationsInput | $Enums.OrganizationMemberStatus
    invited_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organization?: OrganizationUpdateOneRequiredWithoutMembersNestedInput
    user?: UserUpdateOneRequiredWithoutOrganization_membersNestedInput
  }

  export type OrganizationMemberUncheckedUpdateWithoutRoleInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    org_uuid?: StringFieldUpdateOperationsInput | string
    user_uuid?: StringFieldUpdateOperationsInput | string
    status?: EnumOrganizationMemberStatusFieldUpdateOperationsInput | $Enums.OrganizationMemberStatus
    invited_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OrganizationMemberUncheckedUpdateManyWithoutRoleInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    org_uuid?: StringFieldUpdateOperationsInput | string
    user_uuid?: StringFieldUpdateOperationsInput | string
    status?: EnumOrganizationMemberStatusFieldUpdateOperationsInput | $Enums.OrganizationMemberStatus
    invited_at?: DateTimeFieldUpdateOperationsInput | Date | string
    joined_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RolePermissionUpdateWithoutRoleInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    permission?: PermissionUpdateOneRequiredWithoutRolesNestedInput
  }

  export type RolePermissionUncheckedUpdateWithoutRoleInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    permission_uuid?: StringFieldUpdateOperationsInput | string
  }

  export type RolePermissionUncheckedUpdateManyWithoutRoleInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    permission_uuid?: StringFieldUpdateOperationsInput | string
  }

  export type RolePermissionCreateManyPermissionInput = {
    id?: number
    uuid?: string
    role_uuid: string
  }

  export type RolePermissionUpdateWithoutPermissionInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    role?: OrganizationRoleUpdateOneRequiredWithoutPermissionsNestedInput
  }

  export type RolePermissionUncheckedUpdateWithoutPermissionInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    role_uuid?: StringFieldUpdateOperationsInput | string
  }

  export type RolePermissionUncheckedUpdateManyWithoutPermissionInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    role_uuid?: StringFieldUpdateOperationsInput | string
  }

  export type IntegrationActionCreateManyIntegrationInput = {
    id?: number
    uuid?: string
    key: string
    label: string
    description: string
    enabled?: boolean
    required_permission_key?: string | null
  }

  export type IntegrationActionUpdateWithoutIntegrationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    required_permission_key?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntegrationActionUncheckedUpdateWithoutIntegrationInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    required_permission_key?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntegrationActionUncheckedUpdateManyWithoutIntegrationInput = {
    id?: IntFieldUpdateOperationsInput | number
    uuid?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    required_permission_key?: NullableStringFieldUpdateOperationsInput | string | null
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