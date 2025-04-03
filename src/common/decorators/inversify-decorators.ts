// import type { interfaces } from 'inversify';
// import { Container, injectable, inject } from 'inversify';
// import { fluentProvide } from 'inversify-binding-decorators';

// /**
//  * Global Inversify container instance
//  */
// export const container = new Container();

// /**
//  * Enum representing different dependency injection scopes
//  */
// export enum Scope {
//   Singleton = 'Singleton',
//   Transient = 'Transient',
//   Request = 'Request'
// }

// /**
//  * Type alias for Inversify ServiceIdentifier
//  */
// export type ServiceIdentifier<T = any> = interfaces.ServiceIdentifier<T>;

// /**
//  * Base provide decorator that wraps inversify-binding-decorators' fluentProvide
//  * @param identifier - The service identifier to bind to
//  * @returns Decorator function
//  */
// export const provide = (identifier: ServiceIdentifier) => {
//   return fluentProvide(identifier);
// };

// /**
//  * Injectable decorator with configurable scope
//  * @param scope - The scope for the injectable (default: Transient)
//  * @returns Class decorator
//  *
//  * @example
//  * @Injectable(Scope.Singleton)
//  * class MyService {}
//  */
// export const Injectable = (scope: Scope = Scope.Transient) => {
//   return (target: any) => {
//     injectable()(target);
//     const identifier = Symbol.for(target.name);
//     const binding = container.bind(identifier).to(target);

//     switch (scope) {
//       case Scope.Singleton:
//         binding.inSingletonScope();
//         break;

//       case Scope.Request:
//         binding.inRequestScope();
//         break;

//       default:
//         binding.inTransientScope();
//     }

//     return target;
//   };
// };

// /**
//  * Service decorator for automatic registration with options
//  * @param options - Configuration options including scope and custom name
//  * @returns Class decorator
//  *
//  * @example
//  * @Service({ scope: Scope.Singleton, name: 'CustomName' })
//  * class MyService {}
//  */
// export const Service = (options: { scope?: Scope; name?: string } = {}) => {
//   return (target: any) => {
//     const identifier = Symbol.for(options.name || target.name);
//     const binding = container.bind(identifier).to(target);

//     switch (options.scope) {
//       case Scope.Singleton:
//         binding.inSingletonScope();
//         break;

//       case Scope.Request:
//         binding.inRequestScope();
//         break;

//       default:
//         binding.inTransientScope();
//     }

//     return target;
//   };
// };

// /**
//  * Factory decorator for registering factory providers
//  * @param factory - The factory function to create instances
//  * @returns Class decorator
//  *
//  * @example
//  * @Factory<MyService>((context) => () => new MyService())
//  * class MyServiceFactory {}
//  */
// export const Factory = <T>(factory: interfaces.FactoryCreator<T>) => {
//   return (target: any) => {
//     const identifier = Symbol.for(target.name);

//     container.bind<T>(identifier).toFactory(factory);

//     return target;
//   };
// };

// /**
//  * Inject decorator with optional service identifier
//  * @param identifier - Optional custom service identifier
//  * @returns Property or parameter decorator
//  *
//  * @example
//  * class MyClass {
//  *   @Inject(Symbol.for('MyService'))
//  *   private service: MyService;
//  * }
//  */
// export const Inject = (identifier?: ServiceIdentifier) => {
//   return (
//     target: any,
//     propertyKey: string | symbol,
//     parameterIndex?: number
//   ) => {
//     const type = Reflect.getMetadata('design:type', target, propertyKey);
//     const actualIdentifier = identifier || Symbol.for(type.name);

//     inject(actualIdentifier)(target, propertyKey, parameterIndex);
//   };
// };

// /**
//  * LazyInject decorator for property injection with lazy resolution
//  * @param identifier - Optional custom service identifier
//  * @returns Property decorator
//  *
//  * @example
//  * class MyClass {
//  *   @LazyInject()
//  *   private service: MyService; // Will be resolved when first accessed
//  * }
//  */
// export const LazyInject = (identifier?: ServiceIdentifier) => {
//   return (target: any, propertyKey: string) => {
//     const type = Reflect.getMetadata('design:type', target, propertyKey);
//     const actualIdentifier = identifier || Symbol.for(type.name);

