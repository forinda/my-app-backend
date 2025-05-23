import { Container, injectable } from 'inversify';
import { autoBind } from './auto-bind';

const di = new Container({ defaultScope: 'Singleton' });

export function dependency() {
  return <T extends new (...args: []) => any>(target: T) => {
    injectable()(target);
    autoBind()(target);
    di.bind<T>(target).toSelf();
  };
}

export { di };