//     Object.defineProperty(target, propertyKey, {
//       get: () => container.get(actualIdentifier),
//       enumerable: true,
//       configurable: true
//     });
//   };
// };

// /**
//  * Decorator to register a class as a singleton in the container
//  * Combines @injectable() and automatic registration with singleton scope
//  * @returns Class decorator
//  *
//  * @example
//  * @Singleton()
//  * class MyService {}
//  */
// export function Singleton() {
//   return Injectable(Scope.Singleton);
// }

// /**
//  * Options for AutoRegister decorator
//  */
// export interface AutoRegisterOptions {
//   singleton?: boolean;
//   useClass?: any;
//   token?: symbol;
//   autoBind?: boolean;
// }

// /**
//  * Decorator to automatically register a class with inversify
//  * @param options - Registration options
//  * @returns Class decorator
//  *
//  * @example
//  * @AutoRegister({ singleton: true })
//  * class MyService {}
//  */
// export function AutoRegister(options: AutoRegisterOptions = {}) {
//   return function (target: any) {
//     injectable()(target);
//     const token = options.token || Symbol.for(target.name);

//     if (options.useClass) {
//       container.bind(token).to(options.useClass);
//     } else {
//       container.bind(token).to(target);
//     }

//     if (options.singleton) {
//       container.bind(token).to(target).inSingletonScope();
//     }

//     if (options.autoBind) {
//       const paramTypes = Reflect.getMetadata('design:paramtypes', target);

//       if (paramTypes) {
//         paramTypes.forEach((paramType: any, index: number) => {
//           if (paramType && paramType.name !== 'Object') {
//             const paramToken = Symbol.for(paramType.name);

//             container.bind(paramToken).to(paramType);
//           }
//         });
//       }
//     }

//     return target;
//   };
// }

// /**
//  * Decorator to inject dependencies with automatic token resolution
//  * @param token - Optional custom token to use for injection
//  * @returns Parameter decorator
//  *
//  * @example
//  * class MyService {
//  *   constructor(@AutoInject() dependency: MyDependency) {}
//  * }
//  */
// export function AutoInject(token?: symbol) {
//   return function (
//     target: any,
//     propertyKey: string | symbol,
//     parameterIndex: number
//   ) {
//     const resolvedToken = token || Symbol.for(target.constructor.name);

//     inject(resolvedToken)(target, propertyKey, parameterIndex);
//   };
// }

// /**
//  * Decorator to inject dependencies lazily with automatic token resolution
//  * @param token - Optional custom token to use for injection
//  * @returns Property decorator
//  *
//  * @example
//  * class MyService {
//  *   @AutoLazyInject()
//  *   private dependency: MyDependency;
//  * }
//  */
// export function AutoLazyInject(token?: symbol) {
//   return function (target: any, propertyKey: string | symbol) {
//     const resolvedToken = token || Symbol.for(target.constructor.name);

//     LazyInject(resolvedToken)(target, propertyKey);
//   };
// }

// /**
//  * Decorator to automatically register and inject dependencies
//  * @returns Class decorator
//  *
//  * @example
//  * @AutoInjectable()
//  * class MyService {
//  *   constructor(dependency: MyDependency) {}
//  * }
//  */
// export function AutoInjectable() {
//   return function (target: any) {
//     const paramTypes = Reflect.getMetadata('design:paramtypes', target);

//     if (paramTypes) {
//       paramTypes.forEach((paramType: any, index: number) => {
//         if (paramType && paramType.name !== 'Object') {
//           const paramToken = Symbol.for(paramType.name);

//           container.bind(paramToken).to(paramType);
//         }
//       });
//     }

//     return target;
//   };
// }

// /**
//  * Decorator to register a class as a transient service
//  * @returns Class decorator
//  *
//  * @example
//  * @Transient()
//  * class MyService {}
//  */
// export function Transient() {
//   return Injectable(Scope.Transient);
// }

// /**
//  * Decorator to register a class as a request-scoped service
//  * @returns Class decorator
//  *
//  * @example
//  * @RequestScoped()
//  * class MyService {}
//  * /
//  * export function RequestScoped() {
//  * return Injectable(Scope.Request);
//  * }
//  *
//  */
// export function RequestScoped() {
//   return Injectable(Scope.Request);
// }
